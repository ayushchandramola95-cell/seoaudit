import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seoseite.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard?tab=alerts"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot"],
        allow: ["/", "/tools/", "/pricing", "/capstone", "/mcp", "/api-docs"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
