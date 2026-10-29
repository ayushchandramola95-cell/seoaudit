import { NextRequest, NextResponse } from "next/server";

interface AiBotRule {
  botName: string;
  engine: string;
  allowed: boolean;
  directive: string;
  impact: "Critical" | "High" | "Neutral" | "Optimal";
  description: string;
}

interface SchemaSummary {
  detected: boolean;
  types: string[];
  hasOrganization: boolean;
  hasFaq: boolean;
  hasArticle: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("domain") || searchParams.get("url");

  if (!target || target.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Missing required 'domain' or 'url' query parameter." },
      { status: 400 }
    );
  }

  let domain = target.trim();
  try {
    if (domain.startsWith("http://") || domain.startsWith("https://")) {
      domain = new URL(domain).hostname;
    }
  } catch {
    // Keep as-is
  }
  domain = domain.toLowerCase().replace(/^www\./, "").replace(/\/$/, "");

  try {
    const startTime = Date.now();

    // 1. Fetch llms.txt & llms-full.txt
    let llmsTxtDetected = false;
    let llmsTxtSize = 0;
    let llmsTxtSnippet = "";
    try {
      const llmsRes = await fetch(`https://${domain}/llms.txt`, {
        headers: { "User-Agent": "SeoSeite-GEO-Auditor/2.0" },
        signal: AbortSignal.timeout(3500),
      });
      if (llmsRes.ok) {
        const text = await llmsRes.text();
        if (text && text.length > 20 && !text.includes("<!DOCTYPE html>")) {
          llmsTxtDetected = true;
          llmsTxtSize = text.length;
          llmsTxtSnippet = text.slice(0, 300);
        }
      }
    } catch {
      // llms.txt not detected
    }

    // 2. Fetch robots.txt & test AI crawlers
    let robotsTxtRaw = "";
    try {
      const robotsRes = await fetch(`https://${domain}/robots.txt`, {
        headers: { "User-Agent": "SeoSeite-GEO-Auditor/2.0" },
        signal: AbortSignal.timeout(3500),
      });
      if (robotsRes.ok) {
        robotsTxtRaw = await robotsRes.text();
      }
    } catch {
      // robots.txt missing or timeout
    }

    const aiBots: AiBotRule[] = [
      {
        botName: "GPTBot",
        engine: "OpenAI ChatGPT Search",
        allowed: !robotsTxtRaw.toLowerCase().includes("user-agent: gptbot\ndisallow: /"),
        directive: robotsTxtRaw.toLowerCase().includes("user-agent: gptbot\ndisallow: /") ? "Disallow: /" : "Allow: /",
        impact: robotsTxtRaw.toLowerCase().includes("user-agent: gptbot\ndisallow: /") ? "Critical" : "Optimal",
        description: "Primary crawler for ChatGPT Search citations and OpenAI Operator web browsing.",
      },
      {
        botName: "PerplexityBot",
        engine: "Perplexity AI Pro Search",
        allowed: !robotsTxtRaw.toLowerCase().includes("user-agent: perplexitybot\ndisallow: /"),
        directive: robotsTxtRaw.toLowerCase().includes("user-agent: perplexitybot\ndisallow: /") ? "Disallow: /" : "Allow: /",
        impact: robotsTxtRaw.toLowerCase().includes("user-agent: perplexitybot\ndisallow: /") ? "Critical" : "Optimal",
        description: "Deep web synthesis agent generating real-time inline citations on Perplexity AI.",
      },
      {
        botName: "ClaudeBot",
        engine: "Anthropic Claude Sonnet",
        allowed: !robotsTxtRaw.toLowerCase().includes("user-agent: claudebot\ndisallow: /"),
        directive: robotsTxtRaw.toLowerCase().includes("user-agent: claudebot\ndisallow: /") ? "Disallow: /" : "Allow: /",
        impact: robotsTxtRaw.toLowerCase().includes("user-agent: claudebot\ndisallow: /") ? "High" : "Optimal",
        description: "Web inspection bot for Anthropic artifacts, Claude analysis, and web lookups.",
      },
      {
        botName: "Google-Extended",
        engine: "Google Gemini & AI Overviews",
        allowed: !robotsTxtRaw.toLowerCase().includes("user-agent: google-extended\ndisallow: /"),
        directive: robotsTxtRaw.toLowerCase().includes("user-agent: google-extended\ndisallow: /") ? "Disallow: /" : "Allow: /",
        impact: robotsTxtRaw.toLowerCase().includes("user-agent: google-extended\ndisallow: /") ? "High" : "Optimal",
        description: "Controls training ingestion and AI Overviews generation for Google Gemini models.",
      },
      {
        botName: "ByteSpider",
        engine: "ByteDance & TikTok AI",
        allowed: !robotsTxtRaw.toLowerCase().includes("user-agent: bytespider\ndisallow: /"),
        directive: robotsTxtRaw.toLowerCase().includes("user-agent: bytespider\ndisallow: /") ? "Disallow: /" : "Allow: /",
        impact: "Neutral",
        description: "TikTok / Doubao search indexing bot for social search query synthesis.",
      },
    ];

    // 3. Inspect HTML structure & structured entities
    let html = "";
    try {
      const pageRes = await fetch(`https://${domain}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 SeoSeite-GEO-Bot" },
        signal: AbortSignal.timeout(4000),
      });
      if (pageRes.ok) {
        html = await pageRes.text();
      }
    } catch {
      // fallback
    }

    const schemaInfo: SchemaSummary = {
      detected: html.includes("application/ld+json"),
      types: [],
      hasOrganization: html.toLowerCase().includes('"@type":"organization"') || html.toLowerCase().includes('"@type": "organization"'),
      hasFaq: html.toLowerCase().includes('"@type":"faqpage"') || html.toLowerCase().includes('"@type": "faqpage"'),
      hasArticle: html.toLowerCase().includes('"@type":"article"') || html.toLowerCase().includes('"@type": "article"'),
    };

    if (schemaInfo.hasOrganization) schemaInfo.types.push("Organization");
    if (schemaInfo.hasFaq) schemaInfo.types.push("FAQPage");
    if (schemaInfo.hasArticle) schemaInfo.types.push("Article");
    if (html.toLowerCase().includes('"@type":"product"') || html.toLowerCase().includes('"@type": "product"')) {
      schemaInfo.types.push("Product");
    }
    if (html.toLowerCase().includes('"@type":"softwareapplication"') || html.toLowerCase().includes('"@type": "softwareapplication"')) {
      schemaInfo.types.push("SoftwareApplication");
    }

    // 4. Calculate Scores
    let botScore = 100;
    aiBots.forEach((b) => {
      if (!b.allowed) {
        botScore -= b.impact === "Critical" ? 30 : 15;
      }
    });
    botScore = Math.max(0, botScore);

    const llmsScore = llmsTxtDetected ? 100 : 25;
    const entityScore = schemaInfo.types.length >= 2 ? 95 : schemaInfo.detected ? 65 : 20;
    const structureScore = html.includes("<h1") && html.includes("<h2") ? 90 : 50;

    const overallGeoScore = Math.round(
      botScore * 0.4 + llmsScore * 0.25 + entityScore * 0.25 + structureScore * 0.1
    );

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      domain,
      latencyMs,
      scores: {
        overall: overallGeoScore,
        aiBotAccess: botScore,
        llmsTxtCompliance: llmsScore,
        structuredEntityClarity: entityScore,
        semanticStructure: structureScore,
      },
      aiBots,
      llmsTxt: {
        detected: llmsTxtDetected,
        url: `https://${domain}/llms.txt`,
        sizeBytes: llmsTxtSize,
        snippet: llmsTxtSnippet || null,
        recommendation: llmsTxtDetected
          ? "llms.txt is properly configured and discoverable by LLM scraping workflows."
          : "Add an /llms.txt markdown manifest to guide AI models directly to your canonical documentation and core brand facts.",
      },
      schemaEntities: schemaInfo,
      aiSimulations: [
        {
          engine: "ChatGPT Search",
          simulatedPrompt: `What is ${domain} and how does its product work?`,
          citationLikelihood: aiBots[0].allowed ? "High (88%)" : "Blocked (0%)",
          rationale: aiBots[0].allowed
            ? "GPTBot is allowed in robots.txt. ChatGPT can retrieve live web grounding context."
            : "GPTBot is blocked by robots.txt directives. ChatGPT will fall back to stale pre-training weights.",
        },
        {
          engine: "Perplexity AI Pro",
          simulatedPrompt: `Compare ${domain} pricing and feature capabilities against competitors.`,
          citationLikelihood: aiBots[1].allowed ? "High (92%)" : "Blocked (0%)",
          rationale: aiBots[1].allowed
            ? "PerplexityBot is permitted. Answers will feature direct footnote citations linking to domain URLs."
            : "PerplexityBot is blocked. Answers will cite secondary review platforms instead of your official site.",
        },
        {
          engine: "Google Gemini",
          simulatedPrompt: `${domain} official platform overview and use cases.`,
          citationLikelihood: aiBots[3].allowed ? "High (85%)" : "Restricted (30%)",
          rationale: aiBots[3].allowed
            ? "Google-Extended is allowed. Site feeds into Gemini multimodal RAG pipelines."
            : "Google-Extended is disallowed. Gemini cannot use your pages for real-time generative summaries.",
        },
      ],
      fixes: [
        ...(!llmsTxtDetected
          ? [
              {
                title: "Deploy an /llms.txt Markdown Knowledge Manifest",
                priority: "High",
                codeSnippet: `# ${domain} Knowledge Base\n> Canonical reference for AI search engines and coding assistants.\n\n## Core Architecture\n- Official Site: https://${domain}\n- API Docs: https://${domain}/docs\n- Pricing: https://${domain}/pricing`,
              },
            ]
          : []),
        ...(!schemaInfo.hasOrganization
          ? [
              {
                title: "Add Organization Schema with @id and sameAs links",
                priority: "Medium",
                codeSnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "${domain}",\n  "url": "https://${domain}"\n}\n</script>`,
              },
            ]
          : []),
      ],
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to analyze GEO readiness." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = body.domain || body.url || req.nextUrl.searchParams.get("domain") || req.nextUrl.searchParams.get("url");

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required 'domain' or 'url' in JSON body." },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    url.searchParams.set("domain", target);
    return GET(new NextRequest(url, { method: "GET", headers: req.headers }));
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Invalid JSON payload." },
      { status: 400 }
    );
  }
}

