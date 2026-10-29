"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useProject } from "@/context/ProjectContext";
import {
  Bot,
  FileCode,
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Cpu,
  RefreshCw,
  Compass,
  FileText,
  BarChart2,
  Download,
} from "lucide-react";
import { DeepRobotsSitemapReport } from "@/lib/modules/crawler/robotsSitemap";

interface AuditResult {
  domain: string;
  url: string;
  latencyMs: number;
  data: DeepRobotsSitemapReport;
}

const PRESET_DOMAINS = [
  { domain: "stripe.com", label: "Stripe" },
  { domain: "linear.app", label: "Linear" },
  { domain: "vercel.com", label: "Vercel" },
  { domain: "github.com", label: "GitHub" },
];

export default function RobotsSitemapClient() {
  const { activeDomain } = useProject();
  const [urlInput, setUrlInput] = useState(activeDomain ? `https://${activeDomain}` : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeDomain && !urlInput) {
      setUrlInput(`https://${activeDomain}`);
    }
  }, [activeDomain, urlInput]);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [activeTab, setActiveTab] = useState<"bots" | "robots" | "sitemap" | "geo" | "tester">("bots");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  
  // Interactive path tester state
  const [testPath, setTestPath] = useState("/admin");
  const [testBot, setTestBot] = useState("GPTBot");
  const [generatorMode, setGeneratorMode] = useState<"geo" | "shield" | "standard">("geo");
  const [copiedGen, setCopiedGen] = useState(false);

  // STRICT REQUIREMENT: NO AUTO-FETCHING!
  // Clicking preset ONLY fills the input box; user MUST click Audit to fetch.
  const handleSelectPreset = (domain: string) => {
    setUrlInput(domain);
  };

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/robots-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to inspect robots.txt and sitemap.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyRobotsToClipboard = () => {
    if (!result?.data.rawRobotsSnippet) return;
    navigator.clipboard.writeText(result.data.rawRobotsSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const copyGeneratedToClipboard = () => {
    navigator.clipboard.writeText(generatedRobotsSnippet);
    setCopiedGen(true);
    setTimeout(() => setCopiedGen(false), 2000);
  };

  const pathTestEvaluation = useMemo(() => {
    if (!result || !testPath.trim()) return null;
    const normalized = testPath.trim().startsWith("/") ? testPath.trim() : `/${testPath.trim()}`;
    
    // Check if testBot has blocked rule
    const botPermission = result.data.geo.botPermissions.find(
      (b) => b.botName.toLowerCase() === testBot.toLowerCase()
    );
    const isBotBlockedOverall = botPermission?.status === "blocked";

    // Check disallowed paths
    const matchingDisallow = result.data.disallowedPaths.find((p) => {
      if (p === "/") return true;
      const cleanPattern = p.replace(/\*$/, "");
      return normalized.startsWith(cleanPattern);
    });

    const isBlocked = isBotBlockedOverall || !!matchingDisallow;

    return {
      isBlocked,
      status: isBlocked ? "BLOCKED" : "ALLOWED",
      reason: isBotBlockedOverall
        ? `User-agent '${testBot}' is globally disallowed in robots.txt.`
        : matchingDisallow
        ? `Path matches disallowed directive: 'Disallow: ${matchingDisallow}'`
        : `No matching disallow rule found for '${normalized}'. Crawl is permitted.`,
    };
  }, [result, testPath, testBot]);

  const generatedRobotsSnippet = useMemo(() => {
    const domain = result?.domain || "yourdomain.com";
    if (generatorMode === "geo") {
      return `# High-Visibility GEO AI robots.txt
# Allows primary search engines & AI assistants (ChatGPT, Claude, Perplexity)
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/private/

Sitemap: https://${domain}/sitemap.xml`;
    }

    if (generatorMode === "shield") {
      return `# AI Scraper Shield robots.txt
# Keeps Google & Bing search indexable while blocking AI scrapers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml`;
    }

    return `# Standard Production robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /*?*preview=true

Sitemap: https://${domain}/sitemap.xml`;
  }, [generatorMode, result]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Breadcrumb & Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-blue-600 transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Robots.txt & XML Sitemap</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Bot className="w-3.5 h-3.5" />
              Crawler Directives v2.4
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              GEO AI Engine Ready
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Shield className="w-3.5 h-3.5" />
              SSRF Guard Active
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Robots.txt &amp; XML Sitemap Inspector
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Deeply inspect search engine directives, audit generative AI agent access permissions 
            (GPTBot, ClaudeBot, PerplexityBot), discover index XML sitemaps, and compute your Generative Engine Optimization (GEO) AI readiness score.
          </p>

          {/* Search / Audit Form */}
          <form onSubmit={handleAudit} className="max-w-3xl">
            <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter domain or URL (e.g., stripe.com, https://linear.app)"
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3 border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !urlInput.trim()}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auditing Directives...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Audit Robots &amp; Sitemap</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets - STRICTLY populate only, user must click button to audit */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick presets (fills input, click Audit to run):</span>
              {PRESET_DOMAINS.map((p) => (
                <button
                  key={p.domain}
                  type="button"
                  onClick={() => handleSelectPreset(p.domain)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors ${
                    urlInput === p.domain
                      ? "bg-blue-600/20 text-blue-300 border-blue-500/40"
                      : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
                  }`}
                >
                  {p.domain}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="mt-6 max-w-3xl p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Audit Request Failed</p>
                <p className="mt-0.5 text-xs text-rose-300/90">{error}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!result && !loading && (
          /* IDLE STATE: Clear message that user must click Audit button */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
              <FileCode className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Ready to Inspect Web Directives &amp; AI Crawlers
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
              Enter any domain above or click one of the quick presets, then click <strong>&quot;Audit Robots &amp; Sitemap&quot;</strong> to trigger a live inspection. Data is never fetched automatically.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                  <Bot className="w-4 h-4 text-blue-600" />
                  AI Agent Permissions
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Checks real-time rules for GPTBot, ClaudeBot, PerplexityBot, Applebot, and Google Gemini crawlers.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  XML Sitemap Parser
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Extracts sitemap index locations, checks valid schema structure, and samples indexed URLs.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  GEO AI Readiness
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Computes 0-100 score for Generative Engine Optimization based on content clarity and agent access.
                </p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Top Score Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Robots.txt */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>Robots.txt Directives</span>
                  <FileCode className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${result.data.hasRobotsTxt ? "text-emerald-600" : "text-amber-600"}`}>
                    {result.data.hasRobotsTxt ? "Valid & Live" : "Missing / 404"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {result.data.disallowedPaths.length} disallowed paths • {result.data.crawlDelay ? `${result.data.crawlDelay}s crawl-delay` : "No throttle"}
                </p>
              </div>

              {/* Card 2: XML Sitemap */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>XML Sitemap Status</span>
                  <Compass className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${result.data.sitemap.detected ? "text-emerald-600" : "text-rose-600"}`}>
                    {result.data.sitemap.detected ? "Detected" : "Not Found"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {result.data.sitemap.urlCount.toLocaleString()} URLs indexed • {result.data.sitemap.isSitemapIndex ? "Sitemap Index" : "Standard XML"}
                </p>
              </div>

              {/* Card 3: GEO AI Readiness */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>GEO AI Readiness</span>
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-purple-700">
                    {result.data.geo.score}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    Grade {result.data.geo.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Bot Access: {result.data.geo.aiBotAccessibilityScore}/35 • Schema: {result.data.geo.schemaRichnessScore}/25
                </p>
              </div>

              {/* Card 4: AI Bot Allowed Rate */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>AI Crawler Status</span>
                  <Cpu className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {result.data.geo.botPermissions.filter((b) => b.category === "ai" && b.status !== "blocked").length} / {result.data.geo.botPermissions.filter((b) => b.category === "ai").length}
                  </span>
                  <span className="text-xs text-slate-600">Allowed</span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Latency: {result.latencyMs}ms • SSRF verified
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setActiveTab("bots")}
                  className={`px-6 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "bots"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  AI &amp; Search Bot Permissions ({result.data.geo.botPermissions.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("robots")}
                  className={`px-6 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "robots"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  Raw Robots.txt &amp; Directives
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("sitemap")}
                  className={`px-6 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "sitemap"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  XML Sitemap ({result.data.sitemap.urlCount.toLocaleString()} URLs)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("geo")}
                  className={`px-6 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "geo"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  GEO AI Optimization ({result.data.geo.score}/100)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tester")}
                  className={`px-6 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "tester"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Live Path Tester &amp; AI Generator
                </button>
              </div>

              {/* Tab 1: AI & Search Bots */}
              {activeTab === "bots" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Crawler Access Control Matrix</h3>
                      <p className="text-xs text-slate-600">
                        Determines if major generative AI training crawlers and search indexers are permitted or blocked.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Bot Agent</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Crawl Access Status</th>
                          <th className="py-3 px-4">Crawler Purpose &amp; Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {result.data.geo.botPermissions.map((bot) => (
                          <tr key={bot.botName} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              {bot.botName}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                                bot.category === "ai"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {bot.category === "ai" ? "AI Agent" : "Search Engine"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {bot.status === "allowed" || bot.status === "default_allowed" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Allowed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  Blocked (Disallow)
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-600">
                              {bot.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Raw Robots.txt */}
              {activeTab === "robots" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Directives &amp; Syntax</h3>
                      <p className="text-xs text-slate-600">
                        Target location: <a href={result.data.robotsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-mono">{result.data.robotsUrl}</a>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={copyRobotsToClipboard}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {copiedSnippet ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Raw Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  {result.data.hasRobotsTxt ? (
                    <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-800 text-xs font-mono text-slate-200">
                      <pre className="whitespace-pre-wrap">{result.data.rawRobotsSnippet}</pre>
                    </div>
                  ) : (
                    <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                      <p className="font-semibold">No robots.txt file found at {result.data.robotsUrl}</p>
                      <p className="text-xs mt-1 text-amber-700">
                        Without a robots.txt file, crawlers will assume all public endpoints are allowed, but sitemap discovery requires header or search console declarations.
                      </p>
                    </div>
                  )}

                  {result.data.sitemapsInRobots.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Sitemaps Declared in Robots.txt:
                      </h4>
                      <ul className="space-y-1">
                        {result.data.sitemapsInRobots.map((sm, idx) => (
                          <li key={idx} className="text-xs font-mono text-blue-600 hover:underline">
                            <a href={sm} target="_blank" rel="noopener noreferrer">{sm}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: XML Sitemap */}
              {activeTab === "sitemap" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">XML Sitemap Inspection</h3>
                      <p className="text-xs text-slate-600">
                        Inspecting: <span className="font-mono text-slate-700">{result.data.sitemap.url || `${result.url}/sitemap.xml`}</span>
                      </p>
                    </div>
                  </div>

                  {result.data.sitemap.detected ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-xs text-slate-600 font-medium">Total URLs Detected</p>
                          <p className="text-2xl font-black text-slate-900 mt-1">{result.data.sitemap.urlCount.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-xs text-slate-600 font-medium">Structure Type</p>
                          <p className="text-lg font-bold text-slate-900 mt-1">
                            {result.data.sitemap.isSitemapIndex ? "Sitemap Index (Nested)" : "Standard XML Sitemap"}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-xs text-slate-600 font-medium">Last Modified Tags</p>
                          <p className="text-lg font-bold text-slate-900 mt-1">
                            {result.data.sitemap.hasLastMod ? "Present (<lastmod>)" : "Missing"}
                          </p>
                        </div>
                      </div>

                      {result.data.sitemap.sampleUrls.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Sample URLs Discovered in Sitemap:
                          </h4>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 divide-y divide-slate-200/60 font-mono text-xs max-h-72 overflow-y-auto">
                            {result.data.sitemap.sampleUrls.map((sample, idx) => (
                              <div key={idx} className="py-1.5 flex items-center justify-between hover:text-blue-600 transition-colors">
                                <span className="truncate pr-4">{sample}</span>
                                <a href={sample} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 shrink-0">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                      <p className="font-semibold">No XML Sitemap detected at default endpoints.</p>
                      <p className="text-xs mt-1 text-amber-700">
                        Ensure your sitemap is submitted via Google Search Console and declared in your robots.txt file via the <code>Sitemap: https://domain/sitemap.xml</code> directive.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: GEO AI Readiness */}
              {activeTab === "geo" && (
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="font-bold text-slate-900 text-base">Generative Engine Optimization (GEO) Score</h3>
                    <p className="text-xs text-slate-600">
                      Evaluates your site&apos;s visibility and quotation potential for AI search engines (ChatGPT Search, Perplexity, Google Gemini).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span>AI Bot Crawler Access</span>
                          <span>{result.data.geo.aiBotAccessibilityScore} / 35</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${(result.data.geo.aiBotAccessibilityScore / 35) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span>Structured Schema Richness</span>
                          <span>{result.data.geo.schemaRichnessScore} / 25</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${(result.data.geo.schemaRichnessScore / 25) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span>Heading Clarity &amp; Hierarchy</span>
                          <span>{result.data.geo.headingClarityScore} / 20</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${(result.data.geo.headingClarityScore / 20) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span>Content Depth &amp; Semantic Density</span>
                          <span>{result.data.geo.contentDepthScore} / 20</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full"
                            style={{ width: `${(result.data.geo.contentDepthScore / 20) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {result.data.geo.strengths.length > 0 && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Key Strengths:
                          </h4>
                          <ul className="space-y-1.5 text-xs text-emerald-800">
                            {result.data.geo.strengths.map((str, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="font-bold text-emerald-600">•</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.data.geo.recommendations.length > 0 && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            GEO Optimization Recommendations:
                          </h4>
                          <ul className="space-y-1.5 text-xs text-blue-800">
                            {result.data.geo.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="font-bold text-blue-600">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Live Path Tester & AI Generator */}
              {activeTab === "tester" && (
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Section 1: Live Interactive Path Tester */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-600" />
                        <span>Interactive URL Path Simulator</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Test whether any URL path is Allowed or Blocked by the site&apos;s current robots.txt rules for specific user-agents.
                      </p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
                        <div className="sm:col-span-8">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            URL Path to Test:
                          </label>
                          <input
                            type="text"
                            value={testPath}
                            onChange={(e) => setTestPath(e.target.value)}
                            placeholder="/admin, /api/private, /blog/2026"
                            className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs font-mono rounded-xl px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Crawler Agent:
                          </label>
                          <select
                            value={testBot}
                            onChange={(e) => setTestBot(e.target.value)}
                            className="w-full bg-white text-slate-900 text-xs font-semibold rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="Googlebot">Googlebot (Search)</option>
                            <option value="Bingbot">Bingbot (Search)</option>
                            <option value="GPTBot">GPTBot (ChatGPT)</option>
                            <option value="ClaudeBot">ClaudeBot (Anthropic)</option>
                            <option value="PerplexityBot">PerplexityBot (AI Search)</option>
                            <option value="*">Wildcard (*)</option>
                          </select>
                        </div>
                      </div>

                      {/* Simulation Result */}
                      {pathTestEvaluation && (
                        <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                          pathTestEvaluation.isBlocked
                            ? "bg-rose-50 border-rose-200 text-rose-900"
                            : "bg-emerald-50 border-emerald-200 text-emerald-900"
                        }`}>
                          {pathTestEvaluation.isBlocked ? (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider">Simulation Result:</span>
                              <span className={`text-xs font-black px-2 py-0.5 rounded ${
                                pathTestEvaluation.isBlocked
                                  ? "bg-rose-200 text-rose-900"
                                  : "bg-emerald-200 text-emerald-900"
                              }`}>
                                {pathTestEvaluation.status}
                              </span>
                            </div>
                            <p className="text-xs mt-1 leading-relaxed opacity-90">
                              {pathTestEvaluation.reason}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2: 1-Click AI-Optimized robots.txt Generator */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                          <Bot className="w-4 h-4 text-purple-600" />
                          <span>1-Click AI-Optimized robots.txt Generator</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Generate production-ready crawl directives tailored for maximum AI search visibility or content protection.
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setGeneratorMode("geo")}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            generatorMode === "geo" ? "bg-white text-purple-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Max GEO AI
                        </button>
                        <button
                          type="button"
                          onClick={() => setGeneratorMode("shield")}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            generatorMode === "shield" ? "bg-white text-rose-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          AI Shield
                        </button>
                        <button
                          type="button"
                          onClick={() => setGeneratorMode("standard")}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            generatorMode === "standard" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Standard
                        </button>
                      </div>
                    </div>

                    <div className="relative bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 text-xs font-mono text-slate-200">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                        <span>robots.txt (Tailored for {result.domain})</span>
                        <button
                          type="button"
                          onClick={copyGeneratedToClipboard}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs transition-colors cursor-pointer"
                        >
                          {copiedGen ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-300" />
                              <span>Copy Template</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {generatedRobotsSnippet}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cross-Tool Actions Footer */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold">Inspect Connected Domain In Google Intelligence Hub</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Connect {result.domain} into the unified Google Search Console &amp; GA4 Hub to audit search queries, indexed pages, and engagement.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href={`/tools/google-hub`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md"
                >
                  <span>Open Google Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/tools/security-headers?url=${encodeURIComponent(result.url)}`}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700"
                >
                  <Shield className="w-4 h-4" />
                  <span>Audit Security Headers</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
