"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  FileText,
  HelpCircle,
  X
} from "lucide-react";

interface SlideData {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  speakerNotes: string;
}

export default function PresentationClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [showVivaModal, setShowVivaModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const deckContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const vivaQuestions = [
    {
      q: "1. Why did you choose Cheerio over Headless Chrome (Puppeteer / Playwright)?",
      a: "Headless Chrome spins up a full Chromium instance consuming 1–2 GB RAM per crawl and taking 4–8 seconds. Cheerio is an ultra-fast in-memory DOM parser written in pure JavaScript that parses HTML in under 100ms using less than 20MB RAM, allowing high-throughput concurrent audits without crashing servers."
    },
    {
      q: "2. How does your platform protect against Server-Side Request Forgery (SSRF)?",
      a: "In src/lib/security/ssrf.ts, we execute a pre-flight DNS lookup to resolve the host IP before opening any network socket. We drop requests targeting RFC 1918 private subnets (10.x, 172.16-31.x, 192.168.x), loopbacks (127.0.0.1, ::1), and cloud metadata endpoints (169.254.169.254), enforcing an 8-second socket timeout."
    },
    {
      q: "3. Does the Google Gemini AI model generate or calculate the SEO scores?",
      a: "No. Deterministic TypeScript code computes all scores, headers, and Core Web Vitals. Gemini AI is strictly an analytical reasoning layer that inspects the verified findings to synthesize executive summaries and generate copyable developer code fixes without hallucinating raw numbers."
    },
    {
      q: "4. What is the mathematical formulation of the 0–100 SEO Score?",
      a: "The score is divided into four equal 25-point categories: Metadata (25 pts), Content & Structure (25 pts), Indexability (25 pts), and Security & Protocol (25 pts). Each category evaluates binary and weighted compliance rules with explicit deductions."
    },
    {
      q: "5. How does permanent report sharing work without re-scraping the target website?",
      a: "When an audit is executed, the entire payload is saved in Google Cloud SQL PostgreSQL and assigned a unique UUID. The route /report/[id] queries PostgreSQL directly by ID, ensuring immutable historical snapshots that do not trigger repeated network crawls."
    }
  ];

  const slides: SlideData[] = [
    {
      id: 1,
      tag: "Final Year Capstone Project • 2025–2026",
      title: "SeoSeite (WebIntel)",
      subtitle: "An AI-Powered Website Intelligence, Deterministic SEO Auditing, Traffic Estimation & Competitor Benchmarking Platform",
      speakerNotes: "Good morning respected professors and evaluators. Today I am presenting SeoSeite, an enterprise-grade website intelligence SaaS platform built with Next.js 16, TypeScript, Google Cloud Run, and Gemini AI to deliver sub-second, deterministic technical audits without fabricated numbers.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Presenter</span>
              <div className="text-xl font-black text-white mt-1">Ayush Chandramola</div>
              <div className="text-xs text-slate-400 mt-0.5">Final Year BCA Candidate</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Full-Stack Core</span>
              <div className="text-xl font-black text-blue-400 mt-1">Next.js 16 + React 19</div>
              <div className="text-xs text-slate-400 mt-0.5">TypeScript • Tailwind CSS v4</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Cloud Infrastructure</span>
              <div className="text-xl font-black text-emerald-400 mt-1">Google Cloud Run</div>
              <div className="text-xs text-slate-400 mt-0.5">Cloud SQL PostgreSQL 16</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200 flex items-center justify-between">
            <span>Live Production URL: <strong className="text-white font-mono">https://seoaudit-93977081206.us-central1.run.app</strong></span>
            <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase">Production Live</span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      tag: "Problem Statement & Motivation",
      title: "Why Does the Web Need SeoSeite?",
      subtitle: "Current web audit ecosystems suffer from closed access, opaque algorithms, and massive server resource exhaustion.",
      speakerNotes: "We identified three major flaws in modern SEO software: closed paywalled access, black-box data fabrication, and heavy headless browsers that crash servers. SeoSeite directly solves all three.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/80 border-t-4 border-rose-500 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Flaw 01</div>
              <h3 className="text-lg font-bold text-white mb-2">Closed Paywalls</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard web inspection and technical diagnostics are locked behind closed commercial paywalls, denying developers and researchers direct access to their own website telemetry.
              </p>
            </div>
            <div className="text-xl font-black font-mono text-rose-400 mt-4">Closed Ecosystems</div>
          </div>

          <div className="bg-slate-900/80 border-t-4 border-amber-500 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Flaw 02</div>
              <h3 className="text-lg font-bold text-white mb-2">Opaque &amp; Fabricated Data</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Proprietary ratings hallucinate exact visitor numbers and domain authority without disclosing confidence bounds or mathematical methodology.
              </p>
            </div>
            <div className="text-xl font-black font-mono text-amber-400 mt-4">Black Box Math</div>
          </div>

          <div className="bg-slate-900/80 border-t-4 border-indigo-500 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Flaw 03</div>
              <h3 className="text-lg font-bold text-white mb-2">Server Resource Bloat</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Traditional crawlers launch headless Chromium (Puppeteer/Playwright) consuming 1–2 GB RAM per crawl, causing severe latency and memory exhaustion.
              </p>
            </div>
            <div className="text-xl font-black font-mono text-indigo-400 mt-4">2 GB RAM Bloat</div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      tag: "Solution & Engineering Philosophy",
      title: "The SeoSeite Solution & Core Values",
      subtitle: "A high-performance SaaS platform delivering honest, verifiable website diagnostics across five analytical pillars.",
      speakerNotes: "Our primary engineering rule: Zero Fabricated Metrics. Numbers are computed with deterministic math and verified APIs, while Gemini AI is strictly used as an analytical reasoning layer to suggest developer code fixes.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Core System Guarantees
            </h3>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Sub-Second Crawl Latency (&lt;100ms):</strong> Lightweight Cheerio DOM parser extracts headers and tags without browser overhead.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Deterministic 0–100 SEO Score:</strong> Transparent mathematical formula divided into 4 equal 25-point categories.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>50+ Signature Tech Stack Detector:</strong> Fingerprints CMSs, frameworks, CDNs, and server runtimes in milliseconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Core Web Vitals Telemetry:</strong> Google PageSpeed Insights REST API measures LCP, CLS, INP, and TTFB.</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-950/30 border border-blue-700/50 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Zero-Hallucination AI Philosophy
            </h3>
            <p className="text-xs text-blue-200 leading-relaxed font-semibold">
              AI is strictly an analytical interpreter, never the source of truth for numbers.
            </p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Deterministic code computes all raw metrics and audit checks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Google Gemini AI interprets verified findings to synthesize developer code fixes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Automated Heuristic Rule Synthesizer activates if external APIs time out.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      tag: "System Design & Pipeline",
      title: "Full-Stack System Architecture & Data Flow",
      subtitle: "Microservice containerization deployed on Google Cloud Run with Google Cloud SQL PostgreSQL 16.",
      speakerNotes: "Here is our 6-layer architecture. Requests pass through our SSRF security shield first, feed into Cheerio in under 100 milliseconds, compute deterministic metrics, generate Gemini AI code fixes, and save immutable snapshots in Cloud SQL.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white">6-Layer Pipeline</h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 1:</strong> Next.js 16 App Router + React 19 UI</span>
                <span className="text-blue-400 text-[10px] font-mono">SSR / Client</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 2:</strong> SSRF Security Shield &amp; Pre-Flight DNS</span>
                <span className="text-rose-400 text-[10px] font-mono">Zero Trust</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 3:</strong> Cheerio HTML DOM &amp; Header Parser</span>
                <span className="text-emerald-400 text-[10px] font-mono">&lt; 100ms</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 4:</strong> Deterministic Scorer &amp; PageSpeed API</span>
                <span className="text-amber-400 text-[10px] font-mono">0–100 Formula</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 5:</strong> Google Gemini AI Diagnostic Synthesizer</span>
                <span className="text-purple-400 text-[10px] font-mono">Code Fixes</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 6:</strong> Google Cloud SQL PostgreSQL 16</span>
                <span className="text-cyan-400 text-[10px] font-mono">UUID /report/[id]</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-[11px] text-blue-300 leading-relaxed overflow-x-auto">
            <div className="text-slate-500 font-bold mb-2">// Complete Request Flow</div>
            Target URL Submission<br />
            &nbsp;&nbsp;│<br />
            &nbsp;&nbsp;▼<br />
            [SSRF DNS Guard] ──► Drops 127.0.0.1 / 169.254.x<br />
            &nbsp;&nbsp;│<br />
            &nbsp;&nbsp;▼<br />
            [Cheerio Engine] ──► Sub-100ms Parse<br />
            &nbsp;&nbsp;│<br />
            &nbsp;&nbsp;├─► 0–100 Category Scorer<br />
            &nbsp;&nbsp;├─► 50+ Tech Detector<br />
            &nbsp;&nbsp;├─► Google PageSpeed CWV API<br />
            &nbsp;&nbsp;│<br />
            &nbsp;&nbsp;▼<br />
            [Gemini AI Synthesizer] ──► Code Actions<br />
            &nbsp;&nbsp;│<br />
            &nbsp;&nbsp;▼<br />
            [PostgreSQL Pool] ──► Permanent Snapshot
          </div>
        </div>
      ),
    },
    {
      id: 5,
      tag: "Product Capabilities",
      title: "9 Specialized Diagnostic Engines",
      subtitle: "A unified suite engineered for technical SEO consultants, webmasters, agencies, and autonomous AI agents.",
      speakerNotes: "Beyond the full audit, SeoSeite includes 9 focused utility engines: side-by-side competitor benchmarking, PageSpeed Lab, Schema Validator, Tech Detector, 404 Broken Link Crawler, and Brand Radar AEO.",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-blue-400">01 • Audit</div>
            <h4 className="text-sm font-bold text-white mt-1">SEO Health Scorer</h4>
            <p className="text-xs text-slate-400 mt-1">0–100 deterministic scoring with radial SVG gauge.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-purple-400">02 • Competitive</div>
            <h4 className="text-sm font-bold text-white mt-1">Competitor Benchmark</h4>
            <p className="text-xs text-slate-400 mt-1">Side-by-side URL compare with winner metrics.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-emerald-400">03 • Web Vitals</div>
            <h4 className="text-sm font-bold text-white mt-1">Speed Lab</h4>
            <p className="text-xs text-slate-400 mt-1">LCP, CLS, INP, and TTFB via Google API.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-pink-400">04 • Code Studio</div>
            <h4 className="text-sm font-bold text-white mt-1">Schema JSON-LD</h4>
            <p className="text-xs text-slate-400 mt-1">Validates structured data &amp; OpenGraph tags.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-amber-400">05 • Stack</div>
            <h4 className="text-sm font-bold text-white mt-1">50+ Tech Detector</h4>
            <p className="text-xs text-slate-400 mt-1">Detects CMS, React, Next.js, and CDNs in &lt;100ms.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-cyan-400">06 • AEO AI</div>
            <h4 className="text-sm font-bold text-white mt-1">Brand Radar AI</h4>
            <p className="text-xs text-slate-400 mt-1">Brand citation Share of Voice across LLMs.</p>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      tag: "Security Engineering",
      title: "Enterprise SSRF Defense & Safe Crawling",
      subtitle: "Server-Side Request Forgery mitigation implemented at the network resolution level.",
      speakerNotes: "Security was a day-one priority. We engineered a pre-flight DNS resolution filter that resolves destination IPs before opening a socket, dropping all private subnets, loopbacks, and cloud metadata attacks to prevent credential exfiltration.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              The SSRF Threat Model
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Public URL scrapers are highly vulnerable to attackers submitting internal addresses to exfiltrate database credentials or cloud IAM tokens.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300 pt-2">
              <div className="p-2 rounded bg-rose-950/40 border border-rose-800/50 text-rose-200">
                🚫 <strong>RFC 1918 Private Subnets:</strong> 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
              </div>
              <div className="p-2 rounded bg-rose-950/40 border border-rose-800/50 text-rose-200">
                🚫 <strong>Loopback &amp; Localhost:</strong> 127.0.0.1, ::1, 0.0.0.0
              </div>
              <div className="p-2 rounded bg-rose-950/40 border border-rose-800/50 text-rose-200">
                🚫 <strong>Cloud Metadata APIs:</strong> 169.254.169.254, metadata.google.internal
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">// src/lib/security/ssrf.ts</div>
            <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
{`const ips = await dns.resolve4(parsed.hostname);

for (const ip of ips) {
  if (isPrivateOrReservedIp(ip)) {
    throw new SecurityException(
      "SSRF_BLOCKED: Resolved internal IP"
    );
  }
}

// Timeout: 8000ms socket abortion
// Payload Limit: 5 MB stream cutoff`}
            </pre>
            <p className="text-[11px] text-slate-400 pt-2">
              Enforces pre-flight DNS lookups to defeat DNS Rebinding attacks.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      tag: "AI Innovation & MCP",
      title: "Model Context Protocol (FastMCP) for AI Agents",
      subtitle: "Connecting Claude Desktop, Cursor IDE, and autonomous agents directly to SeoSeite via JSON-RPC 2.0.",
      speakerNotes: "We also implemented an enterprise Model Context Protocol gateway. Developers using Cursor or Claude Desktop can directly ask their AI to audit websites and detect tech stacks using our live tools.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              What is MCP?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Model Context Protocol is Anthropic's open standard enabling LLMs to call local and cloud tools securely.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2">
              <li><strong>seoseite_audit_url:</strong> Autonomous audits &amp; Core Web Vitals directly in IDE.</li>
              <li><strong>seoseite_compare_domains:</strong> Head-to-head competitor compare in chat.</li>
              <li><strong>seoseite_detect_tech:</strong> Live framework interrogation during coding.</li>
              <li><strong>seoseite_check_broken_links:</strong> Crawls dead links with markdown summaries.</li>
            </ul>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">// .cursor/mcp.json</div>
            <pre className="text-xs font-mono text-blue-300 leading-relaxed">
{`{
  "mcpServers": {
    "seoseite": {
      "command": "npx",
      "args": ["-y", "@seoseite/mcp-server"],
      "env": {
        "SEOSEITE_API_KEY": "sk_live_token"
      }
    }
  }
}`}
            </pre>
            <p className="text-[11px] text-slate-400 pt-2">
              Allows developers to type <em>"Audit linear.app with SeoSeite"</em> inside Cursor IDE.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      tag: "DevOps & Production Metrics",
      title: "Google Cloud Run & Production Metrics",
      subtitle: "Serverless containerization delivering enterprise scalability with zero idle maintenance cost.",
      speakerNotes: "Our production container is just 140MB, runs on Google Cloud Run with sub-second cold starts, scales to zero when idle with zero idle compute waste, and passes all 46 Next.js route builds with zero TypeScript errors.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl text-center">
              <div className="text-3xl font-black font-mono text-blue-400">&lt; 100ms</div>
              <div className="text-xs font-bold text-white mt-1">Average Crawl Latency</div>
              <div className="text-[11px] text-slate-500">In-memory Cheerio DOM</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl text-center">
              <div className="text-3xl font-black font-mono text-purple-400">140 MB</div>
              <div className="text-xs font-bold text-white mt-1">Docker Image Size</div>
              <div className="text-[11px] text-slate-500">Node 20 Alpine Standalone</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl text-center">
              <div className="text-3xl font-black font-mono text-emerald-400">0 Instances</div>
              <div className="text-xs font-bold text-white mt-1">Scale-to-Zero Footprint</div>
              <div className="text-[11px] text-slate-500">Stateless Serverless Pods</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl text-center">
              <div className="text-3xl font-black font-mono text-amber-400">46 / 46</div>
              <div className="text-xs font-bold text-white mt-1">Routes Compiled</div>
              <div className="text-[11px] text-slate-500">0 TypeScript Errors</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-xs text-slate-300">
            • Multi-stage Docker container binding to PORT 8080 on Google Cloud Run.<br />
            • Resilient PostgreSQL pool connecting to Cloud SQL with local in-memory fallback.<br />
            • Permanent immutable report snapshots stored by UUID (`/report/[id]`).
          </div>
        </div>
      ),
    },
    {
      id: 9,
      tag: "Comparative Engineering Matrix",
      title: "SeoSeite vs Traditional Web Crawlers",
      subtitle: "A direct systems engineering comparison highlighting efficiency, security, and algorithmic transparency.",
      speakerNotes: "This comparative matrix demonstrates why our architectural choices matter: we cut memory consumption from 2 gigabytes down to under 20 megabytes, achieved sub-100ms parse speeds, and instituted strict SSRF DNS security.",
      content: (
        <div className="overflow-x-auto bg-slate-900/80 border border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3.5">Engineering Dimension</th>
                <th className="p-3.5 text-blue-400 font-extrabold">SeoSeite (This Project)</th>
                <th className="p-3.5 text-slate-400">Headless Chrome Scrapers</th>
                <th className="p-3.5 text-slate-400">Commercial Audit Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              <tr>
                <td className="p-3.5 font-bold text-white">Crawl Engine</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Cheerio In-Memory DOM</td>
                <td className="p-3.5 text-slate-400">Chromium (Puppeteer)</td>
                <td className="p-3.5 text-slate-400">Proprietary Cluster</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-white">RAM Consumption</td>
                <td className="p-3.5 text-emerald-400 font-semibold">&lt; 20 MB / process</td>
                <td className="p-3.5 text-rose-400">1,500 – 2,000 MB</td>
                <td className="p-3.5 text-slate-400">High Server Footprint</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-white">Parse Latency</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Sub-100 ms average</td>
                <td className="p-3.5 text-rose-400">4,000 – 8,000 ms</td>
                <td className="p-3.5 text-slate-400">Queued / Asynchronous</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-white">Scoring Method</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Deterministic 0–100 Formula</td>
                <td className="p-3.5 text-slate-400">Lighthouse Only</td>
                <td className="p-3.5 text-amber-400">Black-Box Proprietary</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-white">SSRF Security</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Pre-Flight DNS IP Shield</td>
                <td className="p-3.5 text-rose-400">Usually Unfiltered</td>
                <td className="p-3.5 text-slate-400">Internal Whitelist</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-white">Agent Integration</td>
                <td className="p-3.5 text-emerald-400 font-semibold">Model Context Protocol (MCP)</td>
                <td className="p-3.5 text-slate-400">None</td>
                <td className="p-3.5 text-slate-400">Proprietary REST API Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: 10,
      tag: "Conclusion & Defense",
      title: "Summary & Project Demonstration",
      subtitle: "SeoSeite establishes an honest, high-performance, and verifiable website intelligence platform.",
      speakerNotes: "Thank you for your time and attention. I am now pleased to demonstrate the live platform and welcome your questions.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl text-center">
              <h4 className="text-base font-bold text-white mb-1">Open &amp; Transparent</h4>
              <p className="text-xs text-slate-400">Zero fabricated metrics. Full algorithmic clarity and verifiable sources.</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl text-center">
              <h4 className="text-base font-bold text-white mb-1">High Performance</h4>
              <p className="text-xs text-slate-400">Sub-second Cheerio DOM crawling, Next.js 16 SSR, and Google Cloud Run.</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl text-center">
              <h4 className="text-base font-bold text-white mb-1">AI Agent Ready</h4>
              <p className="text-xs text-slate-400">Model Context Protocol (FastMCP) integration for modern autonomous workflows.</p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 text-center space-y-3">
            <h3 className="text-2xl font-black text-white">Thank You!</h3>
            <p className="text-sm text-slate-300">Ready for Live Demonstration &amp; Viva Voce Defense</p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Launch Dashboard Demo
              </Link>
              <Link
                href="/analyze"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Launch Website Audit
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentSlideData = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      const target = deckContainerRef.current || document.documentElement;
      if (target.requestFullscreen) {
        target.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullScreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  return (
    <div
      ref={deckContainerRef}
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative ${
        isFullscreen ? "h-screen overflow-hidden p-0" : ""
      }`}
    >
      {/* Top Header Bar — Completely hidden during Fullscreen mode */}
      {!isFullscreen && (
        <header className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-black text-lg text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs">S</span>
              <span>SeoSeite</span>
            </Link>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
              Project Presentation Deck
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Ayush Chandramola • Final Year BCA Capstone</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVivaModal(true)}
              className="px-3 py-1.5 rounded-lg border border-purple-800/80 bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Viva Cheat Sheet</span>
            </button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showNotes
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Speaker Script</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={toggleFullScreen}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Enter Fullscreen (F)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>[F]</span>
            </button>
          </div>
        </header>
      )}

      {/* Fullscreen Floating Controls (Auto-fades, reveals on hover) */}
      {isFullscreen && (
        <div className="absolute top-4 right-6 z-40 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-xl transition-all cursor-pointer ${
              showNotes
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showNotes ? "Hide Script" : "Speaker Script"}</span>
          </button>
          <button
            onClick={() => setShowVivaModal(true)}
            className="px-3 py-1.5 rounded-full bg-purple-950/90 hover:bg-purple-900 border border-purple-700 text-xs font-semibold text-purple-200 flex items-center gap-1.5 backdrop-blur-md shadow-xl transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Viva Guide</span>
          </button>
          <button
            onClick={toggleFullScreen}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 backdrop-blur-md shadow-xl transition-all cursor-pointer"
            title="Exit Fullscreen (Esc or F)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Exit [Esc]</span>
          </button>
        </div>
      )}

      {/* Slide Viewport */}
      <main className={`flex-1 flex flex-col justify-center px-4 sm:px-12 ${isFullscreen ? "py-2 max-w-7xl" : "py-6 max-w-6xl"} mx-auto w-full transition-all`}>
        <div className={`bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative flex flex-col justify-between ${isFullscreen ? "min-h-[78vh]" : "min-h-[560px]"}`}>
          {/* Top Tag & Title */}
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400 mb-2">
              {currentSlideData.tag}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
              {currentSlideData.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed mb-6">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* Slide Dynamic Content */}
          <div className="my-auto">{currentSlideData.content}</div>

          {/* Speaker Notes Overlay */}
          {showNotes && (
            <div className="mt-6 p-4 rounded-xl bg-blue-950/70 border border-blue-500/40 text-xs text-blue-100 flex items-start gap-2.5 animate-in fade-in duration-200">
              <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-300 uppercase tracking-wider text-[10px] block mb-1">
                  What to say to the evaluators:
                </strong>
                <p className="leading-relaxed">{currentSlideData.speakerNotes}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Controls Bar */}
      <footer className="border-t border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-mono text-xs font-bold text-slate-400">
          Slide <span className="text-white">{String(currentSlide + 1).padStart(2, "0")}</span> /{" "}
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>

        {/* Slide quick jump dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? "bg-blue-500 w-6" : "bg-slate-700 hover:bg-slate-500"
              }`}
              title={`Jump to Slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullScreen}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "Enter Fullscreen (F)"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-blue-400" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? "Exit [F]" : "Fullscreen [F]"}</span>
          </button>
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Viva Voce Defense Cheat Sheet Modal */}
      {showVivaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-700 flex items-center justify-center text-purple-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Viva Voce Defense Guide</h3>
                  <p className="text-xs text-slate-400">Top 5 questions evaluators ask &amp; how to answer</p>
                </div>
              </div>
              <button
                onClick={() => setShowVivaModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {vivaQuestions.map((v, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <h4 className="text-xs font-bold text-blue-400">{v.q}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{v.a}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowVivaModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close &amp; Resume Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
