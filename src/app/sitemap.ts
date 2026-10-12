import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seoseite.com";
  const now = new Date();

  const routes = [
    "",
    "/analyze",
    "/compare",
    "/dashboard",
    "/pricing",
    "/mcp",
    "/api-docs",
    "/capstone",
    "/project-info",
    "/worklog",
    "/tools",
    "/tools/broken-links",
    "/tools/speed-lab",
    "/tools/schema-validator",
    "/tools/serp-preview",
    "/tools/tech-detector",
    "/tools/authority-checker",
    "/tools/brand-radar",
    "/tools/content-gap",
    "/tools/batch-audit",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route.startsWith("/tools/") ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/tools/") ? 0.9 : 0.8,
  }));
}
