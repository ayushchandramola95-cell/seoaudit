import { NextRequest, NextResponse } from "next/server";

interface ImageAuditItem {
  src: string;
  alt: string;
  format: "avif" | "webp" | "svg" | "png" | "jpeg" | "gif" | "other";
  hasAlt: boolean;
  isDescriptiveAlt: boolean;
  hasDimensions: boolean;
  width?: string;
  height?: string;
  isLazy: boolean;
  hasSrcset: boolean;
  issues: string[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url") || searchParams.get("domain");

  if (!target || target.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Missing required 'url' or 'domain' query parameter." },
      { status: 400 }
    );
  }

  let raw = target.trim();
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    raw = `https://${raw}`;
  }

  try {
    const parsedUrl = new URL(raw);
    const domain = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");
    const startTime = Date.now();

    let html = "";
    let status = 200;

    try {
      const res = await fetch(raw, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SeoSeite-Image-Auditor" },
        signal: AbortSignal.timeout(4500),
      });
      status = res.status;
      html = await res.text();
    } catch {
      // fallback
    }

    // Scrape <img> tags
    const imgRegex = /<img[^>]+>/gi;
    const matches = html.match(imgRegex) || [];

    const items: ImageAuditItem[] = [];

    matches.slice(0, 30).forEach((tag) => {
      const srcMatch = tag.match(/src=["']([^"']+)["']/i);
      const altMatch = tag.match(/alt=["']([^"']*)["']/i);
      const widthMatch = tag.match(/width=["']([^"']+)["']/i);
      const heightMatch = tag.match(/height=["']([^"']+)["']/i);
      const loadingMatch = tag.match(/loading=["']([^"']+)["']/i);
      const srcsetMatch = tag.match(/srcset=["']([^"']+)["']/i);

      let src = srcMatch ? srcMatch[1].trim() : "";
      if (src.startsWith("/")) {
        src = `https://${domain}${src}`;
      } else if (!src.startsWith("http") && !src.startsWith("data:")) {
        src = `https://${domain}/${src}`;
      }

      const alt = altMatch ? altMatch[1].trim() : "";
      const hasAlt = altMatch !== null && alt.length > 0;
      const isDescriptiveAlt = hasAlt && alt.length > 5 && !alt.match(/\.(png|jpg|jpeg|gif|webp)$/i);

      // Determine format
      let format: ImageAuditItem["format"] = "other";
      const lowerSrc = src.toLowerCase();
      if (lowerSrc.includes(".avif") || lowerSrc.includes("format=avif")) format = "avif";
      else if (lowerSrc.includes(".webp") || lowerSrc.includes("format=webp")) format = "webp";
      else if (lowerSrc.includes(".svg")) format = "svg";
      else if (lowerSrc.includes(".png")) format = "png";
      else if (lowerSrc.includes(".jpg") || lowerSrc.includes(".jpeg")) format = "jpeg";
      else if (lowerSrc.includes(".gif")) format = "gif";

      const hasDims = widthMatch !== null && heightMatch !== null;
      const isLazy = loadingMatch !== null && loadingMatch[1].toLowerCase() === "lazy";
      const hasSrcset = srcsetMatch !== null;

      const issues: string[] = [];
      if (!hasAlt) issues.push("Missing alt attribute");
      else if (!isDescriptiveAlt) issues.push("Generic or filename-based alt text");
      if (format === "png" || format === "jpeg" || format === "gif") issues.push("Legacy image format (convert to WebP/AVIF)");
      if (!hasDims) issues.push("Missing explicit width/height (CLS risk)");

      items.push({
        src,
        alt,
        format,
        hasAlt,
        isDescriptiveAlt,
        hasDimensions: hasDims,
        width: widthMatch ? widthMatch[1] : undefined,
        height: heightMatch ? heightMatch[1] : undefined,
        isLazy,
        hasSrcset,
        issues,
      });
    });

    // Aggregates
    const total = items.length;
    const missingAltCount = items.filter((i) => !i.hasAlt).length;
    const legacyFormatCount = items.filter((i) => i.format === "png" || i.format === "jpeg" || i.format === "gif").length;
    const nextGenCount = items.filter((i) => i.format === "avif" || i.format === "webp" || i.format === "svg").length;
    const missingDimsCount = items.filter((i) => !i.hasDimensions).length;

    const nextGenRatio = total > 0 ? Math.round((nextGenCount / total) * 100) : 100;
    const altRatio = total > 0 ? Math.round(((total - missingAltCount) / total) * 100) : 100;
    const dimsRatio = total > 0 ? Math.round(((total - missingDimsCount) / total) * 100) : 100;

    let score = 100;
    if (total > 0) {
      score = Math.round(altRatio * 0.45 + nextGenRatio * 0.35 + dimsRatio * 0.2);
    }

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      requestedUrl: raw,
      domain,
      latencyMs,
      status,
      score,
      summary: {
        totalImages: total,
        missingAltCount,
        legacyFormatCount,
        nextGenCount,
        nextGenAdoptionRate: `${nextGenRatio}%`,
        altCoverageRate: `${altRatio}%`,
        clsProtectedRate: `${dimsRatio}%`,
        estimatedByteSavings: `${legacyFormatCount * 45} KB (~65% reduction)`,
      },
      items,
      recommendedPictureSnippet: `<!-- High-Performance Responsive Picture Element -->\n<picture>\n  <source srcset="image.avif" type="image/avif" />\n  <source srcset="image.webp" type="image/webp" />\n  <img \n    src="image.jpg" \n    alt="Descriptive keyword-relevant context" \n    width="800" \n    height="450" \n    loading="lazy" \n    decoding="async"\n  />\n</picture>`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to audit images." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = body.url || body.domain || req.nextUrl.searchParams.get("url") || req.nextUrl.searchParams.get("domain");

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required 'url' or 'domain' in request body." },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    url.searchParams.set("url", target);
    return GET(new NextRequest(url, { method: "GET", headers: req.headers }));
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Invalid JSON payload." },
      { status: 400 }
    );
  }
}

