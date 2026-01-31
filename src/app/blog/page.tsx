import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog — CronSafe | Cron Job Monitoring Guides & Best Practices",
  description:
    "Practical guides on cron job monitoring, best practices for scheduled tasks, and engineering advice for reliable background jobs.",
  keywords: [
    "cron job monitoring guide",
    "cron best practices",
    "scheduled task monitoring",
    "dead man's switch",
  ],
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav placeholder - back to home */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Cron<span className="text-brand-400">Safe</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            📝 Engineering Blog
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Cron Job Monitoring{" "}
            <span className="text-brand-400">Guides</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Practical engineering guides on monitoring, reliability, and best
            practices for cron jobs and scheduled tasks.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 hover:border-brand-500/50 hover:bg-zinc-900/80 transition-all group"
            >
              <div className="flex items-center gap-3 text-sm text-zinc-500 mb-3">
                <span className="bg-brand-500/10 text-brand-400 px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
                <span>{post.readTime}</span>
                <span>{post.date}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-zinc-400 mb-4">{post.description}</p>
              <span className="inline-flex items-center gap-1 text-brand-400 font-medium text-sm group-hover:gap-2 transition-all">
                Read article →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Start Monitoring Your Cron Jobs
          </h2>
          <p className="text-zinc-400 mb-6">
            Free for up to 5 monitors. Setup takes 60 seconds.
          </p>
          <Link
            href="/"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
          >
            Get Started Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
