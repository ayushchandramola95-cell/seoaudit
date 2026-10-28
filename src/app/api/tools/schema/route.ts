import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { SsrfSecurityError } from "@/lib/security/ssrf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || targetUrl.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Missing required 'url' parameter." }, { status: 400 });
  }

  try {
    const pageData = await scrapeWebsite(targetUrl.trim());

    return NextResponse.json({
      success: true,
      url: pageData.finalUrl,
      domain: pageData.domain,
      structuredData: pageData.structuredData,
      openGraph: pageData.openGraph,
      twitterCard: pageData.twitterCard,
      canonicalUrl: pageData.canonicalUrl,
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: "Security Exception: Internal or reserved IPs cannot be scanned." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to validate schema markup." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawJson, domain = "custom-snippet" } = body;

    if (!rawJson || typeof rawJson !== "string") {
      return NextResponse.json({ success: false, error: "Missing required 'rawJson' string parameter." }, { status: 400 });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawJson);
    } catch (parseErr: any) {
      return NextResponse.json({
        success: false,
        error: `JSON-LD Parse Error: ${parseErr.message}`,
        syntaxValid: false,
      }, { status: 400 });
    }

    const types: string[] = [];
    const extractTypes = (item: any) => {
      if (!item || typeof item !== "object") return;
      if (item["@type"]) {
        if (Array.isArray(item["@type"])) {
          types.push(...item["@type"].map(String));
        } else {
          types.push(String(item["@type"]));
        }
      }
      if (item["@graph"] && Array.isArray(item["@graph"])) {
        item["@graph"].forEach(extractTypes);
      }
    };

    if (Array.isArray(parsed)) {
      parsed.forEach(extractTypes);
    } else {
      extractTypes(parsed);
    }

    const uniqueTypes = Array.from(new Set(types));

    return NextResponse.json({
      success: true,
      domain,
      syntaxValid: true,
      structuredData: {
        detected: uniqueTypes.length > 0,
        count: uniqueTypes.length,
        types: uniqueTypes,
        raw: JSON.stringify(parsed, null, 2),
        items: Array.isArray(parsed) ? parsed : [parsed],
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to validate raw JSON-LD." }, { status: 500 });
  }
}
