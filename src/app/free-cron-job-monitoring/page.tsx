import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Cron Job Monitoring — Get Alerts When Jobs Fail | CronSafe',
  description: 'Monitor your cron jobs for free. Get instant email and webhook alerts when scheduled tasks fail or miss their deadline. No credit card required. Set up in 60 seconds.',
  keywords: ['free cron job monitoring', 'cron monitoring', 'cron job monitor free', 'cron job alerts', 'cron failure detection', 'scheduled task monitoring free'],
  alternates: {
    canonical: '/free-cron-job-monitoring',
  },
  openGraph: {
    title: 'Free Cron Job Monitoring | CronSafe',
    description: 'Monitor your cron jobs for free. Instant alerts when jobs fail. Setup in 60 seconds.',
    type: 'website',
    images: ['/og-image.png'],
  },
};

const faqs = [
  {
    question: 'Is CronSafe really free for cron job monitoring?',
    answer: 'Yes! The free plan includes up to 3 monitors with email alerts and 24-hour ping history. No credit card required. Our Pro plan ($9/mo) adds unlimited monitors, Slack/Discord integration, and 90-day history.',
  },
  {
    question: 'How does cron job monitoring work?',
    answer: 'You add a simple curl command to the end of your cron job. Each time the job runs successfully, it pings a unique CronSafe URL. If we don\'t receive a ping within your expected interval (plus grace period), we send you an alert.',
  },
  {
    question: 'What happens if my cron job fails?',
    answer: 'When your cron job fails, it won\'t send the ping to CronSafe. After the expected interval plus your configured grace period passes without a ping, CronSafe immediately sends alerts via your chosen channels — email, webhook, Slack, or Discord.',
  },
  {
    question: 'Can I monitor cron jobs on any server?',
    answer: 'Yes. CronSafe works with any cron job on any server — Linux, macOS, Docker containers, Kubernetes, cloud functions, CI/CD pipelines, or any system that can make an HTTP request. If it can run curl or wget, it can ping CronSafe.',
  },
  {
    question: 'How fast are the alerts?',
    answer: 'Alerts fire as soon as your grace period expires. Ping ingestion happens at the edge with sub-second latency. Email alerts typically arrive within 30 seconds of the missed deadline.',
  },
  {
    question: 'Do I need to install anything?',
    answer: 'No installation needed. CronSafe is a hosted service. You just add one curl command to your existing cron job — a single line of code. No agents, no daemons, no SDKs.',
  },
  {
    question: 'What makes CronSafe different from Healthchecks.io or Cronitor?',
    answer: 'CronSafe offers a generous free tier with no signup friction (no account required to start), sub-second edge-deployed ping ingestion, and a developer-first experience. We also accept crypto payments (USDC on Base) and are built for indie hackers and small teams.',
  },
];

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Cron<span className="text-brand-400">Safe</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="hidden text-sm text-zinc-400 hover:text-white sm:block">Blog</Link>
            <Link href="/pricing" className="hidden text-sm text-zinc-400 hover:text-white sm:block">Pricing</Link>
            <Link href="/auth/login" className="text-sm text-zinc-400 hover:text-white">Log in</Link>
            <Link href="/auth/login" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors">
              Start Free →
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-lg font-bold text-white">
            Cron<span className="text-brand-400">Safe</span>
          </span>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/free-cron-job-monitoring" className="hover:text-white">Cron Monitoring</Link>
            <Link href="/heartbeat-monitoring" className="hover:text-white">Heartbeat Monitoring</Link>
            <Link href="/uptime-monitoring-scheduled-tasks" className="hover:text-white">Uptime Monitoring</Link>
          </div>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} CronSafe. A{" "}
            <a href="https://deependventures.com" className="text-zinc-400 hover:text-white" target="_blank" rel="noopener noreferrer">Deep End Ventures</a>
            {" "}company.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function FreeCronJobMonitoringPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CronSafe — Free Cron Job Monitoring',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free cron job monitoring with instant alerts. Monitor up to 3 jobs for free. No credit card required.',
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <NavBar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-600/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Free forever — up to 3 monitors
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">
            Free Cron Job{" "}
            <span className="text-brand-400">Monitoring</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 sm:text-xl text-balance">
            Your cron jobs run in the dark. When they fail, nobody knows — until something breaks.
            CronSafe watches every job and alerts you instantly when something stops running.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/login" className="w-full sm:w-auto rounded-xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-colors">
              Start Monitoring — Free
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto rounded-xl border border-zinc-700 bg-zinc-800/50 px-8 py-3.5 text-base font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors">
              How It Works ↓
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-500">No credit card • No agent to install • 60-second setup</p>

          {/* Code snippet */}
          <div className="mt-16 mx-auto max-w-xl">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="ml-2 text-xs text-zinc-500">your-server:~$</span>
              </div>
              <div className="p-4 sm:p-6 font-mono text-sm sm:text-base text-left">
                <div className="text-zinc-500"># Before — silent failures</div>
                <div className="text-red-400/70">0 2 * * * /opt/backup.sh</div>
                <div className="mt-3 text-zinc-500"># After — monitored with CronSafe</div>
                <div className="text-green-400">
                  0 2 * * * /opt/backup.sh <span className="text-brand-400">&amp;&amp;</span> curl -fsS https://cronsafe.dev/ping/<span className="text-amber-400">your-id</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Set up monitoring in 60 seconds
            </h2>
            <p className="mt-4 text-lg text-zinc-400">Three steps. One line of code. That&apos;s all you need.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '1', icon: '📋', title: 'Create a Monitor', desc: 'Give it a name, set how often your job should run (every 5 min, hourly, daily), and configure a grace period for slow runs.' },
              { step: '2', icon: '🔗', title: 'Add One Curl', desc: 'Append a simple curl to your cron job. When the job succeeds, it pings your unique CronSafe URL. One line. Done.' },
              { step: '3', icon: '🚨', title: 'Get Alerted', desc: 'If the ping doesn\'t arrive on time, CronSafe fires alerts via email, webhook, Slack, or Discord. Instantly.' },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/10 text-2xl">{item.icon}</div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-400">Step {item.step}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">What you can monitor</h2>
            <p className="mt-4 text-lg text-zinc-400">CronSafe works with any scheduled or background task</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '🗄️', title: 'Database Backups', desc: 'Know instantly if your nightly pg_dump, mysqldump, or mongodump fails to run.' },
              { icon: '📧', title: 'Email Digests', desc: 'Monitor weekly newsletter sends, digest emails, and notification batches.' },
              { icon: '🔄', title: 'Data Syncs', desc: 'Watch ETL pipelines, API syncs, and data import/export jobs.' },
              { icon: '🧹', title: 'Cleanup Jobs', desc: 'Track log rotation, temp file cleanup, and cache purging tasks.' },
              { icon: '📊', title: 'Report Generation', desc: 'Monitor daily/weekly report generation and delivery jobs.' },
              { icon: '🔐', title: 'SSL & Security', desc: 'Watch certificate renewal jobs, security scans, and audit tasks.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors">
                <div className="mb-3 text-2xl">{item.icon}</div>
                <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">How CronSafe compares</h2>
            <p className="mt-4 text-lg text-zinc-400">See why developers choose CronSafe for cron monitoring</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse overflow-hidden rounded-xl border border-zinc-800">
              <thead>
                <tr className="bg-zinc-900">
                  <th className="text-left p-4 text-sm font-semibold text-zinc-300 border-b border-zinc-800">Feature</th>
                  <th className="p-4 text-sm font-semibold text-brand-400 border-b border-zinc-800 bg-brand-600/5">CronSafe</th>
                  <th className="p-4 text-sm font-semibold text-zinc-300 border-b border-zinc-800">Healthchecks.io</th>
                  <th className="p-4 text-sm font-semibold text-zinc-300 border-b border-zinc-800">Cronitor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Free tier', cronsafe: '✅ 3 monitors', healthchecks: '✅ 20 monitors', cronitor: '✅ 5 monitors' },
                  { feature: 'No signup required', cronsafe: '✅', healthchecks: '❌', cronitor: '❌' },
                  { feature: 'Edge-deployed pings', cronsafe: '✅ Sub-second', healthchecks: '⚠️ Single region', cronitor: '✅ Multi-region' },
                  { feature: 'Email alerts', cronsafe: '✅ Free', healthchecks: '✅ Free', cronitor: '✅ Free' },
                  { feature: 'Slack / Discord', cronsafe: '✅ Pro', healthchecks: '✅ Free', cronitor: '💰 $20/mo' },
                  { feature: 'Webhook alerts', cronsafe: '✅ Free', healthchecks: '✅ Free', cronitor: '✅ Free' },
                  { feature: 'Crypto payments', cronsafe: '✅ USDC', healthchecks: '❌', cronitor: '❌' },
                  { feature: 'Starting price', cronsafe: '$0', healthchecks: '$0', cronitor: '$0' },
                  { feature: 'Pro price', cronsafe: '$9/mo', healthchecks: '$20/mo', cronitor: '$20/mo' },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-zinc-800/50 last:border-b-0">
                    <td className="p-4 text-sm text-zinc-300 font-medium">{row.feature}</td>
                    <td className="p-4 text-sm text-center bg-brand-600/5 font-medium text-zinc-200">{row.cronsafe}</td>
                    <td className="p-4 text-sm text-center text-zinc-400">{row.healthchecks}</td>
                    <td className="p-4 text-sm text-center text-zinc-400">{row.cronitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start monitoring your cron jobs — free</h2>
          <p className="text-lg text-zinc-400 mb-8">
            Add one line of code. Get alerts when things break. It&apos;s that simple.
          </p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-colors">
            Start Monitoring — Free →
          </Link>
          <p className="mt-3 text-sm text-zinc-500">No credit card required</p>
        </div>
      </section>

      {/* Cross-links */}
      <section className="border-t border-zinc-800/50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-6">More from CronSafe</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/heartbeat-monitoring" className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors">
              <h4 className="font-semibold text-white mb-1">Heartbeat Monitoring →</h4>
              <p className="text-sm text-zinc-400">Dead man&apos;s switch for any scheduled process</p>
            </Link>
            <Link href="/uptime-monitoring-scheduled-tasks" className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors">
              <h4 className="font-semibold text-white mb-1">Uptime for Scheduled Tasks →</h4>
              <p className="text-sm text-zinc-400">Ensure your background jobs never silently die</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
