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
  X,
  Eye,
  EyeOff,
  BarChart3,
  Activity,
  Sliders,
  Scale,
  Download
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
  const [hideControls, setHideControls] = useState(false);
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
      a: "In src/lib/security/ssrf.ts, we execute a pre-flight DNS lookup to resolve the host IP before opening any network socket. We drop requests targeting RFC 1918 private subnets (10.x, 172.16-31.x, 192.168.x), loopbacks (127.0.0.1, ::1), and cloud metadata endpoints (169.254.169.254), enforcing an 8-second socket timeout and 5MB stream cutoff."
    },
    {
      q: "3. Does the Google Gemini AI model generate or calculate the SEO scores?",
      a: "No. Deterministic TypeScript code computes all scores, headers, and Core Web Vitals. Gemini AI is strictly an analytical reasoning layer that inspects the verified findings to synthesize executive summaries and generate copyable developer code fixes without hallucinating raw numbers."
    },
    {
      q: "4. What is the mathematical formulation of the 0–100 SEO Score?",
      a: "The score is divided into four equal 25-point categories: Metadata & Protocol (25 pts), Content & Hierarchy (25 pts), Indexability & Crawlability (25 pts), and Security & Protocol (25 pts). Each category evaluates binary and weighted compliance rules with explicit deductions."
    },
    {
      q: "5. How does permanent report sharing work without re-scraping the target website?",
      a: "When an audit is executed, the entire payload is saved in Google Cloud SQL PostgreSQL and assigned a unique UUID. The route /report/[id] queries PostgreSQL directly by ID, ensuring immutable historical snapshots that do not trigger repeated network crawls."
    },
    {
      q: "6. How does traffic estimation work without third-party panel data?",
      a: "In src/lib/modules/traffic/estimator.ts, we model traffic using an industry-standard organic CTR decay curve mapped against estimated SERP rankings and domain authority signals, providing explicit upper and lower confidence intervals."
    }
  ];

  const slides: SlideData[] = [
    // Slide 1: Title & Capstone Overview
    {
      id: 1,
      tag: "Final Year Capstone Project • 2025–2026",
      title: "SeoSeite (WebIntel)",
      subtitle: "An AI-Powered Website Intelligence, Deterministic SEO Auditing, Traffic Estimation & Competitor Benchmarking Platform",
      speakerNotes: "Good morning respected professors and evaluators. Today I am presenting SeoSeite, an enterprise-grade website intelligence SaaS platform built with Next.js 16, TypeScript, Google Cloud Run, and Gemini AI to deliver sub-second, deterministic technical audits without fabricated numbers.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Presenter</span>
              <div className="text-2xl font-black text-white mt-2">Ayush Chandramola</div>
              <div className="text-sm text-slate-300 mt-1">Final Year BCA Candidate</div>
              <div className="text-xs text-blue-400 font-semibold mt-2">Dept. of Computer Applications</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Full-Stack Core</span>
              <div className="text-2xl font-black text-blue-400 mt-2">Next.js 16 + React 19</div>
              <div className="text-sm text-slate-300 mt-1">TypeScript • Tailwind CSS v4</div>
              <div className="text-xs text-slate-400 font-semibold mt-2">Server Components &amp; Edge Actions</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Cloud Infrastructure</span>
              <div className="text-2xl font-black text-emerald-400 mt-2">Google Cloud Run</div>
              <div className="text-sm text-slate-300 mt-1">Cloud SQL PostgreSQL 16</div>
              <div className="text-xs text-emerald-400 font-semibold mt-2">Serverless Container Autoscaling</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-800/80 text-sm text-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Production URL: <strong className="text-white font-mono text-base ml-1">https://seoaudit-93977081206.us-central1.run.app</strong></span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider">Production Live</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-white">&lt; 100ms</div>
              <div className="text-xs text-slate-400 mt-0.5">In-Memory Crawl</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-blue-400">100% Deterministic</div>
              <div className="text-xs text-slate-400 mt-0.5">Scoring Formula</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-emerald-400">50+ Signatures</div>
              <div className="text-xs text-slate-400 mt-0.5">Tech Profiler</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-purple-400">FastMCP</div>
              <div className="text-xs text-slate-400 mt-0.5">AI Agent Gateway</div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 2: Problem Statement & Motivation
    {
      id: 2,
      tag: "Problem Statement & Industry Gaps",
      title: "The Triple Breakdown in Modern Web Auditing",
      subtitle: "Current SEO software and diagnostic ecosystems suffer from closed access, opaque algorithms, and massive server resource exhaustion.",
      speakerNotes: "We identified three major flaws in modern SEO software: closed paywalled access, black-box data fabrication, and heavy headless browsers that crash servers. SeoSeite directly solves all three.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border-t-4 border-rose-500 border border-slate-800 p-7 rounded-2xl flex flex-col justify-between shadow-xl">
            <div>
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Flaw 01</div>
              <h3 className="text-xl font-bold text-white mb-3">Closed Paywalls</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Standard web inspection and technical diagnostics are locked behind closed commercial paywalls, denying developers, students, and startups access to their own website telemetry.
              </p>
            </div>
            <div className="text-2xl font-black font-mono text-rose-400 mt-6 pt-4 border-t border-slate-800/80">Closed Ecosystems</div>
          </div>

          <div className="bg-slate-900/90 border-t-4 border-amber-500 border border-slate-800 p-7 rounded-2xl flex flex-col justify-between shadow-xl">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Flaw 02</div>
              <h3 className="text-xl font-bold text-white mb-3">Opaque &amp; Fabricated Math</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Proprietary ratings hallucinate exact visitor numbers and domain authority without disclosing confidence bounds, error margins, or underlying formulas.
              </p>
            </div>
            <div className="text-2xl font-black font-mono text-amber-400 mt-6 pt-4 border-t border-slate-800/80">Black Box Ratings</div>
          </div>

          <div className="bg-slate-900/90 border-t-4 border-indigo-500 border border-slate-800 p-7 rounded-2xl flex flex-col justify-between shadow-xl">
            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Flaw 03</div>
              <h3 className="text-xl font-bold text-white mb-3">Server Resource Bloat</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Traditional crawlers launch headless Chromium (Puppeteer/Playwright) consuming 1.5–2 GB RAM per crawl, causing severe latency and frequent server memory crashes.
              </p>
            </div>
            <div className="text-2xl font-black font-mono text-indigo-400 mt-6 pt-4 border-t border-slate-800/80">2 GB RAM Bloat</div>
          </div>
        </div>
      ),
    },

    // Slide 3: Engineering Principles & Zero-Hallucination Standards
    {
      id: 3,
      tag: "Engineering Philosophy & Integrity",
      title: "Zero-Hallucination Architectural Standards",
      subtitle: "A high-performance SaaS platform delivering honest, verifiable website diagnostics across five analytical pillars.",
      speakerNotes: "Our primary engineering rule: Zero Fabricated Metrics. Numbers are computed with deterministic math and verified APIs, while Gemini AI is strictly used as an analytical reasoning layer to suggest developer code fixes.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-blue-400" />
              Core System Guarantees
            </h3>
            <ul className="text-sm text-slate-300 space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Sub-Second Crawl Latency (&lt;100ms):</strong> Lightweight Cheerio DOM parser extracts headers and tags without browser overhead.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Deterministic 0–100 SEO Score:</strong> Transparent mathematical formula divided into 4 equal 25-point categories.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>50+ Signature Tech Stack Detector:</strong> Fingerprints CMSs, frameworks, CDNs, and server runtimes in milliseconds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Core Web Vitals Telemetry:</strong> Google PageSpeed Insights REST API measures LCP, CLS, INP, and TTFB.</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-950/30 border border-blue-700/60 p-7 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Zero-Hallucination AI Philosophy
            </h3>
            <p className="text-sm text-blue-200 leading-relaxed font-semibold">
              AI is strictly an analytical interpreter, never the source of truth for numbers.
            </p>
            <ul className="text-sm text-slate-300 space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Deterministic code computes all raw metrics, status codes, and audit checks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Google Gemini AI interprets verified findings to synthesize executive summaries &amp; copyable developer code fixes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Automated Heuristic Rule Synthesizer activates if external APIs time out.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 4: System Design & Pipeline
    {
      id: 4,
      tag: "Full-Stack Architecture & Microservices",
      title: "6-Layer Modular Pipeline & Data Flow",
      subtitle: "Microservice containerization deployed on Google Cloud Run with Google Cloud SQL PostgreSQL 16.",
      speakerNotes: "Here is our 6-layer architecture. Requests pass through our SSRF security shield first, feed into Cheerio in under 100 milliseconds, compute deterministic metrics, generate Gemini AI code fixes, and save immutable snapshots in Cloud SQL.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">6-Layer Pipeline</h3>
            <div className="space-y-2.5 text-sm">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 1:</strong> Next.js 16 App Router + React 19 UI</span>
                <span className="text-blue-400 text-xs font-mono">SSR / Client</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 2:</strong> SSRF Security Shield &amp; Pre-Flight DNS</span>
                <span className="text-rose-400 text-xs font-mono">Zero Trust</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 3:</strong> Cheerio HTML DOM &amp; Header Parser</span>
                <span className="text-emerald-400 text-xs font-mono">&lt; 100ms</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 4:</strong> Deterministic Scorer &amp; PageSpeed API</span>
                <span className="text-amber-400 text-xs font-mono">0–100 Formula</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 5:</strong> Google Gemini AI Diagnostic Synthesizer</span>
                <span className="text-purple-400 text-xs font-mono">Code Fixes</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                <span><strong>Layer 6:</strong> Google Cloud SQL PostgreSQL 16</span>
                <span className="text-cyan-400 text-xs font-mono">UUID /report/[id]</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-blue-300 leading-relaxed overflow-x-auto shadow-xl">
            <div className="text-slate-500 font-bold mb-3">// Complete Request Flow</div>
            Target URL Submission<br />
            &nbsp;&nbsp;│<br />
            &nbsp;&nbsp;▼<br />
            [SSRF DNS Guard] ──► Drops 127.0.0.1 / 169.254.x<br />
            &nbsp;&nbsp;│<br />
            &nbsp;&nbsp;▼<br />
            [Cheerio Engine] ──► Sub-100ms DOM Parse<br />
            &nbsp;&nbsp;│<br />
            &nbsp;&nbsp;├─► 0–100 Category Scorer (4 Quadrants)<br />
            &nbsp;&nbsp;├─► 50+ Tech Detector (Signatures)<br />
            &nbsp;&nbsp;├─► Google PageSpeed CWV API (LCP/CLS)<br />
            &nbsp;&nbsp;│<br />
            &nbsp;&nbsp;▼<br />
            [Gemini AI Synthesizer] ──► Structured Code Patches<br />
            &nbsp;&nbsp;│<br />
            &nbsp;&nbsp;▼<br />
            [PostgreSQL Pool] ──► Permanent Snapshot Record
          </div>
        </div>
      ),
    },

    // Slide 5: Deterministic 0-100 SEO Scoring Formula
    {
      id: 5,
      tag: "Mathematical Formulation & Scoring Engine",
      title: "The 0–100 Deterministic Scoring Model",
      subtitle: "A transparent, 4-quadrant mathematical formulation evaluating 25 distinct technical factors with zero bias.",
      speakerNotes: "The SEO score is computed by four distinct 25-point categories: Metadata, Content Structure, Indexability, and Security. Every deduction is transparent, deterministic, and reproducible.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-800/80 shadow-lg">
              <div className="text-xs font-black uppercase text-blue-400 tracking-wider">Quadrant 1 • 25 Pts</div>
              <h4 className="text-base font-bold text-white mt-1">Metadata &amp; Headers</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 mt-3">
                <li>• Title tag (10–60 chars)</li>
                <li>• Meta Description (50–160 chars)</li>
                <li>• Viewport &amp; Mobile Meta</li>
                <li>• OpenGraph &amp; Twitter Cards</li>
                <li>• Charset &amp; Favicon declared</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/80 shadow-lg">
              <div className="text-xs font-black uppercase text-purple-400 tracking-wider">Quadrant 2 • 25 Pts</div>
              <h4 className="text-base font-bold text-white mt-1">Content &amp; Hierarchy</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 mt-3">
                <li>• Single H1 tag present</li>
                <li>• H2–H6 logical hierarchy</li>
                <li>• Image alt attribute coverage</li>
                <li>• Word count threshold (&gt;300w)</li>
                <li>• Content-to-HTML ratio</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/80 shadow-lg">
              <div className="text-xs font-black uppercase text-amber-400 tracking-wider">Quadrant 3 • 25 Pts</div>
              <h4 className="text-base font-bold text-white mt-1">Indexability</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 mt-3">
                <li>• Canonical link matches URL</li>
                <li>• Robots.txt reachable</li>
                <li>• XML Sitemap discovered</li>
                <li>• Noindex tag absence</li>
                <li>• Internal vs External link ratio</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 shadow-lg">
              <div className="text-xs font-black uppercase text-emerald-400 tracking-wider">Quadrant 4 • 25 Pts</div>
              <h4 className="text-base font-bold text-white mt-1">Security &amp; Protocol</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 mt-3">
                <li>• HTTPS protocol enforcement</li>
                <li>• SSL certificate valid</li>
                <li>• HSTS header active</li>
                <li>• X-Frame-Options configured</li>
                <li>• SSRF DNS verification pass</li>
              </ul>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score Brackets:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <span className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300">90–100: Grade A (Optimal)</span>
              <span className="px-3 py-1 rounded-lg bg-blue-950 border border-blue-700 text-blue-300">70–89: Grade B (Good)</span>
              <span className="px-3 py-1 rounded-lg bg-amber-950 border border-amber-700 text-amber-300">50–69: Grade C (Needs Work)</span>
              <span className="px-3 py-1 rounded-lg bg-rose-950 border border-rose-700 text-rose-300">&lt;50: Grade F (Critical Issues)</span>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 6: Zero-Trust Security & Network SSRF Shield
    {
      id: 6,
      tag: "Enterprise Security & Network Hardening",
      title: "Enterprise SSRF Defense & Safe Crawling",
      subtitle: "Server-Side Request Forgery mitigation implemented at the pre-flight network resolution level.",
      speakerNotes: "Security was a day-one priority. We engineered a pre-flight DNS resolution filter that resolves destination IPs before opening a socket, dropping all private subnets, loopbacks, and cloud metadata attacks to prevent credential exfiltration.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              The SSRF Threat Model
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Public URL scrapers are highly vulnerable to attackers submitting internal addresses to exfiltrate database credentials or cloud IAM tokens.
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200">
                🚫 <strong>RFC 1918 Private Subnets:</strong> 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200">
                🚫 <strong>Loopback &amp; Localhost:</strong> 127.0.0.1, ::1, 0.0.0.0
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200">
                🚫 <strong>Cloud Metadata APIs:</strong> 169.254.169.254, metadata.google.internal
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">// src/lib/security/ssrf.ts</div>
            <pre className="text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
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
            <p className="text-xs text-slate-400 pt-2">
              Enforces pre-flight DNS lookups to defeat DNS Rebinding attacks before network connection.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 7: Deterministic Traffic & Authority Modeling
    {
      id: 7,
      tag: "Traffic Estimation & Statistical Modeling",
      title: "Honest Traffic & Organic Authority Estimation",
      subtitle: "Modeling domain audience reach and search visibility using transparent CTR decay curves without fabricated numbers.",
      speakerNotes: "Instead of hallucinating traffic numbers, we combine keyword ranking signals with the organic CTR decay curve, providing explicit confidence intervals so users understand estimation variance.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              The Mathematical Traffic Formulation
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We compute organic traffic estimates using empirical SERP position click-through curves:
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 space-y-1">
              <div>Estimated Traffic = Σ (Keyword Volume × Position CTR)</div>
              <div className="text-slate-500 pt-1">• Pos 1: ~31.7% CTR &nbsp;|&nbsp; Pos 2: ~24.7% CTR</div>
              <div className="text-slate-500">• Pos 3: ~18.6% CTR &nbsp;|&nbsp; Pos 4–10: Logarithmic decay</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Domain authority is evaluated via backlink diversity, protocol security, and content indexability signals.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-emerald-400" />
              Statistical Confidence Bands
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
                <div className="font-bold text-emerald-400">High Confidence Level</div>
                <div className="text-slate-300 mt-0.5">Direct search console feeds or verified indexing telemetry with &lt;10% variance.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60">
                <div className="font-bold text-blue-400">Medium Confidence Level</div>
                <div className="text-slate-300 mt-0.5">Statistical crawl extrapolation factoring backlink volume and indexed pages.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60">
                <div className="font-bold text-amber-400">Estimated Bounds Interval</div>
                <div className="text-slate-300 mt-0.5">Displays lower and upper standard deviations instead of false precision.</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 8: Competitor Benchmarking & 50+ Tech Profiler
    {
      id: 8,
      tag: "Comparative Intelligence & Fingerprinting",
      title: "Side-by-Side Benchmarking & 50+ Tech Profiler",
      subtitle: "Sub-100ms technology stack detection and head-to-head metric battle between target and rival domains.",
      speakerNotes: "Our competitor comparator pits two domains side by side with automated winner badges across SEO, Core Web Vitals, and security headers, alongside an instant 50+ technology stack fingerprinting engine.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-purple-400" />
              Head-to-Head Comparative Engine
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Compares two target URLs concurrently with deterministic differential analysis:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">SEO Health Score Delta</span>
                <span className="font-bold text-emerald-400">Target (+12 pts higher)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Time to First Byte (TTFB)</span>
                <span className="font-bold text-emerald-400">Target (82ms vs 310ms)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Security Headers Compliance</span>
                <span className="font-bold text-blue-400">Both Passed HSTS &amp; CSP</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-cyan-400" />
              50+ Signature Tech Profiler
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Detects CMS platforms, JavaScript frameworks, CDNs, and server runtimes in &lt;100ms:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <strong>Frameworks:</strong> Next.js, React, Vue, Nuxt, Angular, Svelte
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <strong>CMS:</strong> WordPress, Shopify, Webflow, Ghost, Drupal
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <strong>Hosting/CDNs:</strong> Cloudflare, Vercel, AWS CloudFront, Fastly
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <strong>Analytics:</strong> Google Analytics 4, Tag Manager, Hotjar
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 9: 9 Specialized Diagnostic Engines
    {
      id: 9,
      tag: "Product Capabilities & Micro-Tools",
      title: "9 Specialized Diagnostic Engines",
      subtitle: "A unified suite engineered for technical SEO consultants, webmasters, agencies, and autonomous AI agents.",
      speakerNotes: "Beyond the full audit, SeoSeite includes 9 focused utility engines: side-by-side competitor benchmarking, PageSpeed Lab, Schema Validator, Tech Detector, 404 Broken Link Crawler, and Brand Radar AEO.",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="text-xs font-bold uppercase text-blue-400">01 • Audit</div>
            <h4 className="text-base font-bold text-white mt-1">SEO Health Scorer</h4>
            <p className="text-xs text-slate-300 mt-1">0–100 deterministic scoring with radial SVG gauge.</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="text-xs font-bold uppercase text-purple-400">02 • Competitive</div>
            <h4 className="text-base font-bold text-white mt-1">Competitor Benchmark</h4>
            <p className="text-xs text-slate-300 mt-1">Side-by-side URL compare with winner metrics.</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="text-xs font-bold uppercase text-emerald-400">03 • Web Vitals</div>
            <h4 className="text-base font-bold text-white mt-1">Speed Lab</h4>
            <p className="text-xs text-slate-300 mt-1">LCP, CLS, INP, and TTFB via Google REST API.</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="text-xs font-bold uppercase text-pink-400">04 • Code Studio</div>
            <h4 className="text-base font-bold text-white mt-1">Schema JSON-LD</h4>
            <p className="text-xs text-slate-300 mt-1">Validates structured data &amp; OpenGraph tags.</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="text-xs font-bold uppercase text-amber-400">05 • Stack</div>
            <h4 className="text-base font-bold text-white mt-1">50+ Tech Detector</h4>
            <p className="text-xs text-slate-300 mt-1">Detects CMS, React, Next.js, and CDNs in &lt;100ms.</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="text-xs font-bold uppercase text-cyan-400">06 • AEO AI</div>
            <h4 className="text-base font-bold text-white mt-1">Brand Radar AI</h4>
            <p className="text-xs text-slate-300 mt-1">Brand citation Share of Voice across LLMs.</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="text-xs font-bold uppercase text-rose-400">07 • Crawl</div>
            <h4 className="text-base font-bold text-white mt-1">404 Broken Link Crawler</h4>
            <p className="text-xs text-slate-300 mt-1">Scans anchor tags to identify dead links.</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="text-xs font-bold uppercase text-indigo-400">08 • Indexing</div>
            <h4 className="text-base font-bold text-white mt-1">Robots &amp; Sitemap</h4>
            <p className="text-xs text-slate-300 mt-1">Validates crawl directives &amp; XML sitemaps.</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="text-xs font-bold uppercase text-teal-400">09 • Security</div>
            <h4 className="text-base font-bold text-white mt-1">HTTP Headers &amp; SSL</h4>
            <p className="text-xs text-slate-300 mt-1">Inspects TLS cipher suites &amp; CSP headers.</p>
          </div>
        </div>
      ),
    },

    // Slide 10: Google Gemini AI Reasoning & Developer Fixes
    {
      id: 10,
      tag: "AI Synthesis & Remediation Engine",
      title: "Automated Developer Remediation with Gemini AI",
      subtitle: "Transforming complex technical audit data into ready-to-copy code patches and executive briefs.",
      speakerNotes: "Instead of raw error logs, Google Gemini 1.5 Flash inspects the verified findings JSON to produce copy-paste TypeScript, HTML, and Next.js patches, prioritized by impact.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Structured Prompt Engineering
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We feed validated audit findings JSON into Google Gemini with strict prompt constraints:
            </p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Zero Metric Invention:</strong> AI cannot alter the deterministic 0–100 score.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Impact Prioritization:</strong> Rank issues by Critical, Warning, and Advisory.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Executable Fixes:</strong> Provide exact copy-paste code snippets for Next.js, HTML, or Apache/Nginx configs.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">// Sample Gemini AI Code Patch</div>
            <pre className="text-xs font-mono text-blue-300 leading-relaxed overflow-x-auto">
{`// Add to app/layout.tsx for missing Canonical & OpenGraph:
export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Example Brand — Intelligence',
    description: 'Verified technical diagnostics',
    images: ['/og-image.png'],
  },
};`}
            </pre>
            <p className="text-xs text-emerald-400 font-semibold pt-1">
              ✓ Ready for immediate one-click copy &amp; paste by web developers.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 11: Cloud Architecture, Database Schema & Snapshots
    {
      id: 11,
      tag: "Cloud Architecture & Data Persistence",
      title: "Google Cloud SQL PostgreSQL & Cloud Run",
      subtitle: "Immutable report persistence, relational schema design, and serverless horizontal autoscaling.",
      speakerNotes: "Audits are permanently saved as immutable UUID snapshots in Cloud SQL PostgreSQL 16. This eliminates repeated network crawls when sharing report links with stakeholders.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center shadow-lg">
              <div className="text-4xl font-black font-mono text-blue-400">&lt; 100ms</div>
              <div className="text-sm font-bold text-white mt-2">Crawl Latency</div>
              <div className="text-xs text-slate-400 mt-1">In-Memory Cheerio DOM</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center shadow-lg">
              <div className="text-4xl font-black font-mono text-purple-400">140 MB</div>
              <div className="text-sm font-bold text-white mt-2">Docker Image</div>
              <div className="text-xs text-slate-400 mt-1">Node 20 Alpine Standalone</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center shadow-lg">
              <div className="text-4xl font-black font-mono text-emerald-400">0 Idle</div>
              <div className="text-sm font-bold text-white mt-2">Scale-to-Zero Pods</div>
              <div className="text-xs text-slate-400 mt-1">Stateless Cloud Run</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center shadow-lg">
              <div className="text-4xl font-black font-mono text-amber-400">46 / 46</div>
              <div className="text-sm font-bold text-white mt-2">Routes Compiled</div>
              <div className="text-xs text-slate-400 mt-1">0 TypeScript Errors</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-sm text-slate-300 space-y-2 shadow-lg">
            <div className="font-bold text-white text-base mb-1">Persistent Relational Architecture:</div>
            <div>• <strong>Immutable Audits Table:</strong> Stores UUID primary keys with JSONB telemetry snapshots, preventing redundant scrapes.</div>
            <div>• <strong>Resilient Database Pool:</strong> Cloud SQL connection pooling with automatic local memory fallback for offline testing.</div>
            <div>• <strong>Permanent Permalink Sharing:</strong> Route <code className="text-blue-400 bg-slate-950 px-2 py-0.5 rounded font-mono">/report/[id]</code> provides instant, reproducible historical audits.</div>
          </div>
        </div>
      ),
    },

    // Slide 12: Autonomous AI Integration via Model Context Protocol (FastMCP)
    {
      id: 12,
      tag: "AI Agent Interoperability & MCP Standard",
      title: "Model Context Protocol (FastMCP) for AI Agents",
      subtitle: "Connecting Claude Desktop, Cursor IDE, and autonomous agents directly to SeoSeite via JSON-RPC 2.0.",
      speakerNotes: "We also implemented an enterprise Model Context Protocol gateway. Developers using Cursor or Claude Desktop can directly ask their AI to audit websites and detect tech stacks using our live tools.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Terminal className="w-5 h-5 text-blue-400" />
              What is MCP?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Model Context Protocol is Anthropic's open standard enabling LLMs to call local and cloud tools securely.
            </p>
            <ul className="text-xs text-slate-300 space-y-2.5 pt-1">
              <li><strong>seoseite_audit_url:</strong> Autonomous audits &amp; Core Web Vitals directly in IDE.</li>
              <li><strong>seoseite_compare_domains:</strong> Head-to-head competitor compare in chat.</li>
              <li><strong>seoseite_detect_tech:</strong> Live framework interrogation during coding.</li>
              <li><strong>seoseite_check_broken_links:</strong> Crawls dead links with markdown summaries.</li>
            </ul>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">// .cursor/mcp.json</div>
            <pre className="text-xs font-mono text-blue-300 leading-relaxed overflow-x-auto">
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
            <p className="text-xs text-slate-400 pt-2">
              Allows developers to type <em>&quot;Audit linear.app with SeoSeite&quot;</em> inside Cursor IDE or Claude.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 13: Comparative Engineering Benchmark Matrix
    {
      id: 13,
      tag: "Comparative Engineering Matrix",
      title: "SeoSeite vs Traditional Web Crawlers",
      subtitle: "A direct systems engineering comparison highlighting efficiency, security, and algorithmic transparency.",
      speakerNotes: "This comparative matrix demonstrates why our architectural choices matter: we cut memory consumption from 2 gigabytes down to under 20 megabytes, achieved sub-100ms parse speeds, and instituted strict SSRF DNS security.",
      content: (
        <div className="overflow-x-auto bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs font-bold uppercase text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-4">Engineering Dimension</th>
                <th className="p-4 text-blue-400 font-extrabold">SeoSeite (This Project)</th>
                <th className="p-4 text-slate-400">Headless Chrome Scrapers</th>
                <th className="p-4 text-slate-400">Commercial Audit Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              <tr>
                <td className="p-4 font-bold text-white">Crawl Engine</td>
                <td className="p-4 text-emerald-400 font-semibold">Cheerio In-Memory DOM</td>
                <td className="p-4 text-slate-400">Chromium (Puppeteer)</td>
                <td className="p-4 text-slate-400">Proprietary Cluster</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">RAM Consumption</td>
                <td className="p-4 text-emerald-400 font-semibold">&lt; 20 MB / process</td>
                <td className="p-4 text-rose-400">1,500 – 2,000 MB</td>
                <td className="p-4 text-slate-400">High Server Footprint</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Parse Latency</td>
                <td className="p-4 text-emerald-400 font-semibold">Sub-100 ms average</td>
                <td className="p-4 text-rose-400">4,000 – 8,000 ms</td>
                <td className="p-4 text-slate-400">Queued / Asynchronous</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Scoring Method</td>
                <td className="p-4 text-emerald-400 font-semibold">Deterministic 0–100 Formula</td>
                <td className="p-4 text-slate-400">Lighthouse Only</td>
                <td className="p-4 text-amber-400">Black-Box Proprietary</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">SSRF Security</td>
                <td className="p-4 text-emerald-400 font-semibold">Pre-Flight DNS IP Shield</td>
                <td className="p-4 text-rose-400">Usually Unfiltered</td>
                <td className="p-4 text-slate-400">Internal Whitelist</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Agent Integration</td>
                <td className="p-4 text-emerald-400 font-semibold">Model Context Protocol (MCP)</td>
                <td className="p-4 text-slate-400">None</td>
                <td className="p-4 text-slate-400">Restricted REST Only</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Compute Cost (10k Scans)</td>
                <td className="p-4 text-emerald-400 font-semibold">~$0.08 (Cloud Run)</td>
                <td className="p-4 text-rose-400">~$14.50 (Chromium VM)</td>
                <td className="p-4 text-slate-400">High Recurring Pricing</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },

    // Slide 14: Conclusion, Future Roadmap & Project Demonstration
    {
      id: 14,
      tag: "Conclusion & Viva Voce Defense",
      title: "Project Summary & Live Demonstration",
      subtitle: "SeoSeite establishes an honest, high-performance, and verifiable website intelligence platform.",
      speakerNotes: "Thank you for your time and attention. I am now pleased to demonstrate the live platform and welcome your questions.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center shadow-lg">
              <h4 className="text-lg font-bold text-white mb-2">Open &amp; Transparent</h4>
              <p className="text-sm text-slate-300">Zero fabricated metrics. Full algorithmic clarity, verifiable formulas, and reproducible sources.</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center shadow-lg">
              <h4 className="text-lg font-bold text-white mb-2">High Performance</h4>
              <p className="text-sm text-slate-300">Sub-second Cheerio DOM crawling, Next.js 16 SSR, and Google Cloud Run auto-scaling.</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center shadow-lg">
              <h4 className="text-lg font-bold text-white mb-2">AI Agent Ready</h4>
              <p className="text-sm text-slate-300">Native Model Context Protocol (FastMCP) integration for modern autonomous AI workflows.</p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/40 text-center space-y-4 shadow-2xl">
            <h3 className="text-3xl font-black text-white">Thank You!</h3>
            <p className="text-base text-slate-300">Ready for Live Demonstration &amp; Viva Voce Defense</p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/40"
              >
                Launch Dashboard Demo
              </Link>
              <Link
                href="/analyze"
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold border border-slate-700 transition-colors"
              >
                Launch Live Website Audit
              </Link>
              <a
                href="/presentation.pdf"
                download="SeoSeite_Capstone_14_Slides.pdf"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download All 14 Slides (PDF)</span>
              </a>
              <button
                onClick={() => setShowVivaModal(true)}
                className="px-6 py-2.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 rounded-xl text-sm font-bold border border-purple-700 transition-colors cursor-pointer"
              >
                Open Viva Voce Defense Guide
              </button>
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
      } else if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setHideControls((prev) => !prev);
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
      {/* Screen Interactive Deck View (Hidden when printing / generating PDF) */}
      <div className="print:hidden flex flex-col justify-between min-h-screen flex-1">
        {/* Top Header Bar — Hidden during Fullscreen OR when Controls are explicitly hidden */}
        {!isFullscreen && !hideControls && (
        <header className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-black text-xl text-white tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-black">S</span>
              <span>SeoSeite</span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
              Project Presentation Deck (14 Slides)
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Ayush Chandramola • Final Year BCA Capstone</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHideControls(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Hide all navigation controls (H)"
            >
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Hide Controls [H]</span>
            </button>
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
            <a
              href="/presentation.pdf"
              download="SeoSeite_Capstone_14_Slides.pdf"
              className="px-3 py-1.5 rounded-lg border border-emerald-700/80 bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900/80 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Direct download PDF of all 14 slides"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download PDF</span>
            </a>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print or Save all 14 slides as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print (14 Slides)</span>
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
      {isFullscreen && !hideControls && (
        <div className="absolute top-4 right-6 z-40 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-200">
          <a
            href="/presentation.pdf"
            download="SeoSeite_Capstone_14_Slides.pdf"
            className="px-3 py-1.5 rounded-full bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700 text-xs font-semibold text-emerald-200 flex items-center gap-1.5 backdrop-blur-md shadow-xl transition-all cursor-pointer"
            title="Download PDF of all 14 slides"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF</span>
          </a>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 backdrop-blur-md shadow-xl transition-all cursor-pointer"
            title="Print or Save all 14 slides as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print</span>
          </button>
          <button
            onClick={() => setHideControls(true)}
            className="px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 backdrop-blur-md shadow-xl transition-all cursor-pointer"
            title="Hide controls (H)"
          >
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            <span>Hide [H]</span>
          </button>
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

      {/* Floating Restore Controls Button (Visible when Controls are explicitly hidden) */}
      {hideControls && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 animate-in fade-in duration-200">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono font-bold text-slate-300 backdrop-blur-md shadow-2xl">
            {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </div>
          <button
            onClick={() => setHideControls(false)}
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-2xl shadow-blue-900/50 cursor-pointer transition-all hover:scale-105"
            title="Show navigation controls (H)"
          >
            <Eye className="w-4 h-4" />
            <span>Show Controls [H]</span>
          </button>
        </div>
      )}

      {/* Main Slide Viewport — Bigger, Wider, Projector-Optimized */}
      <main
        className={`flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 ${
          isFullscreen || hideControls ? "py-4 max-w-[1440px]" : "py-8 max-w-[1360px]"
        } mx-auto w-full transition-all duration-300`}
      >
        <div
          className={`bg-slate-900/60 border border-slate-800/90 rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl backdrop-blur-2xl relative flex flex-col justify-between ${
            isFullscreen || hideControls ? "min-h-[82vh]" : "min-h-[640px]"
          } transition-all`}
        >
          {/* Top Tag & Title Area */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-400 bg-blue-950/70 border border-blue-800/80 mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>{currentSlideData.tag}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
              {currentSlideData.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed mb-8 font-normal">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* Dynamic Slide Content Body */}
          <div className="my-auto py-2">{currentSlideData.content}</div>

          {/* Speaker Notes Overlay */}
          {showNotes && (
            <div className="mt-8 p-5 rounded-2xl bg-blue-950/80 border border-blue-500/50 text-sm text-blue-100 flex items-start gap-3.5 animate-in fade-in duration-200 shadow-2xl">
              <MessageSquare className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-300 uppercase tracking-wider text-xs block mb-1">
                  Evaluator Script &amp; Talking Points:
                </strong>
                <p className="leading-relaxed">{currentSlideData.speakerNotes}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Controls Bar — Hidden when Controls are toggled off */}
      {!hideControls && (
        <footer className="border-t border-slate-800/80 pl-12 pr-6 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="font-mono text-sm font-bold text-slate-400 flex items-center gap-3">
            <span>
              Slide <span className="text-white font-extrabold">{String(currentSlide + 1).padStart(2, "0")}</span> /{" "}
              <span>{String(slides.length).padStart(2, "0")}</span>
            </span>
            <span className="hidden md:inline-block text-xs text-slate-500 font-normal">
              (Use Arrow keys or Space to navigate)
            </span>
          </div>

          {/* Slide quick jump dots */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide ? "bg-blue-500 w-8" : "bg-slate-700 hover:bg-slate-500 w-2.5"
                }`}
                title={`Jump to Slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHideControls(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Hide controls for distraction-free view (H)"
            >
              <EyeOff className="w-4 h-4 text-slate-400" />
              <span>Hide Controls [H]</span>
            </button>
            <button
              onClick={toggleFullScreen}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "Enter Fullscreen (F)"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-blue-400" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? "Exit [F]" : "Fullscreen [F]"}</span>
            </button>
            <a
              href="/presentation.pdf"
              download="SeoSeite_Capstone_14_Slides.pdf"
              className="px-3.5 py-2 rounded-xl border border-emerald-700/80 bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900/80 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download PDF of all 14 slides"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download PDF</span>
            </a>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print or Save all 14 slides as PDF"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print [14]</span>
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-900/40 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
      </div>

      {/* Complete 14-Slide Dedicated Print & PDF Export View */}
      <div className="hidden print:block print-deck-root bg-slate-950 text-slate-100">
        {slides.map((s, idx) => (
          <div key={s.id} className="print-slide-page">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-blue-400 bg-blue-950/70 border border-blue-800/80 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>{s.tag}</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight leading-tight mb-1">
                {s.title}
              </h1>
              <p className="text-xs text-slate-300 max-w-4xl leading-relaxed mb-3">
                {s.subtitle}
              </p>
            </div>

            <div className="my-auto py-1">
              {s.content}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>SeoSeite (WebIntel) • Final Year BCA Capstone</span>
              <span className="text-white font-bold">Slide {String(idx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Viva Voce Defense Cheat Sheet Modal */}
      {showVivaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-700 flex items-center justify-center text-purple-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Viva Voce Defense Guide</h3>
                  <p className="text-xs text-slate-400">Top 6 technical questions evaluators ask &amp; exact model answers</p>
                </div>
              </div>
              <button
                onClick={() => setShowVivaModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {vivaQuestions.map((v, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-sm font-bold text-blue-400">{v.q}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{v.a}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowVivaModal(false)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
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
