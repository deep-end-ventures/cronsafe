import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getAllSlugs } from "@/content/blog";
import { BlogPostJsonLd } from "@/components/JsonLd";
import EmailCapture from "@/components/EmailCapture";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — CronSafe`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-zinc-950">
      <BlogPostJsonLd
        title={post.title}
        description={post.description}
        date={post.date}
        slug={slug}
      />
      {/* Nav */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Cron<span className="text-brand-400">Safe</span>
            </span>
          </Link>
          <Link
            href="/blog"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← All Posts
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-4">
          <span className="bg-brand-500/10 text-brand-400 px-3 py-1 rounded-full text-xs font-medium">
            {post.category}
          </span>
          <span>{post.readTime}</span>
          <span>{post.date}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
          {post.title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-li:text-zinc-300
            prose-a:text-brand-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-code:text-brand-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl
            prose-table:border-collapse
            prose-th:bg-zinc-800/50 prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-zinc-700 prose-th:text-zinc-200
            prose-td:p-3 prose-td:border prose-td:border-zinc-800 prose-td:text-zinc-300
            prose-hr:border-zinc-800 prose-hr:my-8"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
        />

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            {post.keywords.slice(0, 5).map((kw) => (
              <span
                key={kw}
                className="text-xs bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Email Capture — inline after article */}
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <EmailCapture
          variant="inline"
          heading="Enjoyed this post? Get more DevOps tips →"
          source="blog-post"
        />
      </div>

      {/* CTA */}
      <section className="py-16 border-t border-zinc-800 mt-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Start Monitoring Your Cron Jobs
          </h2>
          <p className="text-zinc-400 mb-6">
            Free for up to 5 monitors. One line of code to set up.
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

/** Minimal markdown → HTML converter */
function markdownToHtml(md: string): string {
  const lines = md.trim().split("\n");
  let html = "";
  let inList = false;
  let inTable = false;
  let inCodeBlock = false;
  let codeContent = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        html += `<pre><code>${escapeHtml(codeContent.trim())}</code></pre>`;
        codeContent = "";
        inCodeBlock = false;
      } else {
        if (inList) { html += "</ul>"; inList = false; }
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    if (!trimmed) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inTable) { html += "</tbody></table>"; inTable = false; }
      continue;
    }

    if (trimmed.startsWith("### ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h3>${inline(trimmed.slice(4))}</h3>`;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h2>${inline(trimmed.slice(3))}</h2>`;
      continue;
    }
    if (/^---+$/.test(trimmed)) {
      html += "<hr />";
      continue;
    }

    // Table
    if (trimmed.startsWith("|")) {
      if (/^\|[\s-:|]+\|$/.test(trimmed)) continue;
      const cells = trimmed.split("|").filter((c) => c.trim() !== "").map((c) => c.trim());
      if (!inTable) {
        html += "<table><thead><tr>";
        cells.forEach((c) => { html += `<th>${inline(c)}</th>`; });
        html += "</tr></thead><tbody>";
        inTable = true;
        continue;
      }
      html += "<tr>";
      cells.forEach((c) => { html += `<td>${inline(c)}</td>`; });
      html += "</tr>";
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inline(trimmed.slice(2))}</li>`;
      continue;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { html += "<ol>"; inList = true; }
      html += `<li>${inline(trimmed.replace(/^\d+\.\s/, ""))}</li>`;
      continue;
    }

    if (inList) { html += "</ul>"; inList = false; }
    html += `<p>${inline(trimmed)}</p>`;
  }

  if (inList) html += "</ul>";
  if (inTable) html += "</tbody></table>";
  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/`(.+?)`/g, "<code>$1</code>");
}
