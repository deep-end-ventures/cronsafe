'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PaymentModal } from '@/components/PaymentModal';

const freeTierFeatures = [
  'Up to 3 monitors',
  '1 alert channel',
  '24-hour ping history',
  'Email alerts',
  'Unique ping URLs',
  'Status dashboard',
];

const proTierFeatures = [
  'Unlimited monitors',
  'Unlimited alert channels',
  '90-day ping history',
  'Slack integration',
  'Discord integration',
  'SMS & phone call alerts',
  'Team members',
  'Priority support',
];

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none" className="h-8 w-8">
              <defs>
                <linearGradient id="cs-p" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488"/>
                  <stop offset="100%" stopColor="#059669"/>
                </linearGradient>
              </defs>
              <path d="M120 28 L200 65 L200 130 C200 175 165 210 120 225 C75 210 40 175 40 130 L40 65 Z" fill="url(#cs-p)"/>
              <circle cx="120" cy="125" r="45" fill="none" stroke="#ffffff" strokeWidth="5" opacity="0.9"/>
              <circle cx="120" cy="125" r="4" fill="#ffffff"/>
              <line x1="120" y1="125" x2="103" y2="100" stroke="#ffffff" strokeWidth="5" strokeLinecap="round"/>
              <line x1="120" y1="125" x2="145" y2="108" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="158" cy="163" r="18" fill="#059669" stroke="#ffffff" strokeWidth="3"/>
              <polyline points="149,163 155,170 168,156" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-bold text-white">
              Cron<span className="text-brand-400">Safe</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white">Home</Link>
            <Link
              href="/auth/login"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
            >
              Start Free →
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function PricingPage() {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <main className="min-h-screen bg-zinc-950">
      <NavBar />

      <div className="pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Start free with 3 monitors. Upgrade to Pro when you need unlimited power.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Free</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-zinc-500">/month</span>
                </div>
                <p className="mt-3 text-sm text-zinc-400">
                  Perfect for personal projects and small teams.
                </p>
              </div>
              <ul className="mb-8 space-y-3">
                {freeTierFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10">
                      <span className="text-green-500 text-xs">✓</span>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/login"
                className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 text-center text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="relative rounded-2xl border-2 border-brand-600 bg-zinc-900/50 p-8">
              <div className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
                RECOMMENDED
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Pro</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">$9</span>
                  <span className="text-zinc-500">/month</span>
                </div>
                <p className="mt-3 text-sm text-zinc-400">
                  For teams that need unlimited monitoring and integrations.
                </p>
              </div>
              <ul className="mb-8 space-y-3">
                {proTierFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600/20">
                      <span className="text-brand-400 text-xs">✓</span>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowPayment(true)}
                className="block w-full rounded-lg bg-brand-600 py-3 text-center text-sm font-semibold text-white hover:bg-brand-500 transition-colors"
              >
                Upgrade to Pro — $9/mo
              </button>
              <p className="mt-3 text-center text-xs text-zinc-500">
                Pay with USDC on Base network
              </p>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-10">Feature Comparison</h2>
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80">
                    <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-zinc-400">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-brand-400">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {[
                    ['Monitors', '3', 'Unlimited'],
                    ['Alert Channels', '1', 'Unlimited'],
                    ['Ping History', '24 hours', '90 days'],
                    ['Email Alerts', '✓', '✓'],
                    ['Slack Integration', '—', '✓'],
                    ['Discord Integration', '—', '✓'],
                    ['SMS Alerts', '—', '✓'],
                    ['Team Members', '—', '✓'],
                    ['Priority Support', '—', '✓'],
                  ].map(([feature, free, pro]) => (
                    <tr key={feature} className="bg-zinc-900/30 hover:bg-zinc-900/50">
                      <td className="px-6 py-3 text-sm text-zinc-300">{feature}</td>
                      <td className="px-6 py-3 text-center text-sm text-zinc-400">{free}</td>
                      <td className="px-6 py-3 text-center text-sm text-white font-medium">{pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'How do I pay?',
                  a: 'We accept USDC on the Base network. Click "Upgrade to Pro" and send the payment to the provided wallet address. Your Pro access is activated instantly after claiming.',
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Pro is a monthly subscription. If you stop paying, your account returns to the Free tier at the end of the billing period.',
                },
                {
                  q: 'What happens to my monitors on Free?',
                  a: 'On the Free tier, you can have up to 3 active monitors. If you downgrade from Pro, extra monitors are paused (not deleted).',
                },
                {
                  q: 'Do you offer annual pricing?',
                  a: 'Not yet, but it\'s coming soon. Annual plans will offer a 20% discount.',
                },
              ].map((item) => (
                <div key={item.q} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                  <h3 className="text-base font-semibold text-white mb-2">{item.q}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} CronSafe. A{' '}
            <a href="https://deependventures.com" className="text-zinc-400 hover:text-white" target="_blank" rel="noopener noreferrer">
              Deep End Ventures
            </a>{' '}
            company.
          </p>
        </div>
      </footer>

      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            window.location.href = '/dashboard';
          }}
        />
      )}
    </main>
  );
}
