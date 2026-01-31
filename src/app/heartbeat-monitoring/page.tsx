import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Heartbeat Monitoring — Dead Man\'s Switch for Your Cron Jobs | CronSafe',
  description: 'Heartbeat monitoring ensures your cron jobs and background processes are running. If a heartbeat ping is missed, CronSafe alerts you instantly. Free for up to 3 monitors.',
  keywords: ['heartbeat monitoring', 'dead mans switch', 'heartbeat check', 'ping monitoring', 'process heartbeat', 'dead man switch cron', 'cron heartbeat'],
  alternates: {
    canonical: '/heartbeat-monitoring',
  },
  openGraph: {
    title: 'Heartbeat Monitoring — Dead Man\'s Switch | CronSafe',
    description: 'Heartbeat monitoring for cron jobs and background processes. Get instant alerts when a heartbeat is missed.',
    type: 'website',
    images: ['/og-image.png'],
  },
};

const faqs = [
  {
    question: 'What is heartbeat monitoring?',
    answer: 'Heartbeat monitoring (also called a dead man\'s switch) works by expecting regular "I\'m alive" pings from your application or cron job. If CronSafe doesn\'t receive a ping within the expected window, it assumes something is wrong and fires an alert. Unlike uptime monitoring that checks from the outside, heartbeat monitoring works from the inside — your code tells CronSafe it\'s healthy.',
  },
  {
    question: 'How is heartbeat monitoring different from uptime monitoring?',
    answer: 'Uptime monitoring pings your server from the outside to check if it responds. Heartbeat monitoring works the opposite way — your server pings CronSafe to confirm it\'s running. This makes heartbeat monitoring ideal for background processes, cron jobs, and internal services that don\'t have a public URL.',
  },
  {
    question: 'What is a dead man\'s switch?',
    answer: 'A dead man\'s switch is a safety mechanism that triggers when a human (or process) fails to perform a regular action. In software, it means a system that expects periodic signals — if the signal stops, an alert fires. CronSafe\'s heartbeat monitoring is a dead man\'s switch for your scheduled tasks and background jobs.',
  },
  {
    question: 'Can I monitor processes that run on a schedule and ones that run continuously?',
    answer: 'Yes. For scheduled jobs (like cron), you ping CronSafe at the end of each successful run. For long-running processes (like workers or daemons), you set up a periodic ping — say every 5 minutes — and CronSafe alerts you if the interval is missed. Both patterns work seamlessly.',
  },
  {
    question: 'How quickly does CronSafe alert when a heartbeat is missed?',
    answer: 'Alerts fire as soon as your grace period expires. If your job runs every hour with a 5-minute grace period, you\'ll be alerted 65 minutes after the last successful ping. For critical processes with short intervals, you can get alerts within minutes of failure.',
  },
  {
    question: 'What can I monitor with heartbeat pings?',
    answer: 'Anything that can make an HTTP request: cron jobs, background workers, ETL pipelines, database backups, email senders, data sync processes, Kubernetes CronJobs, Lambda functions, CI/CD pipelines, and more. If it runs and you want to know when it stops, heartbeat monitoring is for you.',
  },
  {
    question: 'Is CronSafe\'s heartbeat monitoring free?',
    answer: 'Yes — the free plan includes up to 3 heartbeat monitors with email alerts and 24-hour history. No credit card required. The Pro plan ($9/mo) adds unlimited monitors, Slack/Discord integration, and 90-day history.',
  },
];

const useCases = [
  { icon: '⏰', title: 'Cron Jobs', desc: 'Append a curl to any cron job. If it doesn\'t ping on time, you know immediately.' },
  { icon: '🔄', title: 'Background Workers', desc: 'Sidekiq, Celery, Bull — add a periodic heartbeat and catch worker crashes.' },
  { icon: '📦', title: 'ETL Pipelines', desc: 'Monitor data pipelines that run on schedules. Know when transforms fail.' },
  { icon: '🐳', title: 'Docker Containers', desc: 'Add a heartbeat to containerized processes. Catch OOM kills and silent exits.' },
  { icon: '☁️', title: 'Serverless Functions', desc: 'Monitor AWS Lambda, Cloudflare Workers, and Vercel cron invocations.' },
  { icon: '🗄️', title: 'Database Backups', desc: 'Ensure nightly backups actually complete. Sleep easy knowing your data is safe.' },
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

export default function HeartbeatMonitoringPage() {
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
    name: 'CronSafe — Heartbeat Monitoring',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Heartbeat monitoring and dead man\'s switch for cron jobs and background processes. Free for up to 3 monitors.',
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <NavBar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-red-600/8 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Dead man&apos;s switch for your infrastructure
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">
            Heartbeat{" "}
            <span className="text-brand-400">Monitoring</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 sm:text-xl text-balance">
            Your background processes should check in regularly. When they stop, CronSafe notices
            instantly and alerts you — before your users even know something&apos;s wrong.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/login" className="w-full sm:w-auto rounded-xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-colors">
              Start Monitoring — Free
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto rounded-xl border border-zinc-700 bg-zinc-800/50 px-8 py-3.5 text-base font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors">
              How It Works ↓
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-500">No credit card • Works with any language • 60-second setup</p>

          {/* Diagram */}
          <div className="mt-16 mx-auto max-w-2xl">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
                    <span className="text-2xl">🖥️</span>
                  </div>
                  <p className="text-sm font-medium text-white">Your Server</p>
                  <p className="text-xs text-zinc-500 mt-1">Sends pings</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="h-0.5 w-6 bg-brand-500/50" />
                    <span className="text-brand-400 text-lg">→ ping →</span>
                    <div className="h-0.5 w-6 bg-brand-500/50" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Every N minutes</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <p className="text-sm font-medium text-white">CronSafe</p>
                  <p className="text-xs text-zinc-500 mt-1">Watches for silence</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                <p className="text-sm text-zinc-400">
                  <span className="text-red-400 font-medium">Ping missed?</span> → Alert fires via email, Slack, Discord, or webhook
                </p>
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
              How heartbeat monitoring works
            </h2>
            <p className="mt-4 text-lg text-zinc-400">It&apos;s the opposite of uptime monitoring — your code tells us it&apos;s alive.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '1', icon: '🔗', title: 'Get Your Ping URL', desc: 'Create a monitor and get a unique URL. Tell CronSafe how often to expect pings and set a grace period for slow runs.' },
              { step: '2', icon: '💓', title: 'Send Heartbeats', desc: 'Add a simple HTTP request at the end of your process. Every language works — curl, fetch, requests, http.get. One line of code.' },
              { step: '3', icon: '🔔', title: 'Get Alerted on Silence', desc: 'If CronSafe doesn\'t hear from your process within the expected window, alerts fire immediately. No ping = something\'s wrong.' },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/10 text-2xl">{item.icon}</div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-400">Step {item.step}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Code Examples */}
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
              <div className="border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-400">Bash / Cron</span>
              </div>
              <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
{`# Run backup, then ping CronSafe
/opt/backup.sh && \\
  curl -fsS https://cronsafe.dev/ping/abc123`}
              </pre>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
              <div className="border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-400">Python</span>
              </div>
              <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
{`import requests

def run_job():
    process_data()
    # Heartbeat: tell CronSafe we're alive
    requests.get("https://cronsafe.dev/ping/abc123")`}
              </pre>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
              <div className="border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-400">Node.js</span>
              </div>
              <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
{`// Long-running worker heartbeat
setInterval(async () => {
  await fetch("https://cronsafe.dev/ping/abc123");
}, 5 * 60 * 1000); // every 5 min`}
              </pre>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
              <div className="border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-400">Docker / Kubernetes</span>
              </div>
              <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
{`# Dockerfile healthcheck + heartbeat
HEALTHCHECK --interval=5m CMD \\
  curl -f http://localhost/health && \\
  curl -fsS https://cronsafe.dev/ping/abc123`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">What to monitor with heartbeats</h2>
            <p className="mt-4 text-lg text-zinc-400">If it runs on a schedule or in the background, it needs a heartbeat</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors">
                <div className="mb-3 text-2xl">{item.icon}</div>
                <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Heartbeat vs. Uptime Monitoring</h2>
            <p className="mt-4 text-lg text-zinc-400">Different problems, different solutions. Here&apos;s when to use each.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-brand-500/30 bg-brand-600/5 p-8">
              <h3 className="text-xl font-bold text-brand-400 mb-4">💓 Heartbeat Monitoring</h3>
              <p className="text-sm text-zinc-400 mb-6">Your process pings CronSafe. Silence = problem.</p>
              <ul className="space-y-3">
                {[
                  'Cron jobs & scheduled tasks',
                  'Background workers & queues',
                  'ETL & data pipelines',
                  'Internal services (no public URL)',
                  'Serverless function invocations',
                  'Backup & maintenance scripts',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-brand-400 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8">
              <h3 className="text-xl font-bold text-zinc-300 mb-4">🌐 Uptime Monitoring</h3>
              <p className="text-sm text-zinc-400 mb-6">CronSafe pings your URL. No response = problem.</p>
              <ul className="space-y-3">
                {[
                  'Public websites & APIs',
                  'Load balancers & proxies',
                  'DNS resolution checks',
                  'SSL certificate expiry',
                  'HTTP status code monitoring',
                  'Response time tracking',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-zinc-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-zinc-500">
            CronSafe specializes in heartbeat monitoring. For traditional uptime monitoring, check out UptimeRobot or Pingdom.
          </p>
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
          <h2 className="text-3xl font-bold text-white mb-4">Never miss a failed process again</h2>
          <p className="text-lg text-zinc-400 mb-8">
            Set up heartbeat monitoring in 60 seconds. Free for up to 3 monitors.
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
            <Link href="/free-cron-job-monitoring" className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors">
              <h4 className="font-semibold text-white mb-1">Free Cron Job Monitoring →</h4>
              <p className="text-sm text-zinc-400">Monitor your cron jobs and get alerts when they fail</p>
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
