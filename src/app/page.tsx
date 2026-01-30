import Link from "next/link";

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none" className="h-8 w-8">
              <defs>
                <linearGradient id="cs-nav" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488"/>
                  <stop offset="100%" stopColor="#059669"/>
                </linearGradient>
              </defs>
              <path d="M120 28 L200 65 L200 130 C200 175 165 210 120 225 C75 210 40 175 40 130 L40 65 Z" fill="url(#cs-nav)"/>
              <path d="M120 44 L186 75 L186 130 C186 168 156 198 120 211 C84 198 54 168 54 130 L54 75 Z" fill="#ffffff" opacity="0.15"/>
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
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#features"
              className="hidden text-sm text-zinc-400 hover:text-white sm:block"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="hidden text-sm text-zinc-400 hover:text-white sm:block"
            >
              Pricing
            </Link>
            <Link
              href="#how-it-works"
              className="hidden text-sm text-zinc-400 hover:text-white sm:block"
            >
              How It Works
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Log in
            </Link>
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

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-600/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Now in public beta — free forever for small teams
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">
          Your cron jobs fail silently.{" "}
          <span className="text-brand-400">We don&apos;t.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 sm:text-xl text-balance">
          Dead-simple monitoring for cron jobs, background tasks, and scheduled
          pipelines. Add one curl to your job. Get alerted when things stop
          running.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/auth/login"
            className="w-full sm:w-auto rounded-xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-colors"
          >
            Start Monitoring — Free
          </Link>
          <Link
            href="#how-it-works"
            className="w-full sm:w-auto rounded-xl border border-zinc-700 bg-zinc-800/50 px-8 py-3.5 text-base font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            See How It Works
          </Link>
        </div>

        {/* Code snippet preview */}
        <div className="mt-16 mx-auto max-w-xl">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <span className="ml-2 text-xs text-zinc-500">crontab -e</span>
            </div>
            <div className="p-4 sm:p-6 font-mono text-sm sm:text-base text-left">
              <div className="text-zinc-500"># Your existing cron job</div>
              <div className="text-zinc-300">
                0 * * * * /usr/bin/backup.sh
              </div>
              <div className="mt-3 text-zinc-500"># Add CronSafe monitoring</div>
              <div className="text-green-400">
                0 * * * * /usr/bin/backup.sh{" "}
                <span className="text-brand-400">&amp;&amp;</span> curl -fsS
                https://cronsafe.dev/api/ping/
                <span className="text-amber-400">abc123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "1",
      title: "Create a Monitor",
      description:
        "Name it, set the expected interval (every 5 min, hourly, daily), and a grace period.",
      icon: "📋",
    },
    {
      step: "2",
      title: "Add the Ping",
      description:
        'Append a simple curl to your cron job. One line of code. That\'s it.',
      icon: "🔗",
    },
    {
      step: "3",
      title: "Get Alerted",
      description:
        "If the ping doesn't arrive on time, we alert you via email and webhook. Instantly.",
      icon: "🚨",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Three steps. That&apos;s it.
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Set up monitoring in under a minute.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/10 text-2xl">
                {item.icon}
              </div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-400">
                Step {item.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: "⚡",
      title: "Sub-Second Ping Ingestion",
      description:
        "Edge-deployed endpoints around the world. Your pings are recorded instantly.",
    },
    {
      icon: "📧",
      title: "Email + Webhook Alerts",
      description:
        "Get notified via email, Discord, or Slack when your jobs fail to report in.",
    },
    {
      icon: "🔒",
      title: "Unique Ping URLs",
      description:
        "Each monitor gets a unique, unguessable URL. No API keys needed for pinging.",
    },
    {
      icon: "📊",
      title: "Status Dashboard",
      description:
        "See all your monitors at a glance: up, down, in grace period, or paused.",
    },
    {
      icon: "⏰",
      title: "Flexible Schedules",
      description:
        "Every 1 minute to every 30 days. Plus customizable grace periods for slow jobs.",
    },
    {
      icon: "🆓",
      title: "Free Tier",
      description:
        "Monitor up to 20 cron jobs for free. No credit card required. No trial expiration.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 sm:py-28 border-t border-zinc-800/50"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Built for developers who ship cron jobs and need to sleep at night.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="mb-3 text-2xl">{feature.icon}</div>
              <h3 className="mb-2 text-base font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 border-t border-zinc-800/50"
    >
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Start free. Scale when you need to.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Free tier */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Free</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-zinc-500">/month</span>
              </div>
            </div>
            <ul className="mb-8 space-y-3 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Up to 20 monitors
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 1-minute check
                intervals
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Email alerts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Discord/Slack
                webhooks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 7-day ping history
              </li>
            </ul>
            <Link
              href="/auth/login"
              className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro tier */}
          <div className="relative rounded-2xl border-2 border-brand-600 bg-zinc-900/50 p-8">
            <div className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
              Coming Soon
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Pro</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$9</span>
                <span className="text-zinc-500">/month</span>
              </div>
            </div>
            <ul className="mb-8 space-y-3 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Unlimited monitors
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 30-second check
                intervals
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> SMS &amp; phone call
                alerts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Team members
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 90-day ping history
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Status page
              </li>
            </ul>
            <button
              disabled
              className="block w-full rounded-lg bg-brand-600/50 py-2.5 text-center text-sm font-medium text-white/60 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none" className="h-7 w-7">
              <defs>
                <linearGradient id="cs-footer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488"/>
                  <stop offset="100%" stopColor="#059669"/>
                </linearGradient>
              </defs>
              <path d="M120 28 L200 65 L200 130 C200 175 165 210 120 225 C75 210 40 175 40 130 L40 65 Z" fill="url(#cs-footer)"/>
              <path d="M120 44 L186 75 L186 130 C186 168 156 198 120 211 C84 198 54 168 54 130 L54 75 Z" fill="#ffffff" opacity="0.15"/>
              <circle cx="120" cy="125" r="45" fill="none" stroke="#ffffff" strokeWidth="5" opacity="0.9"/>
              <circle cx="120" cy="125" r="4" fill="#ffffff"/>
              <line x1="120" y1="125" x2="103" y2="100" stroke="#ffffff" strokeWidth="5" strokeLinecap="round"/>
              <line x1="120" y1="125" x2="145" y2="108" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="158" cy="163" r="18" fill="#059669" stroke="#ffffff" strokeWidth="3"/>
              <polyline points="149,163 155,170 168,156" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-lg font-bold text-white">
              Cron<span className="text-brand-400">Safe</span>
            </span>
          </div>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} CronSafe. Built by{" "}
            <a
              href="https://deependventures.com"
              className="text-zinc-400 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Deep End Ventures
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <NavBar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
