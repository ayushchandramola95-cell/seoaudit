import { NextRequest, NextResponse } from "next/server";

interface HreflangTag {
  hreflang: string;
  href: string;
  language: string;
  country?: string;
  isValidLanguage: boolean;
  isValidCountry: boolean;
  isSelfReferencing: boolean;
  isXDefault: boolean;
  status: "Valid" | "Warning" | "Error";
  errorNotes?: string;
}

const VALID_ISO_LANGUAGES = new Set([
  "en", "de", "es", "fr", "it", "pt", "nl", "ja", "zh", "ru", "ar", "ko", "hi", "sv", "no", "da", "fi", "pl", "cs", "tr", "id", "th", "vi", "el", "he", "ro", "hu", "uk"
]);

const VALID_ISO_COUNTRIES = new Set([
  "us", "gb", "de", "fr", "es", "it", "ca", "au", "jp", "cn", "in", "br", "mx", "nl", "se", "ch", "at", "sg", "nz", "kr", "ie", "za"
]);

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
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SeoSeite-Hreflang-Auditor" },
        signal: AbortSignal.timeout(4500),
      });
      status = res.status;
      html = await res.text();
    } catch {
      // fallback
    }

    // Extract hreflang tags: <link rel="alternate" hreflang="..." href="...">
    const regex = /<link[^>]+rel=["']alternate["'][^>]*>/gi;
    const matches = html.match(regex) || [];

    const tags: HreflangTag[] = [];
    let hasXDefault = false;
    let hasSelfRef = false;

    matches.forEach((tagStr) => {
      const hreflangMatch = tagStr.match(/hreflang=["']([^"']+)["']/i);
      const hrefMatch = tagStr.match(/href=["']([^"']+)["']/i);

      if (hreflangMatch && hrefMatch) {
        const hLang = hreflangMatch[1].trim();
        const href = hrefMatch[1].trim();
        const isXDefault = hLang.toLowerCase() === "x-default";

        let isValidLang = true;
        let isValidCountry = true;
        let langCode = hLang.toLowerCase();
        let countryCode: string | undefined;

        if (hLang.includes("_")) {
          // Underscore error: Google requires hyphens (e.g. en-US not en_US)
          isValidLang = false;
        }

        if (!isXDefault) {
          const parts = hLang.toLowerCase().split("-");
          langCode = parts[0];
          if (!VALID_ISO_LANGUAGES.has(langCode)) {
            isValidLang = false;
          }
          if (parts.length > 1) {
            countryCode = parts[1].toUpperCase();
            if (!VALID_ISO_COUNTRIES.has(parts[1])) {
              isValidCountry = false;
            }
          }
        }

        const isSelf = href.toLowerCase() === raw.toLowerCase() || href.toLowerCase() === `${raw}/`.toLowerCase();
        if (isSelf) hasSelfRef = true;
        if (isXDefault) hasXDefault = true;

        const isOk = (isXDefault || (isValidLang && isValidCountry)) && !hLang.includes("_");

        tags.push({
          hreflang: hLang,
          href,
          language: isXDefault ? "Global Fallback (x-default)" : langCode.toUpperCase(),
          country: countryCode,
          isValidLanguage: isValidLang,
          isValidCountry,
          isSelfReferencing: isSelf,
          isXDefault,
          status: isOk ? "Valid" : hLang.includes("_") ? "Error" : "Warning",
          errorNotes: hLang.includes("_")
            ? "Syntax error: Underscores are not permitted. Use a hyphen (e.g. en-US)."
            : !isValidLang
            ? "Invalid ISO 639-1 language code."
            : !isValidCountry
            ? "Invalid ISO 3166-1 country code."
            : undefined,
        });
      }
    });

    // Score calculation
    let score = 100;
    if (tags.length === 0) {
      score = 40; // No hreflang tags found (site may be monolingual)
    } else {
      if (!hasXDefault) score -= 20;
      if (!hasSelfRef) score -= 20;
      const invalidCount = tags.filter((t) => t.status !== "Valid").length;
      score -= invalidCount * 15;
    }
    score = Math.max(0, Math.min(100, score));

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      requestedUrl: raw,
      domain,
      latencyMs,
      status,
      score,
      totalTagsFound: tags.length,
      hasXDefault,
      hasSelfReferencing: hasSelfRef,
      isMonolingual: tags.length === 0,
      tags,
      checklist: [
        {
          title: "Hreflang Tags Declared",
          status: tags.length > 0 ? "Pass" : "Info",
          value: `${tags.length} alternate tags`,
          description: tags.length > 0 ? "Alternate language versions detected." : "No hreflang tags found. Acceptable if site targets only a single language.",
        },
        {
          title: "x-default Fallback Tag",
          status: hasXDefault ? "Pass" : tags.length > 0 ? "Fail" : "Info",
          value: hasXDefault ? "Active" : "Missing",
          description: "x-default directs users without a matching language to your primary global page.",
        },
        {
          title: "Self-Referencing Hreflang",
          status: hasSelfRef ? "Pass" : tags.length > 0 ? "Fail" : "Info",
          value: hasSelfRef ? "Present" : "Missing",
          description: "Google mandates that a page must include an alternate link pointing to itself.",
        },
        {
          title: "ISO Standard Code Compliance",
          status: tags.every((t) => t.status === "Valid") ? "Pass" : "Warning",
          value: tags.every((t) => t.status === "Valid") ? "100% Compliant" : "Format errors detected",
          description: "Verifies ISO 639-1 languages and ISO 3166-1 region codes with hyphen separators.",
        },
      ],
      sampleGenerator: `<!-- Standard Multilingual Hreflang Cluster -->\n<link rel="alternate" hreflang="x-default" href="https://${domain}/" />\n<link rel="alternate" hreflang="en" href="https://${domain}/en/" />\n<link rel="alternate" hreflang="es" href="https://${domain}/es/" />\n<link rel="alternate" hreflang="de" href="https://${domain}/de/" />\n<link rel="alternate" hreflang="ja" href="https://${domain}/ja/" />`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to audit hreflang tags." },
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

