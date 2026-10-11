import Link from "next/link";
import UrlAnalyzerInput from "@/components/UrlAnalyzerInput";
import { 
  Search, 
  Layers, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  GitCompare, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Lock, 
  Globe2, 
  Activity, 
  Cpu, 
  Share2, 
  Check, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Code2,
  Link2,
} from "lucide-react";

export default function Home() {
  const auditCards = [
    {
      title: "Deterministic SEO Health",
      score: "85/100",
      grade: "Grade A",
      category: "Technical Health",
      desc: "Transparent, rule-based deductions across metadata, heading hierarchies, indexability tags, and HTTP security headers.",
      badge: "Deterministic",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Core Web Vitals Telemetry",
      score: "LCP 1.2s • FCP 0.8s",
      grade: "Passing",
      category: "Google Lab Vitals",
      desc: "Measured via official Google PageSpeed Insights API. Pinpoints render-blocking CSS, slow TTFB, and layout shifts.",
      badge: "Google API",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "50+ Stack Fingerprints",
      score: "14 Techs Detected",
      grade: "Identified",
      category: "Infrastructure",
      desc: "Detects Next.js, React, Tailwind CSS, Shopify, WordPress, Cloudflare, Stripe, and Google Tag Manager from page signatures.",
      badge: "Signature Engine",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      title: "Heuristic Traffic Modeling",
      score: "420M - 550M / mo",
      grade: "High Confidence",
      category: "Audience Reach",
      desc: "Empirical click distribution models based on discoverable content footprint. Always displays explicit confidence ratings.",
      badge: "Transparent Model",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  const pillars = [
    {
      icon: Search,
      title: "Deterministic 0–100 Technical Auditing",
      suite: "Site Health & Audits",
      tier: "Free",
      tierColor: "bg-slate-100 text-slate-700 border-slate-200",
      desc: "Evaluates 20+ technical rules across Metadata (25 pts), Content & Structure (25 pts), Indexability (25 pts), and Security (25 pts).",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      link: "/analyze",
    },
    {
      icon: Zap,
      title: "Core Web Vitals & PageSpeed Lab",
      suite: "Speed & Authority",
      tier: "Starter",
      tierColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      desc: "Measures real Google Lighthouse metrics (FCP, LCP, CLS, TTFB) offloading heavy computation to Google Cloud infrastructure.",
      color: "text-amber-600 bg-amber-50 border-amber-200",
      link: "/analyze?tab=performance",
    },
    {
      icon: TrendingUp,
      title: "DomCop Open PageRank & Traffic",
      suite: "Speed & Authority",
      tier: "Starter",
      tierColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      desc: "Syncs verified Common Crawl PageRank data, global ranking tiers, and empirical click volume ranges with zero hallucinations.",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      link: "/analyze?tab=traffic",
    },
    {
      icon: GitCompare,
      title: "Competitor Benchmark & Topic Gap",
      suite: "Competitive Suite",
      tier: "Pro",
      tierColor: "bg-blue-50 text-blue-700 border-blue-200",
      desc: "Crawls two domains concurrently, computing score deltas and uncovering DOM TF-IDF semantic topic gaps.",
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      link: "/compare",
    },
    {
      icon: Link2,
      title: "404 Broken Link & Redirect Crawler",
      suite: "Site Health & Audits",
      tier: "Pro",
      tierColor: "bg-purple-50 text-purple-700 border-purple-200",
      desc: "Recursively inspects internal and outbound links, detecting dead hrefs, slow responses, and multi-hop 301 redirect chains.",
      color: "text-purple-600 bg-purple-50 border-purple-200",
      link: "/analyze?tab=deadlinks",
    },
    {
      icon: Sparkles,
      title: "Connected Telemetry & Agency Mode B",
      suite: "Agency Automation",
      tier: "Agency",
      tierColor: "bg-slate-900 text-white border-slate-800",
      desc: "Connects read-only Google Search Console (GSC) and GA4 OAuth telemetry, automated webhook health alerts, and white-label client PDF reports.",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      link: "/dashboard?tab=connected",
    },
  ];

  const comparisonRows = [
    {
      feature: "Monthly Cost",
      seoseite: "Free Starter / $24 Pro",
      traditional: "$129 – $499 / month (Ahrefs / Semrush)",
      win: true,
    },
    {
      feature: "Crawl Latency",
      seoseite: "< 100 ms (High-Speed Cheerio)",
      traditional: "4–8 seconds (Heavy Headless Browser)",
      win: true,
    },
    {
      feature: "Data Integrity & Honesty",
      seoseite: "100% Deterministic + Confidence Scores",
      traditional: "Opaque, black-box traffic estimates",
      win: true,
    },
    {
      feature: "Tech Stack Fingerprinting",
      seoseite: "Included (50+ signatures detected)",
      traditional: "Requires separate tool (BuiltWith $295/mo)",
      win: true,
    },
    {
      feature: "AI Developer Action Items",
      seoseite: "Google Gemini + Copyable Code Snippets",
      traditional: "Generic text recommendations",
      win: true,
    },
    {
      feature: "Permanent Shareable Snapshots",
      seoseite: "Included via immutable UUID links",
      traditional: "Requires paid team seat login",
      win: true,
    },
    {
      feature: "Infrastructure Security",
      seoseite: "Zero-Trust SSRF & Cloud Metadata Shield",
      traditional: "Proprietary / Unknown",
      win: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Pro Banner */}
      <div className="bg-slate-900 text-white py-2 px-4 text-center text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">
            Live Platform
          </span>
          <span>
            Enterprise Website Intelligence & Competitive Benchmarking Engine.
          </span>
          <Link href="/pricing" className="text-blue-400 hover:text-blue-300 font-semibold underline ml-1">
            Explore Subscription Plans →
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Sub-Second Crawling • 50+ Frameworks • Zero Fabricated Metrics
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-5xl mx-auto leading-tight sm:leading-tight mb-6">
          Inspect, Benchmark & Optimize <br className="hidden sm:inline" />
          <span className="text-blue-600">Any Website in Sub-Second Time.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          The deterministic website intelligence platform for modern engineering and SEO teams. 
          Uncover technical health, detect 50+ technology stacks, measure real Core Web Vitals, and estimate traffic reach with absolute transparency.
        </p>

        {/* URL Input Form */}
        <div className="max-w-3xl mx-auto mb-6">
          <UrlAnalyzerInput />
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium pt-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>&lt; 100ms Crawl Latency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Google PageSpeed Insights API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Google Gemini 3.5 Flash Diagnostics</span>
          </div>
        </div>
      </section>

      {/* Live Sample Audit Card Showcase (Flat & Modern) */}
      <section className="py-14 bg-slate-50/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Deterministic Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Grounded Intelligence. Zero Hallucinations.
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Every score, metric, and tech signature is verified by deterministic code and open web standards.
              </p>
            </div>
            <Link
              href="/capstone"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm"
            >
              Read full methodology spec
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {auditCards.map((card, idx) => (
              <div key={idx} className="flat-card p-5 bg-white flex flex-col justify-between hover:border-slate-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {card.category}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
                    {card.score}
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mb-2">{card.grade}</div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{card.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Analytical Pillars Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
            Complete Diagnostic Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Everything You Need to Understand & Outrank Competitors
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Consolidate your SEO scraper, technology detector, Core Web Vitals lab, and AI consultant into one high-velocity platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={idx}
                href={pillar.link}
                className="flat-card p-6 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${pillar.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${pillar.tierColor}`}>
                      {pillar.tier}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {pillar.suite}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  Explore Feature Suite
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SeoSeite vs Traditional Tools Comparison Table */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
              Why We Built SeoSeite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              SeoSeite vs Traditional Platforms
            </h2>
            <p className="text-sm text-slate-600">
              See how our deterministic, sub-second engine compares against costly legacy SEO suites.
            </p>
          </div>

          <div className="flat-card overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-bold">
                    <th className="py-3.5 px-5">Capability / Dimension</th>
                    <th className="py-3.5 px-5 text-blue-700 bg-blue-50/50">SeoSeite Platform</th>
                    <th className="py-3.5 px-5 text-slate-600">Legacy Platforms (Ahrefs / Semrush)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-5 font-semibold text-slate-900">{row.feature}</td>
                      <td className="py-3.5 px-5 font-bold text-blue-700 bg-blue-50/30 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        {row.seoseite}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Real Audit Demonstration Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flat-badge text-indigo-700 bg-indigo-50 border-indigo-200 mb-4">
              Instant Engineering Diagnostics
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Turn Raw Audit Findings Into Copyable Code Snippets
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Instead of giving you vague advice like &quot;improve your heading hierarchy,&quot; SeoSeite synthesizes exact HTML, Nginx configurations, and JSON-LD schema blocks tailored to your target domain.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Parallel Competitor Benchmarking</h4>
                  <p className="text-xs text-slate-600">Compare any two domains simultaneously at <code className="text-blue-600 font-mono">/compare</code> to see exact score deltas and shared frameworks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Google Cloud Run & Cloud SQL Backbone</h4>
                  <p className="text-xs text-slate-600">Hosted in a stateless, autoscaling Google Cloud Run container backed by managed PostgreSQL 16.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Zero-Trust SSRF Defense</h4>
                  <p className="text-xs text-slate-600">Pre-flight DNS filters drop internal RFC 1918 subnets, loopbacks, and cloud metadata APIs before opening sockets.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                <GitCompare className="w-4 h-4" />
                Launch Competitor Benchmark
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View Subscription Plans →
              </Link>
            </div>
          </div>

          {/* Clean Flat Mockup Card */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-mono text-xs text-slate-400 ml-2">github.com — Live Technical Audit</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Score: 85/100 (Grade A)
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Crawl Response Time</span>
                <span className="text-emerald-400 font-bold">95 ms (Cheerio Stream)</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Core Web Vitals (LCP)</span>
                <span className="text-emerald-400 font-bold">1.2s (Passing Google CWV)</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-slate-400 mb-1">Detected Stack Footprint:</div>
                <div className="text-blue-400">Tailwind CSS, Next.js, Cloudflare, Fastly</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-amber-400 font-bold mb-1">Gemini AI Prioritized Fix:</div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  Consolidate secondary headers into H2 and enforce Strict-Transport-Security with includeSubDomains.
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Immutable Snapshot ID: scan_179165...</span>
              <span className="text-emerald-400">● PostgreSQL Synchronized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Audit Any Website In Under 100 Milliseconds.
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            No mandatory logins, no credit card required, and zero fabricated numbers. Get instant technical clarity right now.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-blue-700 font-bold text-sm px-6 py-3.5 rounded-lg shadow-sm transition-colors"
            >
              Start Free Audit Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-6 py-3.5 rounded-lg border border-blue-500 transition-colors"
            >
              View Pricing Tiers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
