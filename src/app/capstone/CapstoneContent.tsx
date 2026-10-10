"use client";

import Link from "next/link";
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  BarChart, 
  FileCode2, 
  CheckCircle2, 
  Server, 
  Database, 
  Printer, 
  HelpCircle, 
  ExternalLink, 
  ArrowRight 
} from "lucide-react";

export default function CapstoneContent() {
  const vivaQuestions = [
    {
      q: "Q1: What is the core problem that your project solves?",
      a: "Commercial SEO and traffic tools (like Ahrefs or Semrush) cost hundreds of dollars monthly and present black-box or fabricated metrics. SeoSeite provides an open-source, deterministic, sub-second intelligence platform that calculates honest 0–100 SEO scores, identifies tech stacks, measures Core Web Vitals, and provides AI developer recommendations without metric hallucination."
    },
    {
      q: "Q2: What is the difference between Server-Side Rendering (SSR) and Client-Side Rendering (CSR) in your application?",
      a: "In CSR, the browser downloads a blank HTML document and JavaScript builds the UI, harming initial paint and SEO. In SeoSeite, Next.js 16 App Router renders components on the server (SSR). When a user requests a page or report, the server queries the database, generates complete HTML, and streams it to the client, delivering instant First Contentful Paint (FCP) and optimal search indexability."
    },
    {
      q: "Q3: Why did you choose Cheerio instead of Puppeteer or Playwright for scraping?",
      a: "Puppeteer and Playwright spin up full headless Chromium browser instances, which require 1–2 GB of RAM per instance and take 4–8 seconds to boot. Cheerio is an ultra-fast HTML parser that builds a DOM tree in memory using pure JavaScript in under 100 milliseconds and uses less than 20 MB of RAM. Because technical SEO checks exist in the raw HTTP response, Cheerio is over 20x faster and allows hundreds of concurrent audits on a modest cloud server."
    },
    {
      q: "Q4: How did you implement protection against Server-Side Request Forgery (SSRF)?",
      a: "Before fetching any URL, src/lib/security/ssrf.ts parses the hostname and resolves its IP address via DNS lookup. It validates that the protocol is strictly http: or https: and verifies that the destination IP does not fall into private RFC 1918 ranges (10.x, 172.16-31.x, 192.168.x), loopback (127.0.0.1, ::1), or cloud link-local metadata addresses (169.254.169.254). If an internal IP is detected, the request is aborted immediately."
    },
    {
      q: "Q5: What is the deterministic formula used for the 0–100 SEO score?",
      a: "The score is divided across four balanced categories of 25 points each: Metadata (25 pts: title tag, description length, canonicals), Content & Structure (25 pts: single H1, heading hierarchy, image alt ratio >= 80%, word count), Indexability (25 pts: noindex absence, robots.txt, sitemap, Schema.org), and Security & Protocol (25 pts: HTTPS, HSTS header, anti-MIME sniffing, sub-500ms TTFB)."
    },
    {
      q: "Q6: How does the Technology Stack Detector work?",
      a: "In src/lib/modules/tech/detector.ts, we maintain a fingerprint dictionary of over 50 technologies. When a page is audited, the detector inspects four distinct layers: HTTP response headers (e.g. x-powered-by, server), HTML meta generator tags, script source URLs (e.g. Google Tag Manager, Shopify), and unique DOM signatures (e.g. #__next for Next.js)."
    },
    {
      q: "Q7: What role does AI play in your system? Does it compute the metrics?",
      a: "No. AI is strictly an analytical and diagnostic interpreter, never the source of truth for raw numbers. Deterministic TypeScript code computes the SEO scores, HTTP headers, and Core Web Vitals. Google Gemini 1.5 Flash receives these verified findings and synthesizes an executive summary, identifies key gaps, and generates copyable code fixes (e.g., specific H1 markup, schema tags, or Nginx HSTS directives)."
    },
    {
      q: "Q8: What happens if the Gemini API key is missing or the external API is down?",
      a: "The system features a dual-engine architecture with graceful fallback. If GEMINI_API_KEY is not present, times out, or encounters rate limits, src/lib/modules/ai/service.ts automatically switches to the Heuristic Rule Synthesizer. It generates rule-based diagnostic fixes and recommendations instantly without throwing an error to the user."
    },
    {
      q: "Q9: Why did you deploy on Google Cloud Run instead of a traditional Virtual Machine?",
      a: "A traditional VM runs 24/7, incurring continuous computing costs and requiring manual OS patching. Google Cloud Run is a stateless, serverless container platform that charges purely on request-based billing. It scales down to zero when idle (costing $0.00) and automatically spins up container instances in sub-second time upon incoming traffic, perfectly optimizing our budget."
    },
    {
      q: "Q10: How does the permanent shareable report snapshot feature work?",
      a: "When an audit is performed, the complete payload is stored in the website_scans table and assigned a UUID id. Users can click 'Share Report', which generates a permanent URL (/report/[id]). When loaded, /api/report/[id] retrieves the historical snapshot directly from PostgreSQL without re-crawling the site, ensuring that audit records remain unchanged over time."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb & Metadata Badge */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="flat-badge text-purple-700 bg-purple-50 border-purple-200 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" />
          BCA Capstone Dissertation
        </span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
          Status: Production Deployed (Google Cloud Run)
        </span>
      </div>

      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-8 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Academic Capstone Documentation & Viva Voce Guide
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Comprehensive project specification, architectural data flows, mathematical formulation models, and university examination defense questions for the SeoSeite Platform.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <a
            href="https://github.com/ayushchandramola95-cell/seoaudit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <FileCode2 className="w-4 h-4" />
            GitHub Repository
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Grid of Core Project Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="flat-card p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Candidate</span>
          <span className="text-base font-bold text-slate-900">Ayush Chandramola</span>
          <span className="text-xs text-slate-500 block mt-1">Final Year BCA (2025–2026)</span>
        </div>
        <div className="flat-card p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Architecture</span>
          <span className="text-base font-bold text-slate-900">Next.js 16 + React 19</span>
          <span className="text-xs text-slate-500 block mt-1">Full-Stack SSR & App Router</span>
        </div>
        <div className="flat-card p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Database Engine</span>
          <span className="text-base font-bold text-slate-900">PostgreSQL 16</span>
          <span className="text-xs text-slate-500 block mt-1">Google Cloud SQL Managed Pool</span>
        </div>
        <div className="flat-card p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Deployment Platform</span>
          <span className="text-base font-bold text-slate-900">Google Cloud Run</span>
          <span className="text-xs text-slate-500 block mt-1">Serverless Stateless Container</span>
        </div>
      </div>

      {/* Abstract Section */}
      <div className="flat-card p-6 sm:p-8 mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Project Abstract & Core Thesis
        </h2>
        <p className="text-slate-700 leading-relaxed text-sm sm:text-base mb-4">
          In the contemporary web ecosystem, technical search compliance, Core Web Vitals, and modern framework adoption determine online discoverability. However, commercial auditing platforms charge exorbitant monthly fees and often display black-box or fabricated metrics.
        </p>
        <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
          <strong>SeoSeite</strong> is an open-source, deterministic intelligence platform that replaces heavy headless browsers with sub-second Cheerio DOM parsing. It calculates honest 0–100 SEO scores across four distinct categories, detects 50+ technology signatures, measures Core Web Vitals via Google PageSpeed Insights, and uses Google Gemini 1.5 Flash to synthesize prioritized developer fixes without hallucinating raw numbers.
        </p>
      </div>

      {/* Mathematical Formulations */}
      <div className="flat-card p-6 sm:p-8 mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-indigo-600" />
          Mathematical & Algorithmic Formulations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2">1. Deterministic 0–100 SEO Scoring Model</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              The aggregate technical health score is computed across four strictly bounded categories:
            </p>
            <div className="bg-white p-3 rounded border border-slate-200 font-mono text-xs text-slate-800 mb-3">
              Score = C_metadata + C_structure + C_indexability + C_security
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li><strong>Metadata (25 pts):</strong> Title length (30-60 chars), description, canonical tag, viewport.</li>
              <li><strong>Content & Structure (25 pts):</strong> Single H1 heading, heading order, image alt ratio (&ge; 80%), word count.</li>
              <li><strong>Indexability (25 pts):</strong> Absence of noindex, valid robots.txt, sitemap, Schema.org JSON-LD.</li>
              <li><strong>Security (25 pts):</strong> HTTPS enforcement, HSTS header, nosniff, frame protection, TTFB &le; 500ms.</li>
            </ul>
          </div>

          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2">2. Heuristic Traffic & Confidence Model</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Estimated monthly reach uses a multi-factor logarithmic footprint model:
            </p>
            <div className="bg-white p-3 rounded border border-slate-200 font-mono text-xs text-slate-800 mb-3">
              V_est = B0 &times; (1 + ln(1 + Words)) &times; (1 + ln(1 + Links)) &times; W_tech &times; (Score / 100)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              Confidence score (0–100%) dynamically increases when verifiable public data sources (PageSpeed lab data, sitemap, schema tags) are discoverable.
            </p>
            <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Zero Metric Fabrication Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* College Viva Voce Examination Questions & Model Answers */}
      <div className="flat-card p-6 sm:p-8 mb-10">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            College Viva Voce Q&A Preparation Pack (Top 10 Essential Defenses)
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            Exam Ready
          </span>
        </div>

        <div className="space-y-6">
          {vivaQuestions.map((item, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4 sm:p-5 bg-white">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                {item.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          ← Back to SaaS Dashboard
        </Link>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Launch Website Analyzer
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
