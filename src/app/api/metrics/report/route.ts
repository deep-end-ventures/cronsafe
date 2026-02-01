import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint allows the dashboard (or cron jobs) to push metrics
// POST /api/metrics/report
// Body: { startup_id, metric_type, value } or { startup_id, event_type, title, description }

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    // Simple API key check (use service role key as auth)
    const authHeader = request.headers.get('authorization')
    const expectedKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = getAdminClient()

    // Handle metric reporting
    if (body.metric_type) {
      const { startup_id, metric_type, value } = body
      if (!startup_id || !metric_type || value === undefined) {
        return NextResponse.json({ error: 'Missing required fields: startup_id, metric_type, value' }, { status: 400 })
      }

      const { error } = await supabase.from('portfolio_metrics').insert({
        startup_id,
        metric_type,
        value: Number(value),
      })

      if (error) throw error
      return NextResponse.json({ success: true, type: 'metric' })
    }

    // Handle activity event reporting
    if (body.event_type) {
      const { startup_id, event_type, title, description } = body
      if (!event_type || !title) {
        return NextResponse.json({ error: 'Missing required fields: event_type, title' }, { status: 400 })
      }

      const { error } = await supabase.from('activity_log').insert({
        startup_id: startup_id || null,
        event_type,
        title,
        description: description || '',
      })

      if (error) throw error
      return NextResponse.json({ success: true, type: 'activity' })
    }

    // Handle payment event reporting
    if (body.amount_usd !== undefined) {
      const { startup_id, amount_usd, currency, wallet_tx_hash, payer_email, description } = body
      if (!startup_id) {
        return NextResponse.json({ error: 'Missing required field: startup_id' }, { status: 400 })
      }

      const { error } = await supabase.from('payment_events').insert({
        startup_id,
        amount_usd: Number(amount_usd),
        currency: currency || 'USDC',
        wallet_tx_hash: wallet_tx_hash || null,
        payer_email: payer_email || null,
        description: description || null,
      })

      if (error) throw error
      return NextResponse.json({ success: true, type: 'payment' })
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  } catch (error) {
    console.error('Metrics report error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to retrieve metrics for a specific startup
export async function GET(request: NextRequest) {
  // Auth check — require the same service role key as POST
  const authHeader = request.headers.get('authorization')
  const expectedKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const startupId = searchParams.get('startup_id')

  const supabase = getAdminClient()

  try {
    // Count auth users
    const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1 })
    const userCount = usersData?.users?.length ?? 0

    // Get latest metrics
    const metricsQuery = supabase
      .from('portfolio_metrics')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(10)

    if (startupId) {
      metricsQuery.eq('startup_id', startupId)
    }

    const { data: metrics } = await metricsQuery

    return NextResponse.json({
      auth_users: userCount,
      metrics: metrics || [],
      startup_id: startupId || 'cronsafe',
    })
  } catch (error) {
    console.error('Metrics GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
