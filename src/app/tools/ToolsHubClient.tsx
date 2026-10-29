"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useProject } from "@/context/ProjectContext";
import {
  Link2,
  Zap,
  Code2,
  Search,
  Layers,
  Award,
  ArrowRight,
  Sparkles,
  Filter,
  CheckCircle2,
  ExternalLink,
  Radar,
  Bot,
  GitCompare,
  ListChecks,
  Lock,
  ShieldCheck,
  Terminal,
  Cpu,
  Globe,
  Compass,
  FileText,
  Check,
  Copy,
  BarChart3,
  Flame,
  ArrowUpRight,
  Repeat,
  Database,
} from "lucide-react";

interface ToolCard {
  id: string;
  name: string;
  description: string;
  href: string;
  category: "ai" | "crawl" | "speed" | "meta" | "stack";
  badge: string;
  badgeColor?: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  metric: string;
  features: string[];
}

export default function ToolsHubClient() {
  const { activeDomain } = useProject();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [quickUrl, setQuickUrl] = useState(activeDomain ? `https://${activeDomain}` : "");
  const [selectedToolForLaunch, setSelectedToolForLaunch] = useState("/tools/broken-links");
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  useEffect(() => {
    if (activeDomain && !quickUrl) {
      setQuickUrl(`https://${activeDomain}`);
    }
  }, [activeDomain, quickUrl]);

  const tools: ToolCard[] = [
    {
      id: "google-hub",
      name: "Google Search Console & GA4 Multi-Site Hub",
      description:
        "Manage, switch between, and audit all your verified Google Search Console and GA4 properties. Track impressions, clicks, keyword rankings, and active user channels in one unified console.",
      href: "/tools/google-hub",
      category: "ai",
      badge: "Command Center",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Globe,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 border-blue-200",
      metric: "Multi-Domain Sync",
      features: ["Zero Auto-Fetch Privacy", "Domain & URL Properties", "Real-Time Query Rankings"],
    },
    {
      id: "robots-sitemap",
      name: "Robots.txt & XML Sitemap Inspector",
      description:
        "Audit crawler directives, check AI bot permissions (GPTBot, ClaudeBot, PerplexityBot, Applebot), validate XML sitemaps, and compute your Generative Engine Optimization (GEO) AI readiness score.",
      href: "/tools/robots-sitemap",
      category: "crawl",
      badge: "GEO AI Ready",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Bot,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-200",
      metric: "AI Crawler Rules",
      features: ["AI Bot Permissions", "Sitemap Index Parser", "GEO Readiness 0-100"],
    },
    {
      id: "keyword-research",
      name: "Keyword Density & Frequency Matrix",
      description:
        "Extract 1-word, 2-word, and 3-word n-gram keywords, compute TF-IDF semantic density, verify heading presence (Title, H1), and prevent keyword stuffing penalties.",
      href: "/tools/keyword-research",
      category: "meta",
      badge: "N-Gram Tokenizer",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: FileText,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-200",
      metric: "1/2/3-Grams",
      features: ["Semantic Density %", "Title & H1 Alignment", "CSV Matrix Export"],
    },
    {
      id: "traffic-estimator",
      name: "Organic Traffic & Reach Estimator",
      description:
        "Predict monthly search traffic volumes, model SERP click-through rates (CTR), and estimate channel distributions (Organic, Direct, Referral, Social) powered by Open PageRank.",
      href: "/tools/traffic-estimator",
      category: "speed",
      badge: "Predictive Reach",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: BarChart3,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-200",
      metric: "Monthly Footprint",
      features: ["Channel Inflow Model", "SERP CTR Curves", "Open PageRank Anchor"],
    },
    {
      id: "backlink-checker",
      name: "Backlink Profile & Anchor Text Checker",
      description:
        "Analyze external link footprints, evaluate referring root domains, inspect dofollow vs nofollow citation equity, and benchmark anchor text distributions.",
      href: "/tools/backlink-checker",
      category: "crawl",
      badge: "Link Equity",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Link2,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 border-blue-200",
      metric: "Referring Domains",
      features: ["Dofollow Ratio", "Anchor Diversity", "Spam Risk Index"],
    },
    {
      id: "redirect-tracer",
      name: "HTTP Redirect & Status Code Chain Tracer",
      description:
        "Inspect sequential 301, 302, 307, and 308 redirect hops in real time. Detect redirect loops, measure network latency at each jump, and prevent SSL downgrades.",
      href: "/tools/redirect-tracer",
      category: "stack",
      badge: "Chain Inspector",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      icon: Repeat,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-200",
      metric: "Hop Latency",
      features: ["Hop-by-Hop Trace", "Loop Detection", "SSL Integrity Guard"],
    },
    {
      id: "brand-radar",
      name: "Brand Radar AI & AEO Studio",
      description:
        "Measure brand visibility, sentiment, and organic share of voice (SoV) across ChatGPT, Google Gemini, Perplexity, and Claude for high-intent search queries.",
      href: "/tools/brand-radar",
      category: "ai",
      badge: "Flagship AEO",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Radar,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-200",
      metric: "AI Share of Voice",
      features: ["LLM Search Visibility", "Competitor Sentiment", "Prompt Intelligence"],
    },
    {
      id: "batch-audit",
      name: "Multi-URL Batch SEO Auditor",
      description:
        "Audit up to 15 website URLs simultaneously in parallel. Compare health scores, response latency, tech stacks, and PageRank in a consolidated table.",
      href: "/tools/batch-audit",
      category: "crawl",
      badge: "Parallel Engine",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: ListChecks,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 border-blue-200",
      metric: "Up to 15 URLs",
      features: ["Concurrent Scans", "CSV Export", "Side-by-Side Comparison"],
    },
    {
      id: "speed-lab",
      name: "Core Web Vitals & PageSpeed Lab",
      description:
        "Test synthetic Lighthouse performance, LCP, CLS, INP, FCP, and TTFB directly powered by Google PageSpeed Insights with mobile & desktop emulation.",
      href: "/tools/speed-lab",
      category: "speed",
      badge: "Google API",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      icon: Zap,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-200",
      metric: "LCP, CLS, INP",
      features: ["Real Lighthouse Run", "Field Web Vitals", "Optimization Audit"],
    },
    {
      id: "broken-links",
      name: "Broken Link & 404 Crawler",
      description:
        "Crawl website URLs in real-time to detect 404 dead links, broken redirect chains, missing anchor resources, and external citation health.",
      href: "/tools/broken-links",
      category: "crawl",
      badge: "Deep Crawler",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: Link2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-200",
      metric: "Sub-2s crawl",
      features: ["404 Dead Link Hunt", "Redirect Loop Catch", "Anchor Health"],
    },
    {
      id: "content-gap",
      name: "Semantic Content Gap & Keyword Matrix",
      description:
        "Compare your webpage against any competitor to uncover missing high-intent keywords, topical heading depth disparities, and word count gaps.",
      href: "/tools/content-gap",
      category: "crawl",
      badge: "Competitive Intelligence",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: GitCompare,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-200",
      metric: "Missing Keywords",
      features: ["Competitor Matrix", "Keyword Opportunities", "Heading Disparities"],
    },
    {
      id: "tech-detector",
      name: "Technology Stack Detector",
      description:
        "Profile frameworks (React, Next.js, Vue), CMSs (Shopify, WordPress), CDNs, and server engines with WAF-resilient DNS and header fingerprinting.",
      href: "/tools/tech-detector",
      category: "stack",
      badge: "150+ Signatures",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
      icon: Layers,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-50 border-cyan-200",
      metric: "Topology Map",
      features: ["Architecture Schematics", "Security Audit", "DNS & Mail Records"],
    },
    {
      id: "schema-validator",
      name: "Schema JSON-LD & OG Validator",
      description:
        "Validate Schema.org structured data, rich snippet syntax, OpenGraph tags, and Twitter Cards with real-time JSON linter and pre-built templates.",
      href: "/tools/schema-validator",
      category: "meta",
      badge: "Code Sandbox",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Code2,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 border-blue-200",
      metric: "Live Code Studio",
      features: ["Syntax Error Linter", "Template Generator", "Social Previews"],
    },
    {
      id: "serp-preview",
      name: "Google SERP & AI Overview Simulator",
      description:
        "Simulate pixel-perfect Google desktop and mobile search snippets with real-time character meters, AI Overview citations, and CTR re-writers.",
      href: "/tools/serp-preview",
      category: "meta",
      badge: "Pixel Accurate",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      icon: Search,
      iconColor: "text-blue-600",
      iconBg: "bg-slate-100 border-slate-200",
      metric: "Desktop & Mobile",
      features: ["Pixel Ruler 580px", "AI Overview View", "CTR Headline Optimizer"],
    },
    {
      id: "security-headers",
      name: "Security Headers Guard & SSL Studio",
      description:
        "Audit HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and generate 1-click server hardening configurations for Nginx and Apache.",
      href: "/tools/security-headers",
      category: "stack",
      badge: "OWASP Hardened",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      icon: Lock,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50 border-rose-200",
      metric: "6 Critical Headers",
      features: ["OWASP Hardening", "Config Generator", "Vulnerability Flags"],
    },
    {
      id: "document-architecture",
      name: "Document Architecture & Heading Tree",
      description:
        "Audit H1–H6 heading hierarchies, detect skipped levels, inspect DOM depth distribution, and export clean Markdown outlines for content teams.",
      href: "/tools/document-architecture",
      category: "crawl",
      badge: "Semantic Tree",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      icon: Layers,
      iconColor: "text-teal-600",
      iconBg: "bg-teal-50 border-teal-200",
      metric: "H1–H6 Hierarchy",
      features: ["Tree Visualization", "Skipped Level Flags", "Markdown Outline Export"],
    },
    {
      id: "authority-checker",
      name: "Open PageRank & Authority Checker",
      description:
        "Lookup any domain's PageRank decimal (0–10), global index tier, Moz DA / Ahrefs DR equivalents, and test the interactive PageRank Formula Lab.",
      href: "/tools/authority-checker",
      category: "stack",
      badge: "Common Crawl",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
      icon: Award,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50 border-sky-200",
      metric: "Global Rank",
      features: ["Formula Lab", "E-E-A-T Index", "Anchor Text Distribution"],
    },
    {
      id: "geo-readiness",
      name: "AI Search & GEO Readiness Engine",
      description:
        "Audit how ChatGPT Search, Perplexity AI, Google Gemini, and Claude index your website. Inspect AI bot permissions, detect /llms.txt, and score entity clarity.",
      href: "/tools/geo-readiness",
      category: "ai",
      badge: "Generative Engine",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Bot,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-200",
      metric: "GEO Score 0-100",
      features: ["ChatGPT & Perplexity", "/llms.txt Standard", "Entity Grounding"],
    },
    {
      id: "canonical-inspector",
      name: "Canonical & Duplicate Content Inspector",
      description:
        "Verify rel=canonical tags, detect multiple conflicting tags, test trailing slashes and HTTP vs. HTTPS variants, and prevent duplicate content penalties.",
      href: "/tools/canonical-inspector",
      category: "crawl",
      badge: "Index Integrity",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Link2,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 border-blue-200",
      metric: "Singularity Check",
      features: ["Protocol & Slash Tests", "Self-Ref Verification", "Conflict Detection"],
    },
    {
      id: "hreflang-auditor",
      name: "Hreflang & International SEO Auditor",
      description:
        "Audit alternate language tags, verify return links and self-referencing hreflangs, validate ISO 639-1 / 3166-1 codes, and ensure accurate global targeting.",
      href: "/tools/hreflang-auditor",
      category: "meta",
      badge: "Multilingual",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      icon: Globe,
      iconColor: "text-teal-600",
      iconBg: "bg-teal-50 border-teal-200",
      metric: "ISO Compliance",
      features: ["x-default Standard", "Bidirectional Return Tags", "Cluster Generator"],
    },
    {
      id: "image-optimizer",
      name: "Image SEO & Next-Gen Format Scanner",
      description:
        "Audit image alt text coverage, detect legacy PNGs/JPEGs, check for WebP/AVIF compression, and prevent Cumulative Layout Shift (CLS) penalties.",
      href: "/tools/image-optimizer",
      category: "speed",
      badge: "Media Performance",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      icon: Layers,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-200",
      metric: "Next-Gen Adoption",
      features: ["Alt Text Guard", "AVIF / WebP Savings", "Explicit Dimensions"],
    },
    {
      id: "database-manager",
      name: "Custom PostgreSQL Database Engine",
      description:
        "Connect, test, and manage custom self-hosted or cloud PostgreSQL databases (Supabase, Neon, GCP Cloud SQL, AWS RDS). Run migrations and inspect live audit records.",
      href: "/tools/database-manager",
      category: "stack",
      badge: "Database Engine",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Database,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 border-blue-200",
      metric: "Live Telemetry & DDL",
      features: ["Custom PostgreSQL URI", "1-Click Migrations", "In-Memory Auto Fallback"],
    },
  ];

  const categories = [
    { id: "all", label: "All Engines", count: tools.length },
    { id: "ai", label: "AI & AEO Visibility", count: tools.filter((t) => t.category === "ai").length },
    { id: "crawl", label: "Crawling & Architecture", count: tools.filter((t) => t.category === "crawl").length },
    { id: "speed", label: "Speed & Web Vitals", count: tools.filter((t) => t.category === "speed").length },
    { id: "meta", label: "Meta & Structured Data", count: tools.filter((t) => t.category === "meta").length },
    { id: "stack", label: "Infrastructure & Security", count: tools.filter((t) => t.category === "stack").length },
  ];

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase()) ||
        tool.features.some((f) => f.toLowerCase().includes(search.toLowerCase())) ||
        tool.metric.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tools, search, activeCategory]);

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 3000);
  };

  const handleQuickLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;
    let formatted = quickUrl.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = `https://${formatted}`;
    }
    // Forward to selected tool
    window.location.href = `${selectedToolForLaunch}?url=${encodeURIComponent(formatted)}&domain=${encodeURIComponent(formatted)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Sticky Docked Sub-Navbar */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-600 font-bold text-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">SEO Intelligence Hub</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  {tools.length} Engines Active
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Zero Rate Limits
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Standalone developer tools &amp; competitive diagnostics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/compare"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Compare Domains</span>
            </Link>

            <Link
              href="/analyze"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Full 100-Point Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hero & Universal Tool Quick Launcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            The Unified SEO &amp; Website Intelligence Suite
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            The Complete SEO Intelligence Suite
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            21 specialized growth and diagnostic engines engineered for sub-second crawl speed, competitive intelligence, Core Web Vitals benchmarking, and AI Search visibility.
          </p>

          {/* Universal Quick Launch Bar */}
          <form
            onSubmit={handleQuickLaunch}
            className="mt-8 p-2 rounded-2xl bg-white border border-slate-300 shadow-sm flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto"
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Enter URL to test (e.g. https://yourdomain.com)..."
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 text-xs sm:text-sm rounded-xl focus:outline-none bg-transparent"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={selectedToolForLaunch}
                onChange={(e) => setSelectedToolForLaunch(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-800 border-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="/tools/google-hub">Google GSC &amp; GA4 Hub</option>
                <option value="/tools/traffic-estimator">Organic Traffic Estimator</option>
                <option value="/tools/backlink-checker">Backlink Profile &amp; Anchors</option>
                <option value="/tools/redirect-tracer">HTTP Redirect Chain Tracer</option>
                <option value="/tools/robots-sitemap">Robots.txt &amp; XML Sitemap</option>
                <option value="/tools/keyword-research">Keyword Density Explorer</option>
                <option value="/tools/broken-links">Broken Links Crawler</option>
                <option value="/tools/speed-lab">Core Web Vitals Lab</option>
                <option value="/tools/brand-radar">Brand Radar AI</option>
                <option value="/tools/tech-detector">Tech Stack Detector</option>
                <option value="/tools/schema-validator">Schema Validator</option>
                <option value="/tools/serp-preview">SERP Simulator</option>
                <option value="/tools/authority-checker">Authority Checker</option>
                <option value="/tools/content-gap">Content Gap Matrix</option>
                <option value="/tools/batch-audit">Batch Multi-Auditor</option>
                <option value="/tools/security-headers">Security Headers Guard</option>
                <option value="/tools/document-architecture">Document Architecture</option>
              </select>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Launch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span>Quick test:</span>
            {["stripe.com", "linear.app", "vercel.com", "shopify.com", "github.com"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setQuickUrl(`https://${d}`)}
                className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium cursor-pointer text-[11px]"
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Live Platform Telemetry Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Standalone Engines</span>
              <Cpu className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">11 Available</div>
            <p className="text-xs text-slate-500 mt-0.5">Free unlimited diagnostic suites</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Crawl Pipeline</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">Sub-Second</div>
            <p className="text-xs text-slate-500 mt-0.5">Edge sockets &amp; fast async parsing</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>AI Search Engine Visibility</span>
              <Radar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-700 font-mono">AEO Enabled</div>
            <p className="text-xs text-slate-500 mt-0.5">ChatGPT, Perplexity &amp; Gemini metrics</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Deterministic Health Check</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">100-Point</div>
            <p className="text-xs text-slate-500 mt-0.5">SEO, Performance, Security &amp; Schema</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    activeCategory === cat.id ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Keyword Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search engines (e.g. 404, speed, AI)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center ${tool.iconColor} group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        tool.badgeColor || "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {tool.features.map((feat, fidx) => (
                      <span
                        key={fidx}
                        className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/80"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 text-[11px] font-medium">{tool.metric}</span>
                  <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2 mb-14">
            <Search className="w-6 h-6 mx-auto text-slate-400" />
            <p className="font-semibold text-slate-800">No engines found matching &quot;{search}&quot;.</p>
            <p>Try resetting the category filter or searching for &quot;speed&quot;, &quot;links&quot;, or &quot;schema&quot;.</p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearch("");
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Recommended Diagnostic Workflow Playbook */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs mb-14 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-extrabold mb-1">
                Recommended Execution Order
              </div>
              <h3 className="text-lg font-bold text-slate-900">End-to-End Website Audit Playbook</h3>
              <p className="text-xs text-slate-500">How to combine these specialized engines for total technical and organic dominance.</p>
            </div>
            <Link
              href="/analyze"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>Automate Entire Flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
              <h5 className="text-xs font-bold text-slate-900">Crawl &amp; Hierarchy</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Run <strong>Broken Links</strong> to eradicate 404 dead links, then audit H1–H6 nesting in <strong>Document Architecture</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">2</span>
              <h5 className="text-xs font-bold text-slate-900">Vitals &amp; Hardening</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Benchmark LCP &amp; INP in <strong>PageSpeed Lab</strong>, and enforce HSTS &amp; CSP in <strong>Security Headers Guard</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">3</span>
              <h5 className="text-xs font-bold text-slate-900">Schema &amp; Clickability</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Validate JSON-LD microdata in <strong>Schema Validator</strong> and maximize CTR with the <strong>SERP Simulator</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">4</span>
              <h5 className="text-xs font-bold text-slate-900">AEO &amp; Modern Scale</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Measure LLM citations in <strong>Brand Radar AI</strong> and discover software advantages with <strong>Tech Detector</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Cross-Promotion: Full Audit Suite & Compare */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-slate-900 text-white rounded-3xl flex flex-col justify-between shadow-md border border-slate-800 space-y-6">
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Unified Automation
              </div>
              <h3 className="text-xl font-bold">Need all 11 diagnostic engines at once?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Run a complete 0–100 deterministic technical health audit, PageSpeed test, security check, and AI developer action plan in one combined scan.
              </p>
            </div>
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md self-start"
            >
              Launch Full Website Audit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-indigo-950 text-white rounded-3xl flex flex-col justify-between shadow-md border border-indigo-800 space-y-6">
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Competitive Intelligence
              </div>
              <h3 className="text-xl font-bold">Benchmarking against competitors?</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Compare your website head-to-head with competitor URLs to discover content gaps, technology differences, and performance advantages.
              </p>
            </div>
            <Link
              href="/compare"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white text-slate-900 hover:bg-blue-50 text-xs font-bold transition-all shadow-md self-start"
            >
              Launch Competitor Benchmark <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
