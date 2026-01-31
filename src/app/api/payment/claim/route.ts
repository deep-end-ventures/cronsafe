import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy-init Supabase client to avoid build-time env var errors
function getCentralSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, plan, tx_hash, amount, payment_ref } = body;

    if (!email || !plan || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: email, plan, amount' },
        { status: 400 }
      );
    }

    const centralSupabase = getCentralSupabase();

    // Insert into payment_events table
    const { data, error } = await centralSupabase
      .from('payment_events')
      .insert({
        product: 'cronsafe',
        email,
        plan,
        tx_hash: tx_hash || null,
        amount,
        currency: 'USDC',
        network: 'base',
        payment_ref: payment_ref || null,
        status: tx_hash ? 'claimed' : 'pending',
        wallet_address: '0xdA904B18a38261B5Ffe78abE5BA744b666e18A44',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Payment claim insert error:', error);
      // If the table doesn't exist yet, still return success for the client
      // The payment is recorded in localStorage as a fallback
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          warning: 'Payment recorded locally — central DB pending setup',
          payment_ref,
        });
      }
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      payment: data,
      payment_ref,
    });
  } catch (err) {
    console.error('Payment claim error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
