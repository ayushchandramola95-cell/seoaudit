"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Globe,
  Zap,
  Link2,
  Code2,
  Layers,
  Award,
  Radar,
  GitCompare,
  ListChecks,
  LayoutDashboard,
  Terminal,
  BookOpen,
  FileCode,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  CreditCard,
  User,
  Cpu,
  X,
  Command,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: "Core Audits" | "Specialized SEO Engines" | "Developer & Docs";
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  { id: "full-audit", title: "Full Website SEO Auditor", subtitle: "0–100 deterministic technical SEO, speed & AI diagnostic scan", href: "/analyze", category: "Core Audits", badge: "14 Engines", icon: Globe, keywords: "analyze audit scan website seo health score check" },
  { id: "competitor-compare", title: "Head-to-Head Competitor Benchmark", subtitle: "Compare two domains side-by-side with delta metrics & AI summary", href: "/compare", category: "Core Audits", badge: "Dual Crawl", icon: GitCompare, keywords: "compare benchmark competitor vs diff" },
  { id: "dashboard", title: "Operations & Watchlist Dashboard", subtitle: "View saved scan archives, GSC telemetry & automated monitoring", href: "/dashboard", category: "Core Audits", badge: "Telemetry", icon: LayoutDashboard, keywords: "dashboard history archive watchlist gsc analytics" },
  { id: "tools-hub", title: "All 21 Standalone SEO Engines Hub", subtitle: "Browse all modular growth & technical diagnostic utilities", href: "/tools", category: "Core Audits", badge: "Suite", icon: Sparkles, keywords: "tools hub directory utilities" },
  
  // Specialized SEO Engines (Expanded to 21)
  { id: "tool-traffic-estimator", title: "Organic Traffic Estimator", subtitle: "Predict monthly reach, countries, PPC valuation & spline growth curve", href: "/tools/traffic-estimator", category: "Specialized SEO Engines", badge: "Model", icon: Globe, keywords: "traffic estimator monthly reach ppc value volume curve spline" },
  { id: "tool-geo-readiness", title: "AI Search & GEO Readiness Engine", subtitle: "Audit ChatGPT, Perplexity, Gemini, ClaudeBot permissions & /llms.txt", href: "/tools/geo-readiness", category: "Specialized SEO Engines", badge: "AI GEO", icon: Terminal, keywords: "geo generative engine optimization chatgpt perplexity gemini llms.txt bot" },
  { id: "tool-canonical-inspector", title: "Canonical & Duplicate Content Inspector", subtitle: "Detect conflicting canonicals, HTTP vs HTTPS, and trailing slashes", href: "/tools/canonical-inspector", category: "Specialized SEO Engines", badge: "Index Guard", icon: Link2, keywords: "canonical duplicate content index tags self-referencing cross-domain" },
  { id: "tool-hreflang-auditor", title: "Hreflang & International SEO Auditor", subtitle: "Audit alternate language tags, return links, and ISO code compliance", href: "/tools/hreflang-auditor", category: "Specialized SEO Engines", badge: "Global", icon: Globe, keywords: "hreflang international languages alternate x-default iso global" },
  { id: "tool-image-optimizer", title: "Image SEO & Next-Gen Format Scanner", subtitle: "Audit alt text coverage, WebP/AVIF adoption, and CLS image dimensions", href: "/tools/image-optimizer", category: "Specialized SEO Engines", badge: "Media", icon: Layers, keywords: "image optimizer alt text webp avif media cls picture" },
  { id: "tool-backlink-checker", title: "Backlink Profile & Anchor Text Checker", subtitle: "Audit referring domains, Open PageRank authority, and anchor texts", href: "/tools/backlink-checker", category: "Specialized SEO Engines", badge: "Backlinks", icon: Link2, keywords: "backlink checker links referring domains anchor authority" },
  { id: "tool-redirect-tracer", title: "HTTP Redirect & Status Code Tracer", subtitle: "Trace 301/302 hops, redirect loops, and latency chains", href: "/tools/redirect-tracer", category: "Specialized SEO Engines", badge: "Chain", icon: ArrowRight, keywords: "redirect tracer hops chain 301 302 loop status http" },
  { id: "tool-robots-sitemap", title: "Robots.txt & XML Sitemap Engine", subtitle: "Live path tester, AI crawler firewall (GPTBot), and GEO score", href: "/tools/robots-sitemap", category: "Specialized SEO Engines", badge: "Firewall", icon: FileCode, keywords: "robots.txt sitemap crawler gptbot claude bot path tester" },
  { id: "tool-keyword-density", title: "Keyword Density Matrix", subtitle: "1/2/3-gram frequencies, heading alignment, KD% and search intent", href: "/tools/keyword-research", category: "Specialized SEO Engines", badge: "Matrix", icon: Search, keywords: "keyword density matrix n-grams search intent kd volume" },
  { id: "tool-broken-links", title: "Broken Link & 404 Crawler", subtitle: "Detect dead 404 links, redirect chains & anchor statuses", href: "/tools/broken-links", category: "Specialized SEO Engines", badge: "Sub-2s Crawl", icon: Link2, keywords: "broken links 404 dead crawler redirects anchor" },
  { id: "tool-speed-lab", title: "Core Web Vitals & PageSpeed Lab", subtitle: "Synthetic Lighthouse performance, LCP, CLS, INP, FCP & TTFB", href: "/tools/speed-lab", category: "Specialized SEO Engines", badge: "Google API", icon: Zap, keywords: "speed lab core web vitals pagespeed lighthouse lcp cls ttfb" },
  { id: "tool-schema-validator", title: "Schema JSON-LD & OpenGraph Validator", subtitle: "Validate Schema.org structured data, rich snippets & social meta", href: "/tools/schema-validator", category: "Specialized SEO Engines", badge: "Code Studio", icon: Code2, keywords: "schema json-ld structured data opengraph og twitter validator" },
  { id: "tool-serp-preview", title: "Google SERP Simulator", subtitle: "Pixel-accurate desktop & mobile Google search snippet previewer", href: "/tools/serp-preview", category: "Specialized SEO Engines", badge: "Pixel Meter", icon: Search, keywords: "serp preview simulator google snippet title meta description" },
  { id: "tool-tech-detector", title: "50+ Technology Stack Detector", subtitle: "Identify frameworks (Next.js, React), CMSs, CDNs & analytics", href: "/tools/tech-detector", category: "Specialized SEO Engines", badge: "<100ms", icon: Layers, keywords: "tech stack detector wappalyzer cms framework nextjs wordpress" },
  { id: "tool-authority-checker", title: "Open PageRank & Domain Authority Lookup", subtitle: "Query global domain rank and 0–10 PageRank from Common Crawl", href: "/tools/authority-checker", category: "Specialized SEO Engines", badge: "Open Data", icon: Award, keywords: "authority pagerank domcop domain rating rank backlinks" },
  { id: "tool-brand-radar", title: "Brand Radar AI & AEO Studio", subtitle: "Measure AI Share of Voice across ChatGPT, Gemini, Perplexity & Claude", href: "/tools/brand-radar", category: "Specialized SEO Engines", badge: "AEO Flagship", icon: Radar, keywords: "brand radar ai aeo geo share of voice chatgpt gemini perplexity" },
  { id: "tool-content-gap", title: "Semantic Content Gap & Keyword Matrix", subtitle: "Uncover missing competitor keywords, N-grams & heading gaps", href: "/tools/content-gap", category: "Specialized SEO Engines", badge: "Keywords", icon: GitCompare, keywords: "content gap semantic keywords matrix density n-grams" },
  { id: "tool-batch-audit", title: "Multi-URL Batch SEO Auditor", subtitle: "Audit up to 15 URLs simultaneously in a unified comparison matrix", href: "/tools/batch-audit", category: "Specialized SEO Engines", badge: "Bulk 15 URLs", icon: ListChecks, keywords: "batch bulk multi url audit matrix csv" },
  { id: "tool-google-hub", title: "Google Search Console & GA4 Hub", subtitle: "Multi-property GSC clicks, CTR, rankings & GA4 live traffic", href: "/tools/google-hub", category: "Specialized SEO Engines", badge: "Google API", icon: Globe, keywords: "google search console gsc ga4 analytics clicks ctr" },

  // Developer & Docs
  { id: "doc-mcp", title: "MCP Server for Claude & Cursor IDE", subtitle: "Connect SEO Audit tools directly to AI coding agents via stdio/REST", href: "/mcp", category: "Developer & Docs", badge: "AI Agent", icon: Terminal, keywords: "mcp model context protocol claude cursor ide agent" },
  { id: "doc-api", title: "REST API Reference & Playground", subtitle: "Interactive endpoint documentation for /api/analyze and /api/compare", href: "/api-docs", category: "Developer & Docs", badge: "REST JSON", icon: FileCode, keywords: "api docs reference endpoints json webhook" },
  { id: "doc-architecture", title: "System Architecture & Cloud Topology", subtitle: "Google Cloud Run, Cloud SQL, SSRF guard & hybrid scoring", href: "/architecture", category: "Developer & Docs", badge: "System Spec", icon: Cpu, keywords: "architecture cloud run sql ssrf diagram system" },
  { id: "doc-capstone", title: "Scoring Methodology & Capstone Defense", subtitle: "Mathematical formulas, rubric breakdown & academic defense", href: "/capstone", category: "Developer & Docs", badge: "Methodology", icon: BookOpen, keywords: "capstone methodology scoring formula defense report" },
  { id: "doc-worklog", title: "Engineering Worklog", subtitle: "Chronological build log of all phases and modules", href: "/worklog", category: "Developer & Docs", badge: "Changelog", icon: BookOpen, keywords: "worklog changelog engineering phases timeline" },
  { id: "pricing", title: "Plans & Quota Pricing", subtitle: "Compare Free, Starter ($19), Pro ($49), and Agency ($149) tiers", href: "/pricing", category: "Developer & Docs", badge: "4 Tiers", icon: CreditCard, keywords: "pricing plans upgrade billing tier pro enterprise" },
  { id: "account", title: "Account & Subscription Settings", subtitle: "Manage active plan tier, API keys, and daily scan quotas", href: "/account", category: "Developer & Docs", icon: User, keywords: "account profile settings subscription quota" },
];

export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }
    function handleCustomOpen() {
      setIsOpen(true);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("seoseite:open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("seoseite:open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  const trimmedQuery = query.trim();

  const looksLikeDomain = useMemo(() => {
    if (!trimmedQuery || trimmedQuery.includes(" ")) return false;
    return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(trimmedQuery);
  }, [trimmedQuery]);

  const filteredItems = useMemo(() => {
    if (!trimmedQuery) return COMMAND_ITEMS;
    const q = trimmedQuery.toLowerCase();
    return COMMAND_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [trimmedQuery]);

  const totalActionCount = filteredItems.length + (looksLikeDomain ? 1 : 0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [trimmedQuery]);

  const executeSelection = (idx: number) => {
    if (looksLikeDomain) {
      if (idx === 0) {
        setIsOpen(false);
        setQuery("");
        router.push(`/analyze?url=${encodeURIComponent(trimmedQuery)}`);
        return;
      }
      const target = filteredItems[idx - 1];
      if (target) {
        setIsOpen(false);
        setQuery("");
        router.push(target.href);
      }
    } else {
      const target = filteredItems[idx];
      if (target) {
        setIsOpen(false);
        setQuery("");
        router.push(target.href);
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (totalActionCount === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % totalActionCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalActionCount) % totalActionCount);
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeSelection(selectedIndex);
    }
  };

  if (!isOpen) return null;

  const categories: Array<CommandItem["category"]> = [
    "Core Audits",
    "Specialized SEO Engines",
    "Developer & Docs",
  ];

  let runningIndex = looksLikeDomain ? 1 : 0;

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-[10vh] px-4 print:hidden animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/60">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Jump to any of the 9 SEO tools, docs, or type a domain (e.g. stripe.com)..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded">
              Clear
            </button>
          )}
          <button type="button" onClick={() => setIsOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto p-2 divide-y divide-slate-100">
          {looksLikeDomain && (
            <div className="pb-2">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                Instant Domain Action
              </div>
              <button
                type="button"
                onClick={() => executeSelection(0)}
                onMouseEnter={() => setSelectedIndex(0)}
                className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                  selectedIndex === 0 ? "bg-blue-600 text-white" : "bg-blue-50/70 text-slate-900 hover:bg-blue-100/70"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedIndex === 0 ? "bg-white/20 text-white" : "bg-blue-600 text-white"}`}>
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">
                      Audit <span className="font-mono underline">{trimmedQuery}</span> right now
                    </div>
                    <div className={`text-[11px] truncate ${selectedIndex === 0 ? "text-blue-100" : "text-slate-500"}`}>
                      Launch full 14-engine deterministic SEO &amp; Core Web Vitals scan
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md shrink-0 ${selectedIndex === 0 ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                  Run Scan <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            </div>
          )}
          {categories.map((category) => {
            const itemsInCat = filteredItems.filter((i) => i.category === category);
            if (itemsInCat.length === 0) return null;

            return (
              <div key={category} className="py-1.5 first:pt-0 last:pb-0">
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {category}
                </div>
                <div className="space-y-0.5">
                  {itemsInCat.map((item) => {
                    const itemIdx = runningIndex++;
                    const isSelected = selectedIndex === itemIdx;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => executeSelection(itemIdx)}
                        onMouseEnter={() => setSelectedIndex(itemIdx)}
                        className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 text-blue-950 border border-blue-200/80"
                            : "text-slate-700 hover:bg-slate-50 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold truncate ${isSelected ? "text-blue-700" : "text-slate-900"}`}>
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border shrink-0 ${isSelected ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">{item.subtitle}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400">{item.href}</span>
                          <CornerDownLeft className={`w-3.5 h-3.5 ${isSelected ? "opacity-100 text-blue-600" : "opacity-0"}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {totalActionCount === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold text-slate-700">No matching tools or pages for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">
                Try typing a domain like <span className="font-mono text-slate-700">stripe.com</span> to launch a live audit.
              </p>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-700">↑↓</kbd> Navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-700">↵</kbd> Open
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-700">Esc</kbd> Close
            </span>
          </div>
          <div className="flex items-center gap-1 font-medium text-slate-500">
            <Command className="w-3 h-3 text-blue-600" />
            <span>Global Quick Launcher (Ctrl+K)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
