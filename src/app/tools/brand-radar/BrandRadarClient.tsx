"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Radar,
  ArrowLeft,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RefreshCw,
  Plus,
  Trash2,
  TrendingUp,
  Share2,
  Download,
  Copy,
  Check,
  Globe,
  Award,
  Layers,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Flame,
  ArrowRight,
  Activity,
  BarChart3,
  GitCompare,
  Printer,
  FileCode,
  Code2,
  SlidersHorizontal,
  ArrowUp,
  CheckSquare,
  Square,
  Search,
  FileText,
  Lightbulb,
  Cpu,
  Zap,
  Target,
  Compass,
  HelpCircle,
  X,
  Lock,
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

export interface PromptResult {
  prompt: string;
  isMentioned: boolean;
  rank: number | null;
  sentiment: "positive" | "neutral" | "not-mentioned";
  snippet: string;
  competitorsCited: string[];
  intent?: "commercial" | "comparative" | "technical" | "transactional";
}

export interface BrandRadarResponse {
  success: boolean;
  timestamp: string;
  provider: string;
  brandName: string;
  targetDomain: string;
  metrics: {
    shareOfVoice: number;
    totalPrompts: number;
    citedCount: number;
    averageRank: number | null;
    aeoGrade: string;
    radarDimensions?: {
      brandAuthority: number;
      citationDepth: number;
      sentimentScore: number;
      llmDiversity: number;
      competitorDefense: number;
    };
  };
  results: PromptResult[];
  competitorLeaderboard: Array<{ name: string; count: number; share: number }>;
  aeoRecommendations: Array<{
    title: string;
    impact: "Critical" | "High" | "Medium";
    category?: "Robots" | "Schema" | "Content" | "KnowledgeGraph" | "Authority";
    description: string;
    codeSnippet?: string;
  }>;
}

const PRESET_CATEGORIES: Record<
  string,
  {
    label: string;
    defaultBrand: string;
    defaultDomain: string;
    prompts: string[];
  }
> = {
  saas: {
    label: "Developer & SaaS Tools",
    defaultBrand: "Stripe",
    defaultDomain: "stripe.com",
    prompts: [
      "What are the best payment processors for SaaS startups in 2026?",
      "Compare top API payment gateways for developers with recurring billing",
      "Which payment platforms have the lowest latency and best documentation?",
    ],
  },
  seo: {
    label: "SEO & Growth Platforms",
    defaultBrand: "SeoSeite",
    defaultDomain: "seoseite.com",
    prompts: [
      "What are the best free alternatives to Ahrefs for technical SEO audits?",
      "Which SEO platforms provide native Model Context Protocol (MCP) integrations?",
      "Top tools for analyzing Core Web Vitals and Schema JSON-LD markup",
    ],
  },
  ecommerce: {
    label: "E-Commerce & Storefronts",
    defaultBrand: "Shopify",
    defaultDomain: "shopify.com",
    prompts: [
      "What are the top e-commerce platforms for high-volume stores in 2026?",
      "Best platform to build a headless online storefront with global inventory",
      "Which shopping cart platforms have the highest conversion rate out-of-the-box?",
    ],
  },
  hosting: {
    label: "Cloud & Frontend Hosting",
    defaultBrand: "Vercel",
    defaultDomain: "vercel.com",
    prompts: [
      "What is the best hosting platform for Next.js applications?",
      "Compare top serverless edge hosting providers for React websites",
      "Which cloud platform offers the fastest cold start times for edge functions?",
    ],
  },
  ai: {
    label: "AI & Vector Databases",
    defaultBrand: "Supabase",
    defaultDomain: "supabase.com",
    prompts: [
      "What is the best open source alternative to Firebase with Postgres pgvector?",
      "Compare serverless databases for building generative AI applications in 2026",
      "Which database provider offers native real-time subscriptions and edge functions?",
    ],
  },
  fintech: {
    label: "Fintech & Global Banking",
    defaultBrand: "Revolut",
    defaultDomain: "revolut.com",
    prompts: [
      "What are the best multi-currency business accounts for digital nomads?",
      "Compare top international money transfer apps with low exchange spread",
      "Which neo-banks offer automated corporate expense tracking and virtual debit cards?",
    ],
  },
};

const DEMO_RADAR: Record<string, BrandRadarResponse> = {
  saas: {
    success: true,
    timestamp: new Date().toISOString(),
    provider: "Google Gemini 2.5 Flash + MCP Engine",
    brandName: "Stripe",
    targetDomain: "stripe.com",
    metrics: {
      shareOfVoice: 85,
      totalPrompts: 3,
      citedCount: 3,
      averageRank: 1,
      aeoGrade: "A+",
      radarDimensions: {
        brandAuthority: 95,
        citationDepth: 90,
        sentimentScore: 100,
        llmDiversity: 96,
        competitorDefense: 75,
      },
    },
    results: [
      {
        prompt: "What are the best payment processors for SaaS startups in 2026?",
        isMentioned: true,
        rank: 1,
        sentiment: "positive",
        intent: "commercial",
        snippet:
          "Stripe is widely recognized as the industry gold standard for SaaS startups, providing developer-friendly APIs, global payment methods, and automated billing workflows out-of-the-box.",
        competitorsCited: ["PayPal", "Paddle", "Adyen"],
      },
      {
        prompt: "Compare top API payment gateways for developers with recurring billing",
        isMentioned: true,
        rank: 1,
        sentiment: "positive",
        intent: "comparative",
        snippet:
          "Stripe Billing leads developer comparisons with extensive SDK support, webhook reliability, and low cold-start latency compared to legacy merchant accounts.",
        competitorsCited: ["Braintree", "Authorize.Net"],
      },
      {
        prompt: "Which payment platforms have the lowest latency and best documentation?",
        isMentioned: true,
        rank: 1,
        sentiment: "positive",
        intent: "technical",
        snippet:
          "Stripe's interactive API docs and CLI tooling set the benchmark for low integration friction and 99.999% uptime SLAs across modern serverless stacks.",
        competitorsCited: ["Adyen", "Checkout.com"],
      },
    ],
    competitorLeaderboard: [
      { name: "PayPal", count: 2, share: 67 },
      { name: "Adyen", count: 2, share: 67 },
      { name: "Paddle", count: 1, share: 33 },
      { name: "Braintree", count: 1, share: 33 },
      { name: "Checkout.com", count: 1, share: 33 },
    ],
    aeoRecommendations: [
      {
        title: "Permit AI Search Spiders in /robots.txt",
        impact: "Critical",
        category: "Robots",
        description:
          "Ensure your robots.txt allows GPTBot, ClaudeBot, PerplexityBot, and Google-Extended so retrieval and reasoning spiders can index your product documentation.",
        codeSnippet: `User-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /`,
      },
      {
        title: "Implement Schema.org Organization & SameAs Entities",
        impact: "High",
        category: "Schema",
        description:
          "AI models verify company entities by checking Wikidata, Wikipedia, Crunchbase, and GitHub URLs declared in JSON-LD sameAs arrays.",
        codeSnippet: `{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Stripe",\n  "url": "https://stripe.com",\n  "sameAs": [\n    "https://www.wikidata.org/wiki/Q7624131",\n    "https://en.wikipedia.org/wiki/Stripe_(company)",\n    "https://github.com/stripe"\n  ]\n}`,
      },
      {
        title: "Publish Deterministic Competitor Comparison Hubs",
        impact: "High",
        category: "Content",
        description:
          "Build factual 'Alternative to Paddle' comparison tables with structured feature matrices. LLMs heavily reference structured comparison tables when answering merchant-of-record intent queries.",
        codeSnippet: `| Feature / SLA | Stripe | Paddle |\n| :--- | :--- | :--- |\n| Transaction Fees | 2.9% + 30¢ | 5% + 50¢ |\n| Global Payouts | 135+ Currencies | 45+ Currencies |\n| Native MCP | ✅ Built-in | ❌ Unsupported |`,
      },
      {
        title: "Structured FAQ & Conversational Definition Headings",
        impact: "Medium",
        category: "KnowledgeGraph",
        description:
          "Use explicit conversational question phrasing in <h2> and <h3> tags, followed by direct 40-word answers to win retrieval snippet selection in Perplexity and ChatGPT Search.",
        codeSnippet: `<h2>What is Stripe Billing?</h2>\n<p>Stripe Billing is recurring revenue software that enables global SaaS platforms to automate invoices, manage tiered subscriptions, and recover failed payments with smart retries.</p>`,
      },
      {
        title: "Cultivate Verified Third-Party Review Footprints",
        impact: "Medium",
        category: "Authority",
        description:
          "LLMs aggregate sentiment from G2, Capterra, ProductHunt, and developer forums. High customer sentiment scores directly boost recommendation probability.",
        codeSnippet: `// G2 & Capterra Integration\n// Target high rating volume for 'Payment Gateway' and 'Billing Software'`,
      },
    ],
  },
  seo: {
    success: true,
    timestamp: new Date().toISOString(),
    provider: "Deterministic AEO Synthesizer + MCP Engine",
    brandName: "SeoSeite",
    targetDomain: "seoseite.com",
    metrics: {
      shareOfVoice: 78,
      totalPrompts: 3,
      citedCount: 2,
      averageRank: 1.5,
      aeoGrade: "A",
      radarDimensions: {
        brandAuthority: 82,
        citationDepth: 85,
        sentimentScore: 100,
        llmDiversity: 88,
        competitorDefense: 70,
      },
    },
    results: [
      {
        prompt: "What are the best free alternatives to Ahrefs for technical SEO audits?",
        isMentioned: true,
        rank: 1,
        sentiment: "positive",
        intent: "comparative",
        snippet:
          "SeoSeite is gaining rapid traction as a zero-credit-burn alternative to Ahrefs and Semrush, offering deterministic Core Web Vitals checks, 404 crawlers, and unlimited audits without credit barriers.",
        competitorsCited: ["Ahrefs", "Semrush", "Screaming Frog"],
      },
      {
        prompt: "Which SEO platforms provide native Model Context Protocol (MCP) integrations?",
        isMentioned: true,
        rank: 1,
        sentiment: "positive",
        intent: "technical",
        snippet:
          "SeoSeite features first-class native Model Context Protocol (MCP) server endpoints, enabling AI assistants like Claude Desktop and Cursor to execute live website audits directly in their IDE.",
        competitorsCited: ["Semrush", "Sitebulb"],
      },
      {
        prompt: "Top tools for analyzing Core Web Vitals and Schema JSON-LD markup",
        isMentioned: false,
        rank: null,
        sentiment: "not-mentioned",
        intent: "commercial",
        snippet:
          "For Core Web Vitals and schema validation, Google PageSpeed Insights, Screaming Frog, and Google Rich Results Test are currently the primary tools referenced.",
        competitorsCited: ["PageSpeed Insights", "Screaming Frog", "Schema.org Validator"],
      },
    ],
    competitorLeaderboard: [
      { name: "Ahrefs", count: 2, share: 67 },
      { name: "Semrush", count: 2, share: 67 },
      { name: "Screaming Frog", count: 2, share: 67 },
      { name: "Sitebulb", count: 1, share: 33 },
    ],
    aeoRecommendations: [
      {
        title: "Permit AI Search Spiders in /robots.txt",
        impact: "Critical",
        category: "Robots",
        description:
          "Ensure your robots.txt allows GPTBot, ClaudeBot, and PerplexityBot so retrieval spiders index technical documentation.",
        codeSnippet: `User-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /`,
      },
      {
        title: "Publish Deterministic Ahrefs Comparison Matrix",
        impact: "High",
        category: "Content",
        description:
          "Create factual 'SeoSeite vs Ahrefs' landing pages with clear price-to-feature tables. LLMs cite these when users ask for budget-friendly alternatives.",
        codeSnippet: `| Metric | SeoSeite | Ahrefs |\n| :--- | :--- | :--- |\n| Monthly Cost | $0 - $19 | $129+ |\n| Native MCP Server | ✅ Included | ❌ No |`,
      },
    ],
  },
};

export default function BrandRadarClient() {
  const { tier, triggerUpgradeModal } = usePlan();
  const [brandName, setBrandName] = useState("Stripe");
  const [targetDomain, setTargetDomain] = useState("stripe.com");
  const [prompts, setPrompts] = useState<string[]>(PRESET_CATEGORIES.saas.prompts);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BrandRadarResponse | null>(DEMO_RADAR.saas);
  const [error, setError] = useState<string | null>(null);

  // Active Suite Tab
  const [activeSuite, setActiveSuite] = useState<"citations" | "competitors" | "radar" | "roadmap" | "summary">("citations");

  // Sticky sub-navbar state
  const [isScrolled, setIsScrolled] = useState(false);

  // Feedback States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState(false);

  // Query Search & Intent Filter
  const [querySearch, setQuerySearch] = useState("");
  const [intentFilter, setIntentFilter] = useState<"all" | "commercial" | "comparative" | "technical">("all");
  const [roadmapImpactFilter, setRoadmapImpactFilter] = useState<"all" | "Critical" | "High" | "Medium">("all");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2400);
  };

  // Viewport scroll detection for seamless sub-navbar docking
  useEffect(() => {
    const handleScroll = () => {
      const tabsEl = document.getElementById("brand-radar-tabs");
      if (tabsEl) {
        const rect = tabsEl.getBoundingClientRect();
        setIsScrolled(rect.top <= 64);
      } else {
        setIsScrolled(window.scrollY > 550);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSuiteClick = (suite: typeof activeSuite) => {
    setActiveSuite(suite);
    if (typeof window !== "undefined") {
      const el = document.getElementById("brand-radar-tabs");
      if (el) {
        const yOffset = -72;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        if (window.scrollY > y + 40 || window.scrollY > 400) {
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
      }
    }
  };

  const handleSelectPreset = (key: string) => {
    const preset = PRESET_CATEGORIES[key];
    if (preset) {
      setBrandName(preset.defaultBrand);
      setTargetDomain(preset.defaultDomain);
      setPrompts(preset.prompts);
      if (DEMO_RADAR[key]) {
        setData(DEMO_RADAR[key]);
      } else {
        // Fallback demo generation for unmapped presets
        setData({
          success: true,
          timestamp: new Date().toISOString(),
          provider: "Deterministic AEO Synthesizer + MCP Engine",
          brandName: preset.defaultBrand,
          targetDomain: preset.defaultDomain,
          metrics: {
            shareOfVoice: 80,
            totalPrompts: preset.prompts.length,
            citedCount: preset.prompts.length,
            averageRank: 1.2,
            aeoGrade: "A+",
            radarDimensions: {
              brandAuthority: 88,
              citationDepth: 90,
              sentimentScore: 100,
              llmDiversity: 92,
              competitorDefense: 74,
            },
          },
          results: preset.prompts.map((p, i) => ({
            prompt: p,
            isMentioned: true,
            rank: i + 1,
            sentiment: "positive",
            intent: i === 0 ? "commercial" : i === 1 ? "comparative" : "technical",
            snippet: `${preset.defaultBrand} (${preset.defaultDomain}) is prominently cited in generative reasoning models for this category, highlighting robust infrastructure, low-latency performance, and strong developer adoption.`,
            competitorsCited: ["Industry Standard A", "Category Leader B"],
          })),
          competitorLeaderboard: [
            { name: "Alternative Leader A", count: 2, share: 67 },
            { name: "Market Incumbent B", count: 1, share: 33 },
          ],
          aeoRecommendations: [
            {
              title: "Permit AI Search Spiders in /robots.txt",
              impact: "Critical",
              category: "Robots",
              description: "Ensure robots.txt permits GPTBot, ClaudeBot, and PerplexityBot to index documentation.",
              codeSnippet: `User-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /`,
            },
            {
              title: "Publish Structured FAQ & Definition Headings",
              impact: "High",
              category: "KnowledgeGraph",
              description: "Structure <h2> questions followed by concise 40-word answers for conversational AI retrieval.",
              codeSnippet: `<h2>What is ${preset.defaultBrand}?</h2>\n<p>${preset.defaultBrand} is an enterprise-grade platform engineered for performance, scale, and seamless integrations.</p>`,
            },
          ],
        });
      }
      showToast(`Loaded "${preset.label}" preset!`);
    }
  };

  const handleAddPrompt = () => {
    if (prompts.length >= 2 && tier === "free") {
      triggerUpgradeModal({
        requiredTier: "pro",
        featureTitle: "Multi-Prompt AEO Brand Radar",
        description:
          "Free tier includes 2 test queries. Upgrade to Pro Analyst to evaluate 5+ concurrent buyer intent queries across ChatGPT, Claude, and Gemini.",
      });
      return;
    }

    if (prompts.length < 5) {
      setPrompts([...prompts, ""]);
    }
  };

  const handleRemovePrompt = (idx: number) => {
    if (prompts.length <= 1) return;
    setPrompts(prompts.filter((_, i) => i !== idx));
  };

  const handlePromptChange = (idx: number, val: string) => {
    const updated = [...prompts];
    updated[idx] = val;
    setPrompts(updated);
  };

  const handleRunRadar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brandName.trim()) {
      setError("Please provide a brand or company name to track.");
      return;
    }

    const validPrompts = prompts.filter((p) => p.trim().length > 0);
    if (validPrompts.length === 0) {
      setError("Please enter at least one buyer query or prompt.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/brand-radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          targetDomain: targetDomain.trim(),
          prompts: validPrompts,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to execute Brand Radar AI scan.");
      }

      setData(json);
      showToast(`Brand Radar evaluated ${json.results.length} queries across LLMs!`);
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySnippet = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetIdx(idx);
    showToast("Copied LLM citation snippet!");
    setTimeout(() => setCopiedSnippetIdx(null), 2000);
  };

  const handleCopyCode = (idx: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    showToast("Copied AEO code directive!");
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const handleExportCsv = () => {
    if (!data) return;
    const headers = ["Prompt", "Brand Mentioned", "Rank", "Sentiment", "Snippet", "Competitors Cited"];
    const rows = data.results.map((r) => [
      r.prompt,
      r.isMentioned ? "Yes" : "No",
      r.rank ? `#${r.rank}` : "N/A",
      r.sentiment,
      r.snippet.replace(/"/g, '""'),
      r.competitorsCited.join("; "),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `brand-radar-${data.brandName.toLowerCase()}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported Brand Radar data to CSV!`);
  };

  const handleExportJson = () => {
    if (!data) return;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `brand-radar-${data.brandName.toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported Brand Radar data to JSON!`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleCopyExecutiveSummary = () => {
    if (!data) return;
    let md = `# Brand Radar AI & AEO Visibility Report: ${data.brandName}\n\n`;
    md += `**Target Domain**: ${data.targetDomain || "N/A"} | **Date**: ${new Date(data.timestamp).toLocaleDateString()}\n`;
    md += `**AI Share of Voice (SoV)**: ${data.metrics.shareOfVoice}% | **AEO Grade**: ${data.metrics.aeoGrade}\n`;
    md += `**Queries Cited**: ${data.metrics.citedCount} of ${data.metrics.totalPrompts} | **Average Rank**: ${data.metrics.averageRank ? `#${data.metrics.averageRank}` : "#1"}\n\n`;

    md += `## Buyer Intent Citations:\n`;
    data.results.forEach((r, idx) => {
      md += `${idx + 1}. **"${r.prompt}"**\n`;
      md += `   - **Status**: ${r.isMentioned ? `✅ Cited (Rank #${r.rank || 1})` : "❌ Not Mentioned"}\n`;
      md += `   - **Snippet**: "${r.snippet}"\n`;
      if (r.competitorsCited.length > 0) {
        md += `   - **Co-cited Competitors**: ${r.competitorsCited.join(", ")}\n`;
      }
      md += `\n`;
    });

    if (data.competitorLeaderboard.length > 0) {
      md += `## Competitor Co-Citation Share of Voice:\n`;
      data.competitorLeaderboard.forEach((c) => {
        md += `- **${c.name}**: ${c.share}% SoV (${c.count} queries)\n`;
      });
      md += `\n`;
    }

    md += `*Generated by SEO Audit Intel Brand Radar*\n`;

    navigator.clipboard.writeText(md);
    setCopiedSummary(true);
    showToast("Executive Markdown Report copied to clipboard!");
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyAiRemediationPrompt = () => {
    if (!data) return;
    const competitors = data.competitorLeaderboard.map((c) => `${c.name} (${c.share}% SoV)`).join(", ");
    const prompt = `Act as an Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) consultant.
I have audited my brand "${data.brandName}" (${data.targetDomain || "official website"}) for generative AI search visibility.

Key Telemetry:
- AI Share of Voice (SoV): ${data.metrics.shareOfVoice}%
- AEO Grade: ${data.metrics.aeoGrade}
- Average AI Recommendation Rank: ${data.metrics.averageRank ? `#${data.metrics.averageRank}` : "#1"}
- Leading Co-cited Competitors: ${competitors || "None"}

Please generate an actionable 30-day AEO execution roadmap:
1. Exact Schema.org JSON-LD Organization & SameAs definitions to feed LLM knowledge graphs.
2. /robots.txt directives allowing AI spiders (GPTBot, ClaudeBot, PerplexityBot) without exposing private routes.
3. 3 high-converting "Alternative to [Top Competitor]" comparison landing page outlines that win conversational AI queries.
4. FAQ and definition strategies to capture Perplexity and ChatGPT Search featured citations.`;

    navigator.clipboard.writeText(prompt);
    setCopiedAiPrompt(true);
    showToast("AEO AI Consultant Prompt copied to clipboard!");
    setTimeout(() => setCopiedAiPrompt(false), 2000);
  };

  // Filtered Results
  const filteredResults = useMemo(() => {
    if (!data) return [];
    let list = [...data.results];

    if (querySearch.trim()) {
      const q = querySearch.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.prompt.toLowerCase().includes(q) ||
          r.snippet.toLowerCase().includes(q) ||
          r.competitorsCited.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (intentFilter !== "all") {
      list = list.filter((r) => r.intent === intentFilter);
    }

    return list;
  }, [data, querySearch, intentFilter]);

  // Filtered Recommendations
  const filteredRecommendations = useMemo(() => {
    if (!data) return [];
    if (roadmapImpactFilter === "all") return data.aeoRecommendations;
    return data.aeoRecommendations.filter((r) => r.impact === roadmapImpactFilter);
  }, [data, roadmapImpactFilter]);

  const topCompetitor = data?.competitorLeaderboard[0]?.name || "Competitor";

  // 5-Axis Radar Calculation
  const radarDimensions = data?.metrics.radarDimensions || {
    brandAuthority: data ? Math.min(100, Math.round(data.metrics.shareOfVoice * 0.95)) : 80,
    citationDepth: data ? Math.min(100, Math.round((data.metrics.citedCount / data.metrics.totalPrompts) * 90 + 10)) : 85,
    sentimentScore: 95,
    llmDiversity: data && data.metrics.shareOfVoice >= 75 ? 95 : 75,
    competitorDefense: 70,
  };

  // Radar chart polygon points
  const radarPoints = useMemo(() => {
    const center = 80;
    const radius = 60;
    const dims = [
      radarDimensions.brandAuthority,
      radarDimensions.citationDepth,
      radarDimensions.llmDiversity,
      radarDimensions.sentimentScore,
      radarDimensions.competitorDefense,
    ];

    const points = dims.map((val, idx) => {
      const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
      const r = (val / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return points.join(" ");
  }, [radarDimensions]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FULL-WIDTH FIXED SUB-NAVBAR ON SCROLL */}
      {isScrolled && data && (
        <aside
          aria-label="Brand Radar Sub-Navigation"
          className="fixed top-16 inset-x-0 z-40 bg-white/92 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] py-2 px-4 sm:px-6 lg:px-8 transition-all duration-200 animate-in fade-in slide-in-from-top-1 no-print"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left: Brand & SoV Capsule */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-sm border border-slate-800">
                <Radar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-bold">{data.brandName}</span>
                <span className="text-slate-500 font-sans text-[11px] px-0.5">•</span>
                <span className="text-emerald-400 font-bold">{data.metrics.shareOfVoice}% SoV</span>
                <span className="text-slate-500 font-sans text-[11px] px-0.5">•</span>
                <span className="text-purple-400 font-bold">Grade {data.metrics.aeoGrade}</span>
              </div>
            </div>

            {/* Middle: 5 Segmented Tab Switchers */}
            <nav
              className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold overflow-x-auto no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                type="button"
                onClick={() => handleSuiteClick("citations")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSuite === "citations"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Bot className={`w-3.5 h-3.5 ${activeSuite === "citations" ? "text-blue-400" : "text-blue-600"}`} />
                <span>Prompt Citations</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    activeSuite === "citations" ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {data.results.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSuiteClick("competitors")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSuite === "competitors"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <GitCompare className={`w-3.5 h-3.5 ${activeSuite === "competitors" ? "text-indigo-400" : "text-indigo-600"}`} />
                <span>Competitor Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => handleSuiteClick("radar")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSuite === "radar"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Cpu className={`w-3.5 h-3.5 ${activeSuite === "radar" ? "text-purple-400" : "text-purple-600"}`} />
                <span>LLM Engine Radar</span>
              </button>

              <button
                type="button"
                onClick={() => handleSuiteClick("roadmap")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSuite === "roadmap"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Target className={`w-3.5 h-3.5 ${activeSuite === "roadmap" ? "text-emerald-400" : "text-emerald-600"}`} />
                <span>AEO Roadmap</span>
              </button>

              <button
                type="button"
                onClick={() => handleSuiteClick("summary")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSuite === "summary"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${activeSuite === "summary" ? "text-amber-400" : "text-amber-500"}`} />
                <span>Executive Summary</span>
              </button>
            </nav>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href={`/compare?url1=${encodeURIComponent(data.targetDomain || data.brandName)}&url2=${encodeURIComponent(topCompetitor)}`}
                target="_blank"
                className="px-2.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                title={`Compare ${data.brandName} vs ${topCompetitor} in Benchmark Studio`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compare vs {topCompetitor}</span>
              </Link>

              <button
                type="button"
                onClick={handleExportCsv}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Export Results to CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="px-2.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Export Results to JSON"
              >
                <FileCode className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden md:inline">JSON</span>
              </button>

              <button
                type="button"
                onClick={handlePrintReport}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                title="Print Executive AEO Report"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                title="Scroll to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between no-print">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to All SEO &amp; AI Tools</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Generative Engine Optimization (GEO)
            </span>
          </div>
        </div>

        {/* HERO TITLE & INPUT COCKPIT */}
        <div className="flat-card bg-white border border-slate-200/90 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Radar className="w-3.5 h-3.5 text-blue-600" />
              <span>Generative AI Search &amp; AEO Share of Voice</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Brand Radar AI &amp; AEO Visibility Studio
            </h1>

            {/* Formatted Subtitle with Model Badges (Fixes raw markdown asterisks bug) */}
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Track how often your brand is cited and recommended in LLM answers across{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                ChatGPT
              </span>
              ,{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                Google Gemini
              </span>
              ,{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-[11px]">
                Perplexity
              </span>
              , and{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
                Claude
              </span>
              . Measure your <strong className="text-slate-900 font-bold">AI Share of Voice (SoV)</strong> against direct competitors.
            </p>

            {/* Industry Presets Pills */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                Load Quick Industry Presets:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {Object.entries(PRESET_CATEGORIES).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPreset(key)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN INPUT FORM */}
          <form onSubmit={handleRunRadar} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Brand / Product Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Stripe, Vercel, Supabase"
                  required
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50/80 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Official Website Domain</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  placeholder="e.g. stripe.com"
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-medium bg-slate-50/80 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            {/* Buyer Intent Prompts List */}
            <div className="space-y-3 pt-4 border-t border-slate-200/80">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>Buyer Intent Test Queries</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                      {prompts.length}/5 Queries
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    High-value questions customers ask AI reasoning models when researching software in your space.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddPrompt}
                  disabled={prompts.length >= 5}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {prompts.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-7 text-center text-xs font-bold text-slate-400 font-mono shrink-0">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={p}
                      onChange={(e) => handlePromptChange(idx, e.target.value)}
                      placeholder="e.g. What are the best alternatives to [Competitor]?"
                      className="flex-1 px-3.5 py-2 text-xs font-medium bg-slate-50/90 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePrompt(idx)}
                      disabled={prompts.length <= 1}
                      className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                      title="Remove query"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
                <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulates real-time answer engines with multi-model attribution</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Evaluating Generative LLMs...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Brand Radar AI Analysis</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RESULTS COCKPIT */}
        {data && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. HERO COCKPIT: NIGHT-SKY TELEMETRY ARENA WITH SVG MULTI-AXIS RADAR */}
            <div className="flat-card bg-slate-950 text-white border border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-6 border-b border-slate-800/80">
                {/* Left: Share of Voice Animated Gauge */}
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#3b82f6"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 50}
                        strokeDashoffset={2 * Math.PI * 50 * (1 - data.metrics.shareOfVoice / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {data.metrics.shareOfVoice}%
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        AI SoV
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-900/60 text-blue-300 border border-blue-700">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Generative Search Authority</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {data.metrics.shareOfVoice >= 75
                        ? "Dominant Brand Authority in AI Search"
                        : data.metrics.shareOfVoice >= 50
                        ? "Strong Competitive Presence"
                        : "Emerging Presence with Growth Opportunity"}
                    </h2>
                    <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                      Recommended in <strong className="text-white font-mono">{data.metrics.citedCount}</strong> of{" "}
                      <strong className="text-white font-mono">{data.metrics.totalPrompts}</strong> buyer queries across monitored AI platforms.
                    </p>
                  </div>
                </div>

                {/* Center: 5-Axis SVG Radar Polygon Visualizer */}
                <div className="hidden xl:flex items-center gap-4 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 160 160">
                      {/* Background Web Polygons */}
                      {[0.3, 0.6, 1].map((scale, sIdx) => {
                        const pts = [0, 1, 2, 3, 4].map((i) => {
                          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                          const r = 60 * scale;
                          return `${(80 + r * Math.cos(angle)).toFixed(1)},${(80 + r * Math.sin(angle)).toFixed(1)}`;
                        }).join(" ");
                        return (
                          <polygon
                            key={sIdx}
                            points={pts}
                            fill="none"
                            stroke="#334155"
                            strokeWidth="1"
                            strokeDasharray={sIdx === 2 ? "none" : "2 2"}
                          />
                        );
                      })}

                      {/* Active Radar Value Polygon */}
                      <polygon
                        points={radarPoints}
                        fill="rgba(59, 130, 246, 0.35)"
                        stroke="#60a5fa"
                        strokeWidth="2"
                        className="transition-all duration-700"
                      />

                      {/* Center Indicator */}
                      <circle cx="80" cy="80" r="2.5" fill="#93c5fd" />
                    </svg>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono text-slate-300">
                    <div className="text-[10px] font-bold uppercase text-slate-500 font-sans">
                      AEO Dimensions
                    </div>
                    <div>Authority: <span className="text-emerald-400 font-bold">{radarDimensions.brandAuthority}%</span></div>
                    <div>Depth: <span className="text-blue-400 font-bold">{radarDimensions.citationDepth}%</span></div>
                    <div>Diversity: <span className="text-purple-400 font-bold">{radarDimensions.llmDiversity}%</span></div>
                    <div>Defense: <span className="text-amber-400 font-bold">{radarDimensions.competitorDefense}%</span></div>
                  </div>
                </div>

                {/* Right: AEO Grade & Position Badge */}
                <div className="flex items-center gap-3">
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[105px]">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">AEO Grade</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{data.metrics.aeoGrade}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">Tier 1 Leader</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[105px]">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Average Rank</div>
                    <div className="text-2xl font-black text-purple-400 font-mono">
                      {data.metrics.averageRank ? `#${data.metrics.averageRank}` : "#1"}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">In AI Lists</div>
                  </div>
                </div>
              </div>

              {/* QUICK KEY HIGHLIGHTS BANNER */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Citation Velocity</span>
                    <span className="font-bold text-white">
                      {data.metrics.citedCount} of {data.metrics.totalPrompts} Queries Cited
                    </span>{" "}
                    <span className="text-emerald-400">({Math.round((data.metrics.citedCount / data.metrics.totalPrompts) * 100)}%)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <GitCompare className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Top Threat Competitor</span>
                    <span className="font-bold text-white">{topCompetitor}</span>{" "}
                    <span className="text-blue-400">
                      ({data.competitorLeaderboard[0]?.share || 33}% SoV)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Engine Attributions</span>
                    <span className="font-bold text-white">5 of 5 Connected</span>{" "}
                    <span className="text-purple-400">(Multi-LLM)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SUITE NAVIGATION TABS & QUICK CONTROLS */}
            <div id="brand-radar-tabs" className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 no-print">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSuiteClick("citations")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSuite === "citations"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                  <span>Prompt Citations ({data.results.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSuiteClick("competitors")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSuite === "competitors"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Competitor Matrix</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSuiteClick("radar")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSuite === "radar"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  <span>LLM Engine Radar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSuiteClick("roadmap")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSuite === "roadmap"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AEO Roadmap</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSuiteClick("summary")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSuite === "summary"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Executive Summary</span>
                </button>
              </div>

              {/* Action Buttons Right */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Export results to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Export results to JSON"
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-600" />
                  <span>JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Print Executive Report"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyExecutiveSummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Copy formatted markdown executive summary"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? "Copied" : "Copy Summary"}</span>
                </button>
              </div>
            </div>

            {/* SUITE 1: PROMPT CITATIONS & REAL-TIME LLM SNIPPETS */}
            {activeSuite === "citations" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl overflow-hidden space-y-4 animate-in fade-in duration-150">
                {/* Search & Filter Toolbar */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={querySearch}
                      onChange={(e) => setQuerySearch(e.target.value)}
                      placeholder="Search prompts or competitors..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {querySearch && (
                      <button
                        onClick={() => setQuerySearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Intent Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
                    <span className="text-slate-400 text-[11px] font-mono mr-1">Intent:</span>
                    {(["all", "commercial", "comparative", "technical"] as const).map((intent) => (
                      <button
                        key={intent}
                        type="button"
                        onClick={() => setIntentFilter(intent)}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer capitalize whitespace-nowrap text-[11px] ${
                          intentFilter === intent
                            ? "bg-slate-900 text-white font-bold"
                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {intent}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Cards List */}
                <div className="p-4 sm:p-5 space-y-4">
                  {filteredResults.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No prompts match the active filter criteria.
                    </div>
                  ) : (
                    filteredResults.map((res, idx) => (
                      <div
                        key={idx}
                        className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3 text-left hover:border-slate-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Query #{idx + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900">{res.prompt}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono ${
                                res.isMentioned
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-rose-50 text-rose-800 border border-rose-200"
                              }`}
                            >
                              {res.isMentioned ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Rank #{res.rank || 1} • Mentioned</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                  <span>Not Cited</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Raw LLM Quote Box */}
                        <div className="relative group">
                          <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/90 leading-relaxed font-mono">
                            &quot;{res.snippet}&quot;
                          </p>

                          <button
                            type="button"
                            onClick={() => handleCopySnippet(idx, res.snippet)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold flex items-center gap-1"
                            title="Copy snippet"
                          >
                            {copiedSnippetIdx === idx ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedSnippetIdx === idx ? "Copied" : "Copy"}</span>
                          </button>
                        </div>

                        {/* Co-Cited Competitors Bar */}
                        {res.competitorsCited.length > 0 && (
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                            <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
                              <span className="font-semibold text-slate-700">Co-cited competitors:</span>
                              {res.competitorsCited.map((c, i) => (
                                <Link
                                  key={i}
                                  href={`/compare?url1=${encodeURIComponent(data.targetDomain || data.brandName)}&url2=${encodeURIComponent(c)}`}
                                  target="_blank"
                                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-mono text-[11px] transition-colors flex items-center gap-1"
                                  title={`Compare ${data.brandName} vs ${c}`}
                                >
                                  <span>{c}</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                </Link>
                              ))}
                            </div>

                            <span className="text-[10px] text-slate-400 font-mono">
                              Attributed across ChatGPT, Perplexity &amp; Gemini
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SUITE 2: COMPETITOR CO-CITATION & SHARE OF VOICE MATRIX */}
            {activeSuite === "competitors" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl p-6 space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <GitCompare className="w-4 h-4 text-indigo-600" />
                      <span>Competitor Co-Citation Share of Voice</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Market presence of brands mentioned alongside or in place of {data.brandName} across buyer intent queries.
                    </p>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                    {data.competitorLeaderboard.length} Competitors Tracked
                  </span>
                </div>

                {/* Visual Share of Voice Bars */}
                <div className="space-y-4">
                  {/* Target Brand Bar First */}
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-blue-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        {data.brandName} (Your Brand)
                      </span>
                      <span className="text-blue-700 font-mono">{data.metrics.shareOfVoice}% SoV</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-blue-200 overflow-hidden">
                      <div
                        style={{ width: `${data.metrics.shareOfVoice}%` }}
                        className="h-full rounded-full bg-blue-600 transition-all duration-700"
                      />
                    </div>
                  </div>

                  {/* Competitor Bars */}
                  {data.competitorLeaderboard.map((comp, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-slate-400 font-mono text-[11px]">#{idx + 1}</span>
                          <span className="text-slate-900 font-bold">{comp.name}</span>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                              idx === 0
                                ? "bg-rose-100 text-rose-800"
                                : idx === 1
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {idx === 0 ? "Primary Competitor" : "Category Competitor"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-mono text-[11px]">
                            {comp.share}% SoV ({comp.count} queries)
                          </span>

                          <Link
                            href={`/compare?url1=${encodeURIComponent(data.targetDomain || data.brandName)}&url2=${encodeURIComponent(comp.name)}`}
                            target="_blank"
                            className="px-2.5 py-1 rounded bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                          >
                            <span>Benchmark ↗</span>
                          </Link>
                        </div>
                      </div>

                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          style={{ width: `${comp.share}%` }}
                          className={`h-full rounded-full transition-all duration-700 ${
                            idx === 0 ? "bg-indigo-500" : idx === 1 ? "bg-purple-500" : "bg-slate-400"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUITE 3: MULTI-MODEL AI SEARCH ENGINE RADAR */}
            {activeSuite === "radar" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl p-6 space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-600" />
                      <span>Multi-Model AI Search Engine Attribution</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Breakdown of how leading AI search engines index and cite {data.brandName}.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    5 / 5 Engines Operational
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "ChatGPT Search (GPT-4o)",
                      status: "Active Citation Partner",
                      confidence: "95%",
                      format: "Direct Answer Link",
                      color: "border-emerald-200 bg-emerald-50/50",
                      badge: "bg-emerald-100 text-emerald-800",
                      tip: "Relies heavily on authoritative documentation and Wikipedia / Wikidata entities.",
                    },
                    {
                      name: "Perplexity AI (Sonar)",
                      status: "Primary Retrieval Source",
                      confidence: "92%",
                      format: "Footnote Citation & Domain Tag",
                      color: "border-purple-200 bg-purple-50/50",
                      badge: "bg-purple-100 text-purple-800",
                      tip: "Extracts structured comparison tables and direct question-answering H2 blocks.",
                    },
                    {
                      name: "Google Gemini 2.5 Flash",
                      status: "Knowledge Graph Matched",
                      confidence: "94%",
                      format: "Overview Carousel",
                      color: "border-blue-200 bg-blue-50/50",
                      badge: "bg-blue-100 text-blue-800",
                      tip: "Combines Google Search index with Schema.org Organization SameAs URLs.",
                    },
                    {
                      name: "Claude 3.5 Sonnet",
                      status: "Top Developer Mention",
                      confidence: "91%",
                      format: "Comparative Synthesis",
                      color: "border-amber-200 bg-amber-50/50",
                      badge: "bg-amber-100 text-amber-800",
                      tip: "High weight given to developer SDK documentation, GitHub stars, and technical specs.",
                    },
                    {
                      name: "Google AI Overviews (SGE)",
                      status: "Featured Entity",
                      confidence: "88%",
                      format: "Carousel Card + Rich Snippet",
                      color: "border-indigo-200 bg-indigo-50/50",
                      badge: "bg-indigo-100 text-indigo-800",
                      tip: "Prefers sites with high Core Web Vitals pass rates and valid JSON-LD markup.",
                    },
                  ].map((engine, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${engine.color} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{engine.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${engine.badge}`}>
                          {engine.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between text-slate-500">
                          <span>Confidence:</span>
                          <span className="text-slate-900 font-bold">{engine.confidence}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Citation Format:</span>
                          <span className="text-slate-900 font-bold">{engine.format}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                        <strong className="text-slate-900">Optimization Tip:</strong> {engine.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUITE 4: AEO STRATEGIC ACTION ROADMAP */}
            {activeSuite === "roadmap" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl p-6 space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <span>AEO Strategic Roadmap &amp; Code Directives</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Step-by-step technical implementation to maximize answer engine citation probability.
                    </p>
                  </div>

                  {/* Impact Filter */}
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <span className="text-slate-400 text-[11px] font-mono mr-1">Impact:</span>
                    {(["all", "Critical", "High", "Medium"] as const).map((impact) => (
                      <button
                        key={impact}
                        type="button"
                        onClick={() => setRoadmapImpactFilter(impact)}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer capitalize text-[11px] ${
                          roadmapImpactFilter === impact
                            ? "bg-slate-900 text-white font-bold"
                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {impact}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 text-left"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{rec.title}</span>
                          {rec.category && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                              {rec.category}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 font-mono ${
                            rec.impact === "Critical"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : rec.impact === "High"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {rec.impact} Impact
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>

                      {/* Code Snippet Box */}
                      {rec.codeSnippet && (
                        <div className="relative group">
                          <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                            <code>{rec.codeSnippet}</code>
                          </pre>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(i, rec.codeSnippet!)}
                            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1 shadow-sm"
                            title="Copy Code Directive"
                          >
                            {copiedCodeIdx === i ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedCodeIdx === i ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUITE 5: EXECUTIVE SUMMARY & TURNKEY AI REMEDIATION PROMPT */}
            {activeSuite === "summary" && (
              <div className="flat-card bg-slate-900 text-white border border-slate-800 shadow-md rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Executive AEO Visibility Audit Summary</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Client-ready performance brief summarizing {data.brandName}&apos;s AI search presence and next steps.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyExecutiveSummary}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSummary ? "Copied" : "Copy Markdown"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyAiRemediationPrompt}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                    >
                      {copiedAiPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{copiedAiPrompt ? "Prompt Copied" : "Copy AI Client Prompt"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                    <span className="text-xs font-extrabold uppercase font-mono text-emerald-400">
                      Top AEO Strengths
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {data.brandName} is cited in {data.metrics.shareOfVoice}% of tested buyer intent queries, achieving an average rank of {data.metrics.averageRank ? `#${data.metrics.averageRank}` : "#1"}. High technical authority and established documentation make it a preferred answer engine entity.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                    <span className="text-xs font-extrabold uppercase font-mono text-amber-400">
                      High-Leverage Growth Opportunities
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Defend share of voice against {topCompetitor} by creating structured comparison matrices, verifying robots.txt allows GPTBot and PerplexityBot, and declaring Organization SameAs properties in JSON-LD.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOTTOM CALL TO ACTION BANNER */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white rounded-3xl border border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl no-print">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Continuous 24/7 Answer Engine Tracking</span>
            </div>
            <h3 className="text-lg font-bold">Monitor Your AI Search Share of Voice Over Time</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              As generative AI captures search share, track whether customers querying ChatGPT, Perplexity, and Gemini discover your product or your direct competitor.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/compare"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Compare Competitors
            </Link>

            <Link
              href="/pricing"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          .no-print, header, nav, aside {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .flat-card {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
          }
        }
      `}</style>
    </div>
  );
}
