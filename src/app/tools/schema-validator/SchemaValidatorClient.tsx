"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Code2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Share2,
  FileCode2,
  Sparkles,
  Layers,
  Globe,
  Smartphone,
  Monitor,
  ExternalLink,
  Terminal,
  Download,
  ArrowUp,
  RefreshCw,
  X,
  ShieldCheck,
  HelpCircle,
  Tag,
  Star,
  User,
  Building2,
  ShoppingCart,
  ListOrdered,
  Braces,
  ArrowLeft,
  Eye,
  FileText,
  Play,
} from "lucide-react";

interface StructuredDataPayload {
  count: number;
  types: string[];
  raw?: string;
  items?: any[];
}

interface OpenGraphPayload {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  url?: string | null;
  siteName?: string | null;
}

interface TwitterCardPayload {
  card?: string | null;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  site?: string | null;
}

interface SchemaValidationResponse {
  success: boolean;
  url?: string;
  domain?: string;
  structuredData?: StructuredDataPayload;
  openGraph?: OpenGraphPayload;
  twitterCard?: TwitterCardPayload;
  canonicalUrl?: string | null;
  syntaxValid?: boolean;
}

const PRESET_DEMOS: Record<
  string,
  {
    label: string;
    url: string;
    data: SchemaValidationResponse;
  }
> = {
  stripe: {
    label: "Stripe",
    url: "https://stripe.com",
    data: {
      success: true,
      url: "https://stripe.com/",
      domain: "stripe.com",
      structuredData: {
        count: 4,
        types: ["Organization", "WebSite", "BreadcrumbList", "SoftwareApplication"],
        raw: `{\n  "@context": "https://schema.org",\n  "@graph": [\n    {\n      "@type": "Organization",\n      "@id": "https://stripe.com/#organization",\n      "name": "Stripe",\n      "url": "https://stripe.com/",\n      "logo": "https://images.stripeassets.com/fzn2n1nzq965/7kWn.../stripe-og.png",\n      "sameAs": [\n        "https://www.wikidata.org/wiki/Q7624131",\n        "https://en.wikipedia.org/wiki/Stripe_(company)",\n        "https://github.com/stripe",\n        "https://twitter.com/stripe",\n        "https://www.linkedin.com/company/stripe"\n      ]\n    },\n    {\n      "@type": "WebSite",\n      "@id": "https://stripe.com/#website",\n      "url": "https://stripe.com/",\n      "name": "Stripe",\n      "publisher": { "@id": "https://stripe.com/#organization" }\n    },\n    {\n      "@type": "BreadcrumbList",\n      "itemListElement": [\n        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stripe.com/" },\n        { "@type": "ListItem", "position": 2, "name": "Payments", "item": "https://stripe.com/payments" }\n      ]\n    },\n    {\n      "@type": "SoftwareApplication",\n      "name": "Stripe Payments API",\n      "applicationCategory": "BusinessApplication",\n      "operatingSystem": "All Cloud & Serverless Stacks",\n      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }\n    }\n  ]\n}`,
        items: [
          {
            "@type": "Organization",
            name: "Stripe",
            url: "https://stripe.com/",
            sameAs: [
              "https://www.wikidata.org/wiki/Q7624131",
              "https://en.wikipedia.org/wiki/Stripe_(company)",
              "https://github.com/stripe",
            ],
          },
          { "@type": "WebSite", name: "Stripe", url: "https://stripe.com/" },
        ],
      },
      openGraph: {
        title: "Stripe | Financial Infrastructure for the Internet",
        description: "Powering online and in-person payments, billing, and global commerce for businesses of every scale.",
        image: "https://images.stripeassets.com/fzn2n1nzq965/7kWn.../stripe-og.png",
        url: "https://stripe.com/",
        siteName: "Stripe",
      },
      twitterCard: {
        card: "summary_large_image",
        title: "Stripe | Financial Infrastructure for the Internet",
        description: "APIs for internet commerce, recurring billing, and banking-as-a-service.",
        image: "https://images.stripeassets.com/fzn2n1nzq965/7kWn.../stripe-og.png",
      },
    },
  },
  github: {
    label: "GitHub",
    url: "https://github.com",
    data: {
      success: true,
      url: "https://github.com/",
      domain: "github.com",
      structuredData: {
        count: 3,
        types: ["SoftwareApplication", "Organization", "WebSite"],
        raw: `{\n  "@context": "https://schema.org",\n  "@type": "SoftwareApplication",\n  "name": "GitHub",\n  "applicationCategory": "DeveloperApplication",\n  "operatingSystem": "Web, Windows, macOS, Linux",\n  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },\n  "author": {\n    "@type": "Organization",\n    "name": "GitHub, Inc.",\n    "url": "https://github.com",\n    "sameAs": "https://en.wikipedia.org/wiki/GitHub"\n  }\n}`,
      },
      openGraph: {
        title: "GitHub: Let's build from here",
        description: "GitHub is where over 100 million developers shape the future of software, together.",
        image: "https://github.githubassets.com/images/modules/site/social-cards/campaign-social.png",
        url: "https://github.com/",
        siteName: "GitHub",
      },
      twitterCard: {
        card: "summary_large_image",
        title: "GitHub: Let's build from here",
        description: "GitHub is where over 100 million developers collaborate.",
        image: "https://github.githubassets.com/images/modules/site/social-cards/campaign-social.png",
      },
    },
  },
  nextjs: {
    label: "Next.js",
    url: "https://nextjs.org",
    data: {
      success: true,
      url: "https://nextjs.org/",
      domain: "nextjs.org",
      structuredData: {
        count: 3,
        types: ["SoftwareApplication", "TechArticle", "WebSite"],
        raw: `{\n  "@context": "https://schema.org",\n  "@type": "SoftwareApplication",\n  "name": "Next.js",\n  "applicationCategory": "DeveloperApplication",\n  "operatingSystem": "Cross-platform",\n  "author": { "@type": "Organization", "name": "Vercel", "url": "https://vercel.com" }\n}`,
      },
      openGraph: {
        title: "Next.js by Vercel - The React Framework",
        description: "Used by some of the world's largest companies, Next.js enables you to create full-stack Web applications.",
        image: "https://nextjs.org/og.png",
        url: "https://nextjs.org/",
        siteName: "Next.js",
      },
      twitterCard: {
        card: "summary_large_image",
        title: "Next.js by Vercel - The React Framework",
        description: "The React Framework for the Web.",
        image: "https://nextjs.org/og.png",
      },
    },
  },
  vercel: {
    label: "Vercel",
    url: "https://vercel.com",
    data: {
      success: true,
      url: "https://vercel.com/",
      domain: "vercel.com",
      structuredData: {
        count: 2,
        types: ["Organization", "WebSite"],
        raw: `{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Vercel",\n  "url": "https://vercel.com",\n  "logo": "https://vercel.com/api/og",\n  "sameAs": ["https://twitter.com/vercel", "https://github.com/vercel"]\n}`,
      },
      openGraph: {
        title: "Vercel: Build and deploy the best Web experiences",
        description: "Vercel's Frontend Cloud gives developers collaborative frameworks, workflow, and infrastructure.",
        image: "https://vercel.com/api/og",
        url: "https://vercel.com/",
        siteName: "Vercel",
      },
      twitterCard: {
        card: "summary_large_image",
        title: "Vercel: Build and deploy the best Web experiences",
        description: "Vercel's Frontend Cloud gives developers collaborative frameworks.",
        image: "https://vercel.com/api/og",
      },
    },
  },
};

const TEMPLATE_SCHEMAS = {
  organization: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://example.com/#organization",
  "name": "Acme Corporation",
  "url": "https://example.com/",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://www.wikidata.org/wiki/...",
    "https://en.wikipedia.org/wiki/...",
    "https://github.com/acme",
    "https://twitter.com/acme"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-555-0199",
    "contactType": "customer service",
    "availableLanguage": ["English", "Spanish"]
  }
}`,
  software: `{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Acme Dev Studio",
  "operatingSystem": "Web, Windows, macOS, Linux",
  "applicationCategory": "DeveloperApplication",
  "offers": {
    "@type": "Offer",
    "price": "29.00",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "1280"
  }
}`,
  faq: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Schema JSON-LD?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Schema JSON-LD is structured data markup that provides search engines and AI models with explicit clues about the meaning of a webpage."
      }
    },
    {
      "@type": "Question",
      "name": "Does Schema help AI Search & AEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, generative reasoning models like ChatGPT, Perplexity, and Gemini ingest structured schemas to verify authoritative brand entity knowledge."
      }
    }
  ]
}`,
  article: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Modern Technical SEO & AEO in 2026",
  "image": ["https://example.com/cover.jpg"],
  "datePublished": "2026-01-15T08:00:00+08:00",
  "dateModified": "2026-01-20T09:20:00+08:00",
  "author": {
    "@type": "Person",
    "name": "Jane Doe",
    "jobTitle": "Principal SEO Architect"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SEO Audit Intel",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  }
}`,
  product: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Developer Pro Audit Suite",
  "image": "https://example.com/product.jpg",
  "description": "Unlimited technical SEO crawls, Core Web Vitals diagnostics, and AEO brand radar.",
  "brand": { "@type": "Brand", "name": "SeoSeite" },
  "offers": {
    "@type": "Offer",
    "price": "49.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/pricing"
  }
}`,
  breadcrumbs: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://example.com/tools" },
    { "@type": "ListItem", "position": 3, "name": "Schema Validator", "item": "https://example.com/tools/schema-validator" }
  ]
}`,
};

export default function SchemaValidatorClient() {
  const [inputMode, setInputMode] = useState<"url" | "code">("url");
  const [url, setUrl] = useState("https://stripe.com");
  const [rawCodeInput, setRawCodeInput] = useState(PRESET_DEMOS.stripe.data.structuredData?.raw || "");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SchemaValidationResponse | null>(PRESET_DEMOS.stripe.data);
  const [error, setError] = useState<string | null>(null);

  // Active Suite Tab
  const [activeTab, setActiveTab] = useState<
    "snippets" | "social" | "code" | "generator" | "ai-readiness"
  >("snippets");

  // Serf Preview Viewport Toggle
  const [serpViewport, setSerpViewport] = useState<"desktop" | "mobile">("desktop");

  // Sticky sub-navbar state
  const [isScrolled, setIsScrolled] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Copy Feedback
  const [copiedCode, setCopiedCode] = useState(false);

  // Code editor feedback
  const [codeSyntaxError, setCodeSyntaxError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2400);
  };

  // Viewport scroll detection for seamless sub-navbar docking
  useEffect(() => {
    const handleScroll = () => {
      const tabsEl = document.getElementById("schema-suite-tabs");
      if (tabsEl) {
        const rect = tabsEl.getBoundingClientRect();
        setIsScrolled(rect.top <= 64);
      } else {
        setIsScrolled(window.scrollY > 450);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live syntax linting as user types in rawCodeInput
  useEffect(() => {
    if (rawCodeInput.trim().length === 0) {
      setCodeSyntaxError(null);
      return;
    }
    try {
      // Strip potential <script> wrapping tags
      const cleanJson = rawCodeInput
        .replace(/<script[^>]*>/gi, "")
        .replace(/<\/script>/gi, "")
        .trim();
      JSON.parse(cleanJson);
      setCodeSyntaxError(null);
    } catch (err: any) {
      setCodeSyntaxError(err.message || "Invalid JSON syntax");
    }
  }, [rawCodeInput]);

  const handleScanUrl = async (targetToScan = url) => {
    if (!targetToScan) return;
    setLoading(true);
    setError(null);

    let formattedUrl = targetToScan.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
      setUrl(formattedUrl);
    }

    try {
      const res = await fetch(`/api/tools/schema?url=${encodeURIComponent(formattedUrl)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to validate schema.");
      }
      setData(json);
      if (json.structuredData?.raw) {
        setRawCodeInput(json.structuredData.raw);
      }
      showToast(`Scanned schema markup for ${json.domain || formattedUrl}!`);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to inspect structured data.");
    } finally {
      setLoading(false);
    }
  };

  const handleScanRawCode = async () => {
    if (!rawCodeInput.trim()) {
      setError("Please paste a JSON-LD code snippet to validate.");
      return;
    }
    setLoading(true);
    setError(null);

    const cleanJson = rawCodeInput
      .replace(/<script[^>]*>/gi, "")
      .replace(/<\/script>/gi, "")
      .trim();

    try {
      const res = await fetch("/api/tools/schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawJson: cleanJson,
          domain: data?.domain || "custom-schema.snippet",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Invalid JSON-LD syntax.");
      }

      setData((prev) => ({
        success: true,
        domain: prev?.domain || "custom-snippet",
        url: prev?.url || "https://custom-snippet.io",
        structuredData: json.structuredData,
        openGraph: prev?.openGraph,
        twitterCard: prev?.twitterCard,
        syntaxValid: true,
      }));
      showToast("Validated custom JSON-LD code snippet successfully!");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to validate JSON-LD.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPreset = (key: string) => {
    const p = PRESET_DEMOS[key];
    if (p) {
      setUrl(p.url);
      setData(p.data);
      if (p.data.structuredData?.raw) {
        setRawCodeInput(p.data.structuredData.raw);
      }
      showToast(`Loaded "${p.label}" demo schema!`);
    }
  };

  const handleLoadTemplate = (templateKey: keyof typeof TEMPLATE_SCHEMAS) => {
    const tmpl = TEMPLATE_SCHEMAS[templateKey];
    setRawCodeInput(tmpl);
    setInputMode("code");
    setActiveTab("code");
    try {
      const parsed = JSON.parse(tmpl);
      const types = [parsed["@type"]].flat().filter(Boolean);
      setData((prev) => ({
        success: true,
        domain: prev?.domain || "template.io",
        url: prev?.url || "https://template.io",
        structuredData: {
          count: types.length,
          types,
          raw: tmpl,
        },
        openGraph: prev?.openGraph,
        twitterCard: prev?.twitterCard,
        syntaxValid: true,
      }));
      showToast(`Loaded ${templateKey.toUpperCase()} template into Code Studio!`);
    } catch {
      // ignore
    }
  };

  const handleBeautifyCode = () => {
    try {
      const cleanJson = rawCodeInput
        .replace(/<script[^>]*>/gi, "")
        .replace(/<\/script>/gi, "")
        .trim();
      const parsed = JSON.parse(cleanJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setRawCodeInput(formatted);
      showToast("Formatted & beautified JSON-LD code!");
    } catch {
      showToast("Cannot beautify: Code contains JSON syntax errors.");
    }
  };

  const handleCopyCode = () => {
    const codeToCopy = rawCodeInput || data?.structuredData?.raw || "";
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    showToast("Copied JSON-LD code to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadSchemaFile = () => {
    const code = rawCodeInput || data?.structuredData?.raw || "";
    if (!code) return;
    const blob = new Blob([code], { type: "application/ld+json" });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `schema-${data?.domain || "export"}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
    showToast("Downloaded schema JSON-LD file!");
  };

  // Dynamic Calculated Health Score
  const healthScore = useMemo(() => {
    if (!data) return 0;
    let score = 0;

    // 1. Syntax & Script presence (up to 30)
    if (data.structuredData && data.structuredData.count > 0) score += 30;
    else if (data.syntaxValid) score += 20;

    // 2. Entity diversity (up to 30)
    const typeCount = data.structuredData?.types?.length || 0;
    score += Math.min(30, typeCount * 10);

    // 3. Knowledge Graph Linkage (sameAs / @id / logo) (up to 20)
    const raw = data.structuredData?.raw || "";
    if (raw.includes("sameAs")) score += 10;
    if (raw.includes("@id")) score += 5;
    if (raw.includes("logo") || raw.includes("image")) score += 5;

    // 4. Social OpenGraph completeness (up to 20)
    if (data.openGraph?.title) score += 5;
    if (data.openGraph?.image) score += 5;
    if (data.twitterCard?.title) score += 5;
    if (data.twitterCard?.image) score += 5;

    return Math.min(100, Math.max(15, score));
  }, [data]);

  const sameAsCount = useMemo(() => {
    const raw = data?.structuredData?.raw || "";
    const matches = raw.match(/https?:\/\/(www\.)?(wikidata|wikipedia|github|twitter|linkedin|crunchbase)/gi);
    return matches ? matches.length : 0;
  }, [data]);

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
          aria-label="Schema Validator Sub-Navigation"
          className="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] py-2 px-4 sm:px-6 lg:px-8 transition-all duration-200 animate-in fade-in slide-in-from-top-1 no-print"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left: Domain & Health Capsule */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-sm border border-slate-800">
                <Code2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-bold">{data.domain || "Custom Schema"}</span>
                <span className="text-slate-500 font-sans text-[11px] px-0.5">•</span>
                <span className={`font-bold ${healthScore >= 80 ? "text-emerald-400" : healthScore >= 60 ? "text-amber-400" : "text-rose-400"}`}>
                  {healthScore}/100 Score
                </span>
                <span className="text-slate-500 font-sans text-[11px] px-0.5">•</span>
                <span className="text-purple-400 font-bold">{data.structuredData?.types?.length || 0} Entities</span>
              </div>
            </div>

            {/* Middle: 5 Segmented Tab Switchers */}
            <nav
              className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold overflow-x-auto no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                type="button"
                onClick={() => setActiveTab("snippets")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "snippets"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${activeTab === "snippets" ? "text-blue-400" : "text-blue-600"}`} />
                <span>SERP Rich Snippet</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("social")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "social"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Share2 className={`w-3.5 h-3.5 ${activeTab === "social" ? "text-indigo-400" : "text-indigo-600"}`} />
                <span>Social Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "code"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <FileCode2 className={`w-3.5 h-3.5 ${activeTab === "code" ? "text-purple-400" : "text-purple-600"}`} />
                <span>Code Studio &amp; Linter</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("generator")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "generator"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${activeTab === "generator" ? "text-amber-400" : "text-amber-600"}`} />
                <span>Template Generator</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ai-readiness")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "ai-readiness"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === "ai-readiness" ? "text-emerald-400" : "text-emerald-600"}`} />
                <span>AI &amp; Knowledge Graph</span>
              </button>
            </nav>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Copy JSON-LD Schema Code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span className="hidden sm:inline">Copy Code</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSchemaFile}
                className="px-2.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Download JSON-LD Schema File"
              >
                <Download className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden md:inline">Download</span>
              </button>

              <Link
                href={`/analyze?url=${encodeURIComponent(data.url || `https://${data.domain}`)}`}
                className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span className="hidden sm:inline">Full SEO Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

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
            <span>Back to All SEO Tools</span>
          </Link>

          <span className="flex items-center gap-1.5 font-mono text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            Schema.org / JSON-LD / OpenGraph Protocol
          </span>
        </div>

        {/* HERO TITLE & DUAL-MODE INPUT COCKPIT */}
        <div className="flat-card bg-white border border-slate-200/90 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Structured Data &amp; Rich Snippet Studio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Schema JSON-LD &amp; OpenGraph Validator
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Validate Schema.org rich snippets, Google Knowledge Graph entity properties, social sharing cards, and AI reasoning agent indexation.
            </p>

            {/* Input Mode Selector */}
            <div className="pt-2 flex items-center justify-center">
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200">
                <button
                  type="button"
                  onClick={() => setInputMode("url")}
                  className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    inputMode === "url"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Crawl Live URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("code")}
                  className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    inputMode === "code"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Paste / Edit Code</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Presets */}
            {inputMode === "url" && (
              <div className="pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                  Explore Pre-Audited Verified Schemas:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Object.entries(PRESET_DEMOS).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleLoadPreset(key)}
                      className="px-3 py-1 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MODE 1: URL CRAWL FORM */}
          {inputMode === "url" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleScanUrl();
              }}
              className="mt-4 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
            >
              <input
                type="text"
                required
                placeholder="Enter URL to validate (e.g. https://yourdomain.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 px-4 py-3 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/80 focus:bg-white text-slate-900"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Crawling Schema...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Validate Schema</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* MODE 2: CODE SANDBOX FORM */
            <div className="space-y-3 max-w-3xl mx-auto text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Paste Schema JSON-LD Script</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBeautifyCode}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                  >
                    Beautify JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => setRawCodeInput(TEMPLATE_SCHEMAS.organization)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                  >
                    Reset Template
                  </button>
                </div>
              </div>

              <textarea
                rows={8}
                value={rawCodeInput}
                onChange={(e) => setRawCodeInput(e.target.value)}
                placeholder='{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "My Brand"\n}'
                className="w-full p-3.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-950 text-emerald-400 leading-relaxed"
              />

              {codeSyntaxError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Syntax Warning: {codeSyntaxError}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleScanRawCode}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Validate Code Sandbox</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* RESULTS SUITE */}
        {data && (
          <div className="space-y-6">
            {/* 1. NIGHT-SKY TELEMETRY HERO ARENA */}
            <div className="flat-card p-6 sm:p-8 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Dynamic SVG Radial Score Ring */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={healthScore >= 80 ? "#10b981" : healthScore >= 60 ? "#f59e0b" : "#f43f5e"}
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - healthScore / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white font-mono leading-none tracking-tight">
                      {healthScore}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl font-black text-white font-mono tracking-tight">
                      {data.domain || "Custom Entity"}
                    </h3>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Rich Snippet Certified
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                      AI Ingestible
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {data.structuredData?.count || 0} Structured JSON-LD Blocks • OpenGraph &amp; Twitter Graph Verified
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono flex-wrap">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Google Knowledge Graph Grounded
                    </span>
                    <span>•</span>
                    <span className="text-blue-400">
                      {data.structuredData?.types?.length || 0} Entity Schemas
                    </span>
                    {sameAsCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-purple-400">{sameAsCount} sameAs Linkages</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied" : "Copy JSON-LD"}</span>
                </button>

                <Link
                  href={`/analyze?url=${encodeURIComponent(data.url || `https://${data.domain}`)}`}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all shadow-md hover:shadow-lg"
                >
                  <span>Run Full SEO Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4 SUMMARY DIMENSION TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="flat-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Schema Blocks
                </div>
                <div className="text-3xl font-black text-slate-900 font-mono">
                  {data.structuredData?.count || 0}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Microdata Scripts
                </div>
              </div>

              <div className="flat-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Entity Types Found
                </div>
                <div className="text-3xl font-black text-blue-600 font-mono">
                  {data.structuredData?.types?.length || 0}
                </div>
                <div className="text-[11px] text-slate-500 truncate font-mono">
                  {data.structuredData?.types?.slice(0, 2).join(", ") || "None"}
                </div>
              </div>

              <div className="flat-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Social Card Integrity
                </div>
                <div className="text-3xl font-black text-indigo-600 font-mono">
                  {data.openGraph?.title && data.twitterCard?.title ? "100%" : "Partial"}
                </div>
                <div className="text-[11px] text-slate-500">
                  OpenGraph &amp; Twitter Graph
                </div>
              </div>

              <div className="flat-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Knowledge Graph sameAs
                </div>
                <div className="text-3xl font-black text-emerald-600 font-mono">
                  {sameAsCount > 0 ? `${sameAsCount} Links` : "0 Linked"}
                </div>
                <div className="text-[11px] text-slate-500">
                  Wikidata &amp; Wikipedia Grounding
                </div>
              </div>
            </div>

            {/* 2. SUITE NAVIGATION TABS */}
            <div id="schema-suite-tabs" className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 no-print">
              <nav className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("snippets")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "snippets"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Globe className={`w-3.5 h-3.5 ${activeTab === "snippets" ? "text-blue-400" : "text-blue-600"}`} />
                  <span>SERP Rich Snippet &amp; Entities</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("social")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "social"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Share2 className={`w-3.5 h-3.5 ${activeTab === "social" ? "text-indigo-400" : "text-indigo-600"}`} />
                  <span>Social Share Cards (OG &amp; Twitter)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "code"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <FileCode2 className={`w-3.5 h-3.5 ${activeTab === "code" ? "text-purple-400" : "text-purple-600"}`} />
                  <span>Code Studio &amp; Linter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("generator")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "generator"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${activeTab === "generator" ? "text-amber-400" : "text-amber-600"}`} />
                  <span>Interactive Template Generator</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ai-readiness")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "ai-readiness"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === "ai-readiness" ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span>AI &amp; Knowledge Graph Readiness</span>
                </button>
              </nav>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSchemaFile}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-purple-600" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            {/* SUITE 1: GOOGLE SERP RICH SNIPPET PREVIEW & ENTITY INSPECTOR */}
            {activeTab === "snippets" && (
              <div className="space-y-6 text-left animate-in fade-in duration-150">
                {/* Live Google Search Card Simulator */}
                <div className="flat-card bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span>Google Search SERP Rich Snippet Simulator</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Visual simulation of how this page and its structured metadata display in Google Search results.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setSerpViewport("desktop")}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                          serpViewport === "desktop" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSerpViewport("mobile")}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                          serpViewport === "mobile" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile</span>
                      </button>
                    </div>
                  </div>

                  {/* Google Search Result Card Mockup */}
                  <div className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 ${serpViewport === "mobile" ? "max-w-md mx-auto" : "w-full"}`}>
                    {/* Breadcrumbs & Favicon */}
                    <div className="flex items-center gap-2 text-[12px] text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                        {data.domain?.charAt(0).toUpperCase() || "W"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 leading-none">{data.domain || "example.com"}</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          https://{data.domain || "example.com"} &gt; products &gt; overview
                        </span>
                      </div>
                    </div>

                    {/* Google Blue Link Title */}
                    <h4 className="text-lg text-blue-800 hover:underline cursor-pointer font-medium leading-snug pt-1">
                      {data.openGraph?.title || `${data.domain} | Official Platform & Solutions`}
                    </h4>

                    {/* Snippet Description */}
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {data.openGraph?.description ||
                        `Explore ${data.domain} products, developer documentation, and enterprise features. Validated with Schema.org JSON-LD microdata.`}
                    </p>

                    {/* Sitelinks / Rich Meta */}
                    {data.structuredData?.types?.includes("Organization") && (
                      <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">
                          Verified Organization
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">
                          API Docs Available
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detected Entity Types Breakdown */}
                <div className="flat-card bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-600" />
                        <span>Detected Schema.org Entity Types ({data.structuredData?.types?.length || 0})</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Standardized semantic classes parsed from page microdata.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(data.structuredData?.types || []).map((type, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 font-mono flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-blue-600" />
                            {type}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Valid Type
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Recognized by Google Search, Perplexity, and Bing as a primary Schema.org ontology class.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUITE 2: SOCIAL SHARE CARDS (OPENGRAPH & TWITTER) */}
            {activeTab === "social" && (
              <div className="space-y-6 text-left animate-in fade-in duration-150">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LinkedIn / Facebook OpenGraph Card */}
                  <div className="flat-card bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-blue-600" />
                        <span>LinkedIn &amp; Facebook OpenGraph Card</span>
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                        1200 x 630 px
                      </span>
                    </div>

                    {/* Social Card Preview Mockup */}
                    <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-2xs">
                      <div className="h-44 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                        {data.openGraph?.image ? (
                          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center">
                            <span className="text-xs font-mono text-blue-400">og:image linked</span>
                            <span className="text-sm font-bold mt-1 max-w-sm truncate">{data.domain}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 text-xs">
                            <Share2 className="w-8 h-8 mb-1" />
                            <span>No og:image specified</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-white border-t border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                          {data.domain || "example.com"}
                        </span>
                        <h5 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {data.openGraph?.title || "No og:title declared"}
                        </h5>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {data.openGraph?.description || "No og:description declared."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Twitter / X Large Summary Card */}
                  <div className="flat-card bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-slate-900" />
                        <span>Twitter / X Large Summary Card</span>
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                        {data.twitterCard?.card || "summary_large_image"}
                      </span>
                    </div>

                    {/* Twitter Card Mockup */}
                    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                      <div className="h-44 bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center relative">
                        <span className="text-xs font-mono text-purple-400">twitter:image linked</span>
                        <span className="text-sm font-bold mt-1 max-w-sm truncate">{data.domain}</span>
                      </div>

                      <div className="p-4 space-y-1">
                        <span className="text-[10px] text-slate-500 font-mono">{data.domain}</span>
                        <h5 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {data.twitterCard?.title || data.openGraph?.title || "No twitter:title"}
                        </h5>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {data.twitterCard?.description || data.openGraph?.description || "No description."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUITE 3: CODE STUDIO & LINTER */}
            {activeTab === "code" && (
              <div className="flat-card bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-left animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileCode2 className="w-4 h-4 text-purple-600" />
                      <span>Schema.org JSON-LD Code Studio &amp; Linter</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Live editable code sandbox with real-time JSON syntax validation and auto-beautifier.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBeautifyCode}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                    >
                      Format JSON
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSchemaFile}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* Editor Container */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>&lt;script type=&quot;application/ld+json&quot;&gt;</span>
                    </span>
                    {codeSyntaxError ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Syntax Error: {codeSyntaxError}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Valid JSON-LD Structure
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={16}
                    value={rawCodeInput}
                    onChange={(e) => setRawCodeInput(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* SUITE 4: INTERACTIVE TEMPLATE GENERATOR */}
            {activeTab === "generator" && (
              <div className="flat-card bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-left animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Schema.org Template Generator Library</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select a standardized schema template to immediately load into the validator or copy into your website headers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      key: "organization" as const,
                      title: "Organization & Knowledge Graph",
                      icon: Building2,
                      desc: "Declares official brand entity, logo, Wikidata, and social sameAs links for Google & AI models.",
                    },
                    {
                      key: "software" as const,
                      title: "SoftwareApplication / SaaS",
                      icon: Code2,
                      desc: "For developer APIs, cloud platforms, and web apps with pricing, ratings, and OS support.",
                    },
                    {
                      key: "faq" as const,
                      title: "FAQPage Accordion",
                      icon: HelpCircle,
                      desc: "Captures rich snippet question-and-answer accordions in Google and Perplexity search answers.",
                    },
                    {
                      key: "article" as const,
                      title: "Article / BlogPosting",
                      icon: FileText,
                      desc: "Ensures Google News and Discover eligibility with verified author, publisher, and timestamps.",
                    },
                    {
                      key: "product" as const,
                      title: "Product & E-Commerce",
                      icon: ShoppingCart,
                      desc: "Displays price, in-stock badge, and seller details directly in search engine snippets.",
                    },
                    {
                      key: "breadcrumbs" as const,
                      title: "BreadcrumbList Hierarchy",
                      icon: ListOrdered,
                      desc: "Replaces raw URLs in Google SERP results with a clean navigable breadcrumb trail.",
                    },
                  ].map((tmpl) => {
                    const IconComp = tmpl.icon;
                    return (
                      <div
                        key={tmpl.key}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-xs text-slate-900">{tmpl.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{tmpl.desc}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleLoadTemplate(tmpl.key)}
                          className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                        >
                          <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Load &amp; Edit Template</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUITE 5: AI & KNOWLEDGE GRAPH READINESS */}
            {activeTab === "ai-readiness" && (
              <div className="flat-card bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-left animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>AI Reasoning &amp; Knowledge Graph Ingestion Audit</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    How generative models (ChatGPT, Perplexity, Claude, Gemini) evaluate your structured entities during RAG retrieval.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Entity Canonicalization (@id)",
                      status: data.structuredData?.raw?.includes("@id") ? "Passing" : "Missing",
                      desc: "Establishes a permanent URI identifier for your brand, eliminating entity confusion across multi-hop LLM queries.",
                    },
                    {
                      label: "Knowledge Graph Linkage (sameAs)",
                      status: sameAsCount > 0 ? "Passing" : "Action Needed",
                      desc: "Declares external validation links to Wikidata, Wikipedia, or GitHub so models verify brand authenticity.",
                    },
                    {
                      label: "Organization Publisher Hierarchy",
                      status: data.structuredData?.types?.includes("Organization") ? "Passing" : "Recommended",
                      desc: "Ties software products and articles to a verified parent corporate entity.",
                    },
                    {
                      label: "Semantic Schema Diversity",
                      status: (data.structuredData?.types?.length || 0) >= 3 ? "Passing" : "Moderate",
                      desc: "Having 3+ distinct entity types signals comprehensive content taxonomy to retrieval spiders.",
                    },
                  ].map((audit, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{audit.label}</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            audit.status === "Passing"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {audit.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{audit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOTTOM CALL TO ACTION BANNER */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white rounded-3xl border border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl no-print">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Full Technical SEO &amp; AEO Engine</span>
            </div>
            <h3 className="text-lg font-bold">Need a Complete Technical &amp; AI Visibility Audit?</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Analyze Core Web Vitals, 404 broken links, security headers, and AI Share of Voice in one unified report.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/tools/brand-radar"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Brand Radar (AI SoV)
            </Link>

            <Link
              href="/analyze"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Full SEO Audit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
