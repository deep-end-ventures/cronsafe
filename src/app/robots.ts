import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Hardcoded to prevent Vercel env var override
  const baseUrl = "https://cronsafe.deependventures.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
