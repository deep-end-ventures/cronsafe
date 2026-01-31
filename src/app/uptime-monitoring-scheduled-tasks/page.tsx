import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Uptime Monitoring for Scheduled Tasks — Never Miss a Failed Job | CronSafe',
  description: 'Ensure your scheduled tasks, background jobs, and cron processes stay running. CronSafe monitors uptime for any recurring task and alerts you the moment something stops. Free for 3 monitors.',
  keywords: ['uptime monitoring scheduled tasks', 'background job monitoring', 'scheduled task uptime', 'cron job uptime', 'job failure detection', 'task monitoring tool', 'recurring job monitor'],
  alternates: {
    canonical: '/uptime-monitoring-scheduled-tasks',
  },
  openGraph: {
    title: 'Uptime Monitoring for Scheduled Tasks | CronSafe',
    description: 'Monitor the uptime of scheduled tasks and background jobs. Get alerts when recurring processes fail.',
    type: 'website',
    images: ['/og-image.png'],
  },
};

const faqs = [
  {
    question: 'What does "uptime monitoring for scheduled tasks" mean?',
    answer: 'Traditional uptime monitoring checks if a website is reachable. Uptime monitoring for scheduled tasks checks if a recurring process (cron job, background worker, ETL pipeline) actually ran on time. CronSafe tracks the execution cadence of your tasks and alerts you when any task goes overdue — ensuring 100% operational uptime for your background infrastructure.',
  },
  {
    question: 'How is this different from regular uptime monitoring tools?',
    answer: 'Tools like UptimeRobot or Pingdom monitor HTTP endpoints — they check if your website responds. But they can\'t tell if your nightly database backup ran, or if your email digest cron fired. CronSafe monitors the jobs themselves by expecting pings from your code. If the ping doesn\'t arrive, the task didn\'t run.',
  },
  {
    question: 'Can I see the uptime percentage for each scheduled task?',
    answer: 'Yes. CronSafe tracks every ping and calculates uptime metrics for each monitor. You can see success rate, average run time, miss count, and a timeline view of when each task ran or missed. Pro plan includes 90-day history for trend analysis.',
  },
  {
    question: 'What types of scheduled tasks can I monitor?',
    answer: 'Any task that runs on a recurring schedule: Linux cron jobs, Windows Task Scheduler, Kubernetes CronJobs, AWS EventBridge rules, Vercel cron, GitHub Actions scheduled workflows, Celery beat tasks, Sidekiq periodic jobs, and custom schedulers. If it runs periodically, CronSafe can monitor it.',
  },
  {
    question: 'How do I set the expected schedule for a task?',
    answer: 'When creating a monitor, you set two things: the expected interval (how often the task should ping — every 5 min, hourly, daily, etc.) and a grace period (extra time allowed for slow runs). CronSafe uses these to determine when a task is overdue.',
  },
  {
    question: 'Can I monitor tasks that run at specific times vs. intervals?',
    answer: 'Yes. You can configure monitors for fixed-schedule tasks (e.g., "runs every day at 2 AM") or interval-based tasks (e.g., "runs every 15 minutes"). CronSafe supports both cron expressions and simple interval configurations.',
  },
  {
    question: 'What if my task runs but takes longer than expected?',
    answer: 'That\'s what the grace period is for. If your backup usually takes 10 minutes but occasionally takes 30, set a grace period of 35 minutes. CronSafe only alerts when the total expected interval plus grace period passes with no ping. You can also send a "start" ping to indicate the job is running but still in progress.',
  },
];

const platforms = [
  { icon: '🐧', name: 'Linux Cron', desc: 'Standard crontab jobs on any Linux server or VM' },
  { icon: '☸️', name: 'Kubernetes', desc: 'CronJobs and recurring pods in K8s clusters' },
  { icon: '⚡', name: 'AWS Lambda', desc: 'EventBridge-triggered Lambda functions' },
  { icon: '▲', name: 'Vercel Cron', desc: 'Vercel\'s built-in cron job invocations' },
  { icon: '🐙', name: 'GitHub Actions', desc: 'Scheduled workflow runs on any cadence' },
  { icon: '🔵', name: 'Cloudflare Workers', desc: 'Cron Triggers for Workers scripts' },
  { icon: '🐍', name: 'Celery Beat', desc: 'Python periodic tasks via Celery' },
  { icon: '💎', name: 'Sidekiq', desc: 'Ruby background job scheduling' },
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

export default function UptimeMonitoringScheduledTasksPage() {
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
    name: 'CronSafe — Uptime Monitoring for Scheduled Tasks',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Monitor the uptime of scheduled tasks, cron jobs, and background processes. Get alerts when recurring jobs fail to run on time.',
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <NavBar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-amber-600/8 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            100% visibility into background infrastructure
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">
            Uptime Monitoring for{" "}
            <span className="text-brand-400">Scheduled Tasks</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 sm:text-xl text-balance">
            Your website has uptime monitoring. Your cron jobs don&apos;t. CronSafe gives every scheduled task
            the same reliability guarantees as your production API — with alerts when anything goes overdue.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/login" className="w-full sm:w-auto rounded-xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-colors">
              Monitor Your Tasks — Free
            </Link>
            <Link href="#platforms" className="w-full sm:w-auto rounded-xl border border-zinc-700 bg-zinc-800/50 px-8 py-3.5 text-base font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors">
              See All Platforms ↓
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-500">Free for 3 monitors • No agent to install • Works everywhere</p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">The invisible infrastructure problem</h2>
            <p className="mt-4 text-lg text-zinc-400">Scheduled tasks fail silently. Here&apos;s how it usually goes:</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <div className="text-2xl mb-3">🌙</div>
              <h3 className="font-semibold text-white mb-2">Night: Task Fails</h3>
              <p className="text-sm text-zinc-400">Your nightly database backup cron job crashes due to a disk space issue. No one is alerted. The server keeps running fine.</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
              <div className="text-2xl mb-3">📅</div>
              <h3 className="font-semibold text-white mb-2">Days Pass: Unnoticed</h3>
              <p className="text-sm text-zinc-400">The backup hasn&apos;t run in 5 days. Your website is up. Your API is healthy. All monitoring dashboards show green.</p>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <div className="text-2xl mb-3">💥</div>
              <h3 className="font-semibold text-white mb-2">Disaster: Data Loss</h3>
              <p className="text-sm text-zinc-400">A database corruption occurs. You go to restore from backup — and discover your last backup is from last week. Unrecoverable data lost.</p>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-brand-500/30 bg-brand-600/5 p-6 text-center">
            <p className="text-brand-400 font-semibold mb-1">With CronSafe:</p>
            <p className="text-sm text-zinc-400">You&apos;d have gotten an alert the first night. The backup would have been fixed within hours, not discovered days later.</p>
          </div>
        </div>
      </section>

      {/* Platform Support */}
      <section id="platforms" className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Works with every platform</h2>
            <p className="mt-4 text-lg text-zinc-400">If your task can make an HTTP request, CronSafe can monitor it</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platforms.map((p) => (
              <div key={p.name} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 hover:border-zinc-700 transition-colors">
                <div className="text-2xl mb-2">{p.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{p.name}</h3>
                <p className="text-xs text-zinc-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Everything you need for task uptime</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              { icon: '📊', title: 'Uptime Dashboard', desc: 'See the health of all your scheduled tasks at a glance. Success rate, last run, next expected ping — all in one view.' },
              { icon: '⏱️', title: 'Flexible Scheduling', desc: 'Support for cron expressions, simple intervals, and fixed times. Configure expected cadence and grace periods per monitor.' },
              { icon: '🔔', title: 'Multi-Channel Alerts', desc: 'Get notified via email, webhook, Slack, or Discord. Set up escalation policies for critical tasks.' },
              { icon: '📈', title: 'History & Trends', desc: 'Track how reliable each task is over time. Identify flaky jobs, spot patterns, and improve infrastructure stability.' },
              { icon: '🌍', title: 'Edge-Deployed Ingestion', desc: 'Pings are received at edge locations worldwide with sub-second latency. No added delay to your job execution.' },
              { icon: '🔑', title: 'No Agents Required', desc: 'Zero installation. Just one HTTP request from your code. Works with any language, any platform, any infrastructure.' },
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 sm:py-28 border-t border-zinc-800/50">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Task monitoring vs. website monitoring</h2>
            <p className="mt-4 text-lg text-zinc-400">They solve different problems. You probably need both.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse overflow-hidden rounded-xl border border-zinc-800">
              <thead>
                <tr className="bg-zinc-900">
                  <th className="text-left p-4 text-sm font-semibold text-zinc-300 border-b border-zinc-800" />
                  <th className="p-4 text-sm font-semibold text-brand-400 border-b border-zinc-800 bg-brand-600/5">CronSafe (Tasks)</th>
                  <th className="p-4 text-sm font-semibold text-zinc-300 border-b border-zinc-800">UptimeRobot (Websites)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'What it monitors', cronsafe: 'Background jobs, cron, workers', uptime: 'HTTP endpoints, websites' },
                  { feature: 'Direction', cronsafe: 'Your code → CronSafe', uptime: 'Service → Your server' },
                  { feature: 'Detects', cronsafe: 'Silent failures, missed runs', uptime: 'Downtime, slow responses' },
                  { feature: 'Requires public URL', cronsafe: '❌ No', uptime: '✅ Yes' },
                  { feature: 'Works for internal services', cronsafe: '✅ Yes', uptime: '❌ No' },
                  { feature: 'Free tier', cronsafe: '3 monitors', uptime: '50 monitors' },
                  { feature: 'Setup time', cronsafe: '60 seconds', uptime: '2 minutes' },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-zinc-800/50 last:border-b-0">
                    <td className="p-4 text-sm text-zinc-300 font-medium">{row.feature}</td>
                    <td className="p-4 text-sm text-center bg-brand-600/5 font-medium text-zinc-200">{row.cronsafe}</td>
                    <td className="p-4 text-sm text-center text-zinc-400">{row.uptime}</td>
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
          <h2 className="text-3xl font-bold text-white mb-4">Give your scheduled tasks the monitoring they deserve</h2>
          <p className="text-lg text-zinc-400 mb-8">
            Your API has uptime monitoring. Your database has uptime monitoring. It&apos;s time your cron jobs did too.
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
            <Link href="/heartbeat-monitoring" className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors">
              <h4 className="font-semibold text-white mb-1">Heartbeat Monitoring →</h4>
              <p className="text-sm text-zinc-400">Dead man&apos;s switch for any scheduled process</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
