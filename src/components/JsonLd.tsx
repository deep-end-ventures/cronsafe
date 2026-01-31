export function WebsiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cronsafe-one.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "CronSafe",
        description: "Cron job monitoring made dead simple. Get alerted when your scheduled tasks stop running.",
        publisher: {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "CronSafe",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
        parentOrganization: {
          "@type": "Organization",
          name: "Deep End Ventures",
          url: "https://deep-end-ventures-site-amber.vercel.app",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "CronSafe",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free tier — up to 5 monitors",
        },
        description: "Dead-simple cron job monitoring with email, Slack, and webhook alerts.",
        url: baseUrl,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BlogPostJsonLd({
  title,
  description,
  date,
  slug,
}: {
  title: string;
  description: string;
  date: string;
  slug: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cronsafe-one.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    url: `${baseUrl}/blog/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "CronSafe",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
