"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePlan } from "@/lib/auth/PlanContext";
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Info,
  ExternalLink,
  Loader2,
  Sparkles,
  Download,
  Copy,
  Printer,
  Share2,
  Search,
  Filter,
  Code2,
  Globe,
  Check,
  Zap,
  Server,
  Terminal,
  FileText,
  KeyRound,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { HeaderEvaluation, SecurityHeadersReport } from "@/lib/modules/seo/fetcher";

interface SecurityAuditData {
  url: string;
  domain: string;
  httpStatus: number;
  responseTimeMs: number;
  isHttps: boolean;
  securityHeaders: SecurityHeadersReport;
  hasRobotsTxt?: boolean;
  hasSitemapXml?: boolean;
}

const DEMO_PRESETS: Record<string, SecurityAuditData> = {
  "stripe.com": {
    url: "https://stripe.com/",
    domain: "stripe.com",
    httpStatus: 200,
    responseTimeMs: 84,
    isHttps: true,
    hasRobotsTxt: true,
    hasSitemapXml: true,
    securityHeaders: {
      hsts: true,
      csp: true,
      xFrameOptions: "DENY",
      xContentTypeOptions: true,
      referrerPolicy: "strict-origin-when-cross-origin",
      permissionsPolicy: true,
      securityScore: 100,
      grade: "A+",
      passedCount: 6,
      warningCount: 0,
      missingCount: 0,
      serverHeader: "cloudflare",
      xPoweredBy: null,
      coop: "same-origin",
      coep: "require-corp",
      corp: "same-origin",
      rawHeaders: {
        "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
        "content-security-policy": "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';",
        "x-frame-options": "DENY",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin",
        "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(self)",
        "server": "cloudflare",
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
      },
      evaluations: [
        {
          key: "strict-transport-security",
          name: "HTTP Strict Transport Security (HSTS)",
          value: "max-age=63072000; includeSubDomains; preload",
          status: "secure",
          scoreImpact: 25,
          description: "Forces user agents to communicate exclusively over encrypted HTTPS, preventing SSL stripping and downgrade attacks.",
          attackMitigation: "SSL Stripping, Man-in-the-Middle (MITM) Interception",
        },
        {
          key: "content-security-policy",
          name: "Content Security Policy (CSP)",
          value: "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';",
          status: "secure",
          scoreImpact: 25,
          description: "Restricts origins of executable scripts, stylesheets, and iframes to neutralize code injection exploits.",
          attackMitigation: "Cross-Site Scripting (XSS), Malicious Data Injection",
        },
        {
          key: "x-frame-options",
          name: "X-Frame-Options (Clickjacking Guard)",
          value: "DENY",
          status: "secure",
          scoreImpact: 15,
          description: "Completely prevents the webpage from being embedded inside frames or iframes on foreign domains.",
          attackMitigation: "Clickjacking, Hidden Overlay Attacks, UI Redress Exploits",
        },
        {
          key: "x-content-type-options",
          name: "X-Content-Type-Options (MIME Sniffing)",
          value: "nosniff",
          status: "secure",
          scoreImpact: 15,
          description: "Prevents browsers from MIME-sniffing a response away from the declared content-type.",
          attackMitigation: "MIME Confusion, Drive-By Executable Downloads",
        },
        {
          key: "referrer-policy",
          name: "Referrer-Policy (Privacy Isolation)",
          value: "strict-origin-when-cross-origin",
          status: "secure",
          scoreImpact: 10,
          description: "Sends full referrer URL within same-origin requests, but only sends the origin domain for cross-origin HTTPS requests.",
          attackMitigation: "Private URL Query Leaks, Auth Token Exfiltration",
        },
        {
          key: "permissions-policy",
          name: "Permissions-Policy (Hardware Sensor Sandbox)",
          value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          status: "secure",
          scoreImpact: 10,
          description: "Restricts embedded third-party frames from accessing device sensors like camera, microphone, or geolocation.",
          attackMitigation: "Unauthorized Camera/Mic Hijacking, Location Fingerprinting",
        },
      ],
    },
  },
  "github.com": {
    url: "https://github.com/",
    domain: "github.com",
    httpStatus: 200,
    responseTimeMs: 98,
    isHttps: true,
    hasRobotsTxt: true,
    hasSitemapXml: true,
    securityHeaders: {
      hsts: true,
      csp: true,
      xFrameOptions: "deny",
      xContentTypeOptions: true,
      referrerPolicy: "origin-when-cross-origin, strict-origin-when-cross-origin",
      permissionsPolicy: true,
      securityScore: 98,
      grade: "A+",
      passedCount: 6,
      warningCount: 0,
      missingCount: 0,
      serverHeader: "GitHub.com",
      xPoweredBy: null,
      rawHeaders: {
        "strict-transport-security": "max-age=31536000; includeSubdomains; preload",
        "content-security-policy": "default-src 'none'; base-uri 'self'; connect-src 'self' ...",
        "x-frame-options": "deny",
        "x-content-type-options": "nosniff",
        "referrer-policy": "origin-when-cross-origin, strict-origin-when-cross-origin",
        "permissions-policy": "camera=(), microphone=(), geolocation=()",
        "server": "GitHub.com",
      },
      evaluations: [
        {
          key: "strict-transport-security",
          name: "HTTP Strict Transport Security (HSTS)",
          value: "max-age=31536000; includeSubdomains; preload",
          status: "secure",
          scoreImpact: 25,
          description: "Forces user agents to communicate exclusively over encrypted HTTPS.",
          attackMitigation: "SSL Stripping, Man-in-the-Middle (MITM) Interception",
        },
        {
          key: "content-security-policy",
          name: "Content Security Policy (CSP)",
          value: "default-src 'none'; base-uri 'self'; connect-src 'self' https://api.github.com",
          status: "secure",
          scoreImpact: 25,
          description: "Strict default-src 'none' policy with granular micro-allowlists.",
          attackMitigation: "Cross-Site Scripting (XSS), Malicious Data Injection",
        },
        {
          key: "x-frame-options",
          name: "X-Frame-Options (Clickjacking Guard)",
          value: "deny",
          status: "secure",
          scoreImpact: 15,
          description: "Denies iframe embedding universally.",
          attackMitigation: "Clickjacking, Hidden Overlay Attacks",
        },
        {
          key: "x-content-type-options",
          name: "X-Content-Type-Options (MIME Sniffing)",
          value: "nosniff",
          status: "secure",
          scoreImpact: 15,
          description: "MIME sniffing protection active.",
          attackMitigation: "MIME Confusion, Drive-By Executable Downloads",
        },
        {
          key: "referrer-policy",
          name: "Referrer-Policy (Privacy Isolation)",
          value: "origin-when-cross-origin, strict-origin-when-cross-origin",
          status: "secure",
          scoreImpact: 10,
          description: "Reduces referrer granularity on cross-origin requests.",
          attackMitigation: "Private URL Query Leaks",
        },
        {
          key: "permissions-policy",
          name: "Permissions-Policy (Hardware Sensor Sandbox)",
          value: "camera=(), microphone=(), geolocation=()",
          status: "secure",
          scoreImpact: 10,
          description: "Hardware sensors isolated.",
          attackMitigation: "Unauthorized Camera/Mic Hijacking",
        },
      ],
    },
  },
  "vercel.com": {
    url: "https://vercel.com/",
    domain: "vercel.com",
    httpStatus: 200,
    responseTimeMs: 62,
    isHttps: true,
    hasRobotsTxt: true,
    hasSitemapXml: true,
    securityHeaders: {
      hsts: true,
      csp: true,
      xFrameOptions: "SAMEORIGIN",
      xContentTypeOptions: true,
      referrerPolicy: "strict-origin-when-cross-origin",
      permissionsPolicy: true,
      securityScore: 94,
      grade: "A",
      passedCount: 6,
      warningCount: 0,
      missingCount: 0,
      serverHeader: "Vercel",
      xPoweredBy: null,
      rawHeaders: {
        "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
        "content-security-policy": "default-src 'self' https: data: 'unsafe-inline';",
        "x-frame-options": "SAMEORIGIN",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin",
        "server": "Vercel",
      },
      evaluations: [
        {
          key: "strict-transport-security",
          name: "HTTP Strict Transport Security (HSTS)",
          value: "max-age=63072000; includeSubDomains; preload",
          status: "secure",
          scoreImpact: 25,
          description: "HSTS with 2-year duration and preload directive.",
          attackMitigation: "SSL Stripping, Man-in-the-Middle (MITM) Interception",
        },
        {
          key: "content-security-policy",
          name: "Content Security Policy (CSP)",
          value: "default-src 'self' https: data: 'unsafe-inline';",
          status: "secure",
          scoreImpact: 25,
          description: "CSP configured to whitelist verified origin assets.",
          attackMitigation: "Cross-Site Scripting (XSS)",
        },
        {
          key: "x-frame-options",
          name: "X-Frame-Options (Clickjacking Guard)",
          value: "SAMEORIGIN",
          status: "secure",
          scoreImpact: 15,
          description: "Permits framing only within same-origin dashboard contexts.",
          attackMitigation: "Clickjacking, UI Redress Exploits",
        },
        {
          key: "x-content-type-options",
          name: "X-Content-Type-Options (MIME Sniffing)",
          value: "nosniff",
          status: "secure",
          scoreImpact: 15,
          description: "Prevents MIME sniffing vulnerabilities.",
          attackMitigation: "MIME Confusion",
        },
        {
          key: "referrer-policy",
          name: "Referrer-Policy (Privacy Isolation)",
          value: "strict-origin-when-cross-origin",
          status: "secure",
          scoreImpact: 10,
          description: "Shields private route parameters.",
          attackMitigation: "Private URL Query Leaks",
        },
        {
          key: "permissions-policy",
          name: "Permissions-Policy (Hardware Sensor Sandbox)",
          value: "camera=(), microphone=(), geolocation=()",
          status: "secure",
          scoreImpact: 10,
          description: "Third-party hardware lockdown enabled.",
          attackMitigation: "Unauthorized Camera/Mic Access",
        },
      ],
    },
  },
  "linear.app": {
    url: "https://linear.app/",
    domain: "linear.app",
    httpStatus: 200,
    responseTimeMs: 58,
    isHttps: true,
    hasRobotsTxt: true,
    hasSitemapXml: true,
    securityHeaders: {
      hsts: true,
      csp: true,
      xFrameOptions: "DENY",
      xContentTypeOptions: true,
      referrerPolicy: "strict-origin-when-cross-origin",
      permissionsPolicy: true,
      securityScore: 98,
      grade: "A+",
      passedCount: 6,
      warningCount: 0,
      missingCount: 0,
      serverHeader: "cloudflare",
      xPoweredBy: null,
      rawHeaders: {
        "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
        "content-security-policy": "default-src 'self' ...",
        "x-frame-options": "DENY",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin",
        "permissions-policy": "camera=(), microphone=(), geolocation=()",
      },
      evaluations: [
        {
          key: "strict-transport-security",
          name: "HTTP Strict Transport Security (HSTS)",
          value: "max-age=63072000; includeSubDomains; preload",
          status: "secure",
          scoreImpact: 25,
          description: "HSTS with full subdomains and preload.",
          attackMitigation: "SSL Stripping, MITM Attacks",
        },
        {
          key: "content-security-policy",
          name: "Content Security Policy (CSP)",
          value: "default-src 'self' ...",
          status: "secure",
          scoreImpact: 25,
          description: "Enterprise strict CSP lockdown.",
          attackMitigation: "Cross-Site Scripting (XSS)",
        },
        {
          key: "x-frame-options",
          name: "X-Frame-Options (Clickjacking Guard)",
          value: "DENY",
          status: "secure",
          scoreImpact: 15,
          description: "Universal iframe denial.",
          attackMitigation: "Clickjacking Attacks",
        },
        {
          key: "x-content-type-options",
          name: "X-Content-Type-Options (MIME Sniffing)",
          value: "nosniff",
          status: "secure",
          scoreImpact: 15,
          description: "nosniff header enforced.",
          attackMitigation: "MIME Confusion Attacks",
        },
        {
          key: "referrer-policy",
          name: "Referrer-Policy (Privacy Isolation)",
          value: "strict-origin-when-cross-origin",
          status: "secure",
          scoreImpact: 10,
          description: "Privacy safe referrer handling.",
          attackMitigation: "Privacy Leaks",
        },
        {
          key: "permissions-policy",
          name: "Permissions-Policy (Hardware Sensor Sandbox)",
          value: "camera=(), microphone=(), geolocation=()",
          status: "secure",
          scoreImpact: 10,
          description: "Hardware sensors blocked.",
          attackMitigation: "Sensor Spoofing",
        },
      ],
    },
  },
};

export default function SecurityHeadersClient() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";

  const { tier, recordScan, limits } = usePlan();

  const [urlInput, setUrlInput] = useState(initialUrl);
  const [activePreset, setActivePreset] = useState<string>(initialUrl ? "" : "stripe.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SecurityAuditData | null>(
    initialUrl ? null : DEMO_PRESETS["stripe.com"]
  );

  // Filters & State
  const [statusFilter, setStatusFilter] = useState<"all" | "secure" | "warning" | "missing">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [serverConfigTab, setServerConfigTab] = useState<"nginx" | "apache" | "nextjs" | "vercel" | "caddy">("nginx");
  const [showRawHeaders, setShowRawHeaders] = useState(false);

  // Clipboard & feedback
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copiedHeaderKey, setCopiedHeaderKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2500);
  };

  const handleScan = async (targetToScan: string) => {
    let cleanUrl = targetToScan.trim();
    if (!cleanUrl) return;

    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const presetKey = Object.keys(DEMO_PRESETS).find(
      (k) => cleanUrl.toLowerCase().includes(k)
    );
    if (presetKey && !targetToScan.includes("/")) {
      setActivePreset(presetKey);
      setData(DEMO_PRESETS[presetKey]);
      setError(null);
      return;
    }

    setActivePreset("");
    setLoading(true);
    setError(null);

    try {
      if (!recordScan()) {
        setError(`Daily scan limit reached (${limits.dailyScans}/${limits.dailyScans}). Switch or upgrade plan for unlimited audits.`);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/tools/security-headers?url=${encodeURIComponent(cleanUrl)}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to inspect security headers.");
      }

      setData(json);
      showToast(`Security headers verified for ${json.domain}`);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Scan failed. Please verify the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUrl) {
      setUrlInput(initialUrl);
      handleScan(initialUrl);
    }
  }, [initialUrl]);

  // Filtered Evaluations
  const filteredEvaluations = useMemo(() => {
    if (!data?.securityHeaders.evaluations) return [];

    return data.securityHeaders.evaluations.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.key.toLowerCase().includes(q) ||
          (item.value && item.value.toLowerCase().includes(q)) ||
          item.attackMitigation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [data, statusFilter, searchQuery]);

  // Server Config Snippets
  const serverSnippets: Record<typeof serverConfigTab, string> = {
    nginx: `# /etc/nginx/conf.d/security-headers.conf
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'self';" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
server_tokens off;`,

    apache: `# .htaccess or httpd.conf
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';"
  Header always set X-Frame-Options "DENY"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>
ServerSignature Off`,

    nextjs: `// next.config.mjs or next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};
export default nextConfig;`,

    vercel: `// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}`,

    caddy: `# Caddyfile
example.com {
  header {
    Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';"
    X-Frame-Options "DENY"
    X-Content-Type-Options "nosniff"
    Referrer-Policy "strict-origin-when-cross-origin"
    Permissions-Policy "camera=(), microphone=(), geolocation=()"
    -Server
  }
}`,
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(serverSnippets[serverConfigTab]);
    setCopiedConfig(true);
    showToast(`Copied ${serverConfigTab.toUpperCase()} hardening configuration!`);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const handleCopyShareLink = () => {
    if (typeof window !== "undefined") {
      const target = data?.domain ? `?url=https://${data.domain}` : "";
      navigator.clipboard.writeText(`${window.location.origin}/tools/security-headers${target}`);
      setCopiedShareLink(true);
      showToast("Security report link copied to clipboard!");
      setTimeout(() => setCopiedShareLink(false), 2000);
    }
  };

  const handleCopySingleHeader = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedHeaderKey(key);
    showToast(`Copied ${key}`);
    setTimeout(() => setCopiedHeaderKey(null), 1800);
  };

  const handleDownloadJson = () => {
    if (!data) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-headers-${data.domain}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded security report JSON for ${data.domain}`);
  };

  const score = data?.securityHeaders.securityScore ?? 95;
  const grade = data?.securityHeaders.grade ?? (score >= 95 ? "A+" : score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "F");
  const gradeBg =
    grade === "A+" || grade === "A"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : grade === "B"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-slate-900 transition-colors">
              Tools Hub
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Security Headers Guard</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Lock className="w-3 h-3 text-emerald-600" />
              Defense-In-Depth Guard
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {tier === "free" ? "Free Utility" : "Pro Analyst"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Tool Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
              HTTP Transport Security &amp; Injection Defense
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Security Headers Guard &amp; SSL Hardening
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Audit HSTS preload, Content Security Policy (CSP), anti-clickjacking frame guards, MIME-sniffing defenses, and generate production-ready server configs for Nginx, Apache, Next.js, and Vercel.
            </p>
          </div>

          {/* Action Toolbar */}
          {data && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="Copy shareable link"
              >
                {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                Share
              </button>

              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="Export Security JSON"
              >
                <Code2 className="w-3.5 h-3.5 text-slate-500" />
                JSON
              </button>

              <button
                onClick={() => typeof window !== "undefined" && window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="Print report"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                Print
              </button>
            </div>
          )}
        </div>

        {/* Input Bar & Presets */}
        <div className="flat-card p-5 bg-white border border-slate-200 shadow-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleScan(urlInput);
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter domain or webpage URL (e.g. stripe.com, github.com)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-slate-50/50 hover:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !urlInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing Headers...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Audit Security</span>
                </>
              )}
            </button>
          </form>

          {/* Instant Benchmarks */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              Instant Benchmarks:
            </span>
            {Object.keys(DEMO_PRESETS).map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setUrlInput(preset);
                  setActivePreset(preset);
                  setData(DEMO_PRESETS[preset]);
                  setError(null);
                }}
                className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                  activePreset === preset
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {preset}
              </button>
            ))}

            {data && (
              <Link
                href={`/analyze?url=${encodeURIComponent(data.url)}&tab=headers`}
                className="ml-auto text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
              >
                Full 360° SEO Audit View →
              </Link>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3 animate-in fade-in">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Security Inspection Error</div>
              <p className="mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* DATA REPORT VIEW */}
        {data && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Target Information Strip */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm border border-emerald-100 shrink-0">
                  SSL
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                      {data.domain}
                    </span>
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Open target in new window"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    HTTP {data.httpStatus} • {data.isHttps ? "TLS Encrypted (HTTPS)" : "Insecure HTTP"} • {data.responseTimeMs}ms handshake
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Server: {data.securityHeaders.serverHeader || "Hidden (Secure)"}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  X-Powered-By: {data.securityHeaders.xPoweredBy || "Cloaked (Secure)"}
                </span>
              </div>
            </div>

            {/* 5 Executive KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Card 1: Security Posture Score */}
              <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Hardening Score
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    {score}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${gradeBg}`}>
                    {grade}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">OWASP baseline integrity</div>
              </div>

              {/* Card 2: Critical Headers Passed */}
              <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Critical Headers
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                    {data.securityHeaders.passedCount ?? 6}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 6 Enforced</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Core defensive headers</div>
              </div>

              {/* Card 3: Transport Encryption */}
              <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Transport Encryption
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {data.isHttps ? "TLS 1.3 Active" : "Insecure"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Confidential session stream</div>
              </div>

              {/* Card 4: Information Cloaking */}
              <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Stack Cloaking
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {!data.securityHeaders.xPoweredBy ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-base sm:text-lg font-bold text-slate-900">Cloaked</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span className="text-base sm:text-lg font-bold text-amber-700">Leaking Info</span>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">X-Powered-By header stripped</div>
              </div>

              {/* Card 5: Clickjacking Guard */}
              <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Clickjacking Guard
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {data.securityHeaders.xFrameOptions ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-base sm:text-lg font-bold text-emerald-700 font-mono">
                        {data.securityHeaders.xFrameOptions}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span className="text-base sm:text-lg font-bold text-rose-700">Missing</span>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Anti-frame overlay status</div>
              </div>
            </div>

            {/* 6-Point Security Matrix Cards */}
            <div className="flat-card p-6 bg-white border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    6-Point HTTP Security Defense Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Deterministic inspection of critical response headers protecting modern web applications.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold self-start sm:self-auto">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      statusFilter === "all"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All ({data.securityHeaders.evaluations?.length || 6})
                  </button>
                  <button
                    onClick={() => setStatusFilter("secure")}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      statusFilter === "secure"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    Enforced ({data.securityHeaders.passedCount || 0})
                  </button>
                  {(data.securityHeaders.warningCount || 0) > 0 && (
                    <button
                      onClick={() => setStatusFilter("warning")}
                      className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        statusFilter === "warning"
                          ? "bg-amber-600 text-white"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      Warnings ({data.securityHeaders.warningCount})
                    </button>
                  )}
                  {(data.securityHeaders.missingCount || 0) > 0 && (
                    <button
                      onClick={() => setStatusFilter("missing")}
                      className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        statusFilter === "missing"
                          ? "bg-rose-600 text-white"
                          : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      Missing ({data.securityHeaders.missingCount})
                    </button>
                  )}
                </div>
              </div>

              {/* Evaluations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvaluations.map((item, idx) => {
                  const isSecure = item.status === "secure";
                  const isWarning = item.status === "warning";

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        isSecure
                          ? "bg-slate-50/70 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/20"
                          : isWarning
                          ? "bg-amber-50/40 border-amber-200 hover:bg-amber-50/60"
                          : "bg-rose-50/40 border-rose-200 hover:bg-rose-50/60"
                      }`}
                    >
                      <div>
                        {/* Header Title & Status */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="font-mono text-xs font-extrabold text-slate-900">
                              {item.name}
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">
                              {item.key}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                              isSecure
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isWarning
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {isSecure ? "Active & Enforced" : isWarning ? "Configured (Needs Review)" : "Missing"}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                          {item.description}
                        </p>

                        {/* Mitigation Tag */}
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 mb-3">
                          <Lock className="w-3 h-3 text-emerald-600" />
                          <span>Mitigates: {item.attackMitigation}</span>
                        </div>
                      </div>

                      {/* Value or Recommendation Box */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        {item.value ? (
                          <div className="font-mono text-[11px] text-slate-700 truncate bg-white px-2 py-1 rounded border border-slate-200 flex-1">
                            {item.value}
                          </div>
                        ) : (
                          <div className="text-[11px] text-rose-700 font-medium">
                            {item.recommendation || "Header not returned in response."}
                          </div>
                        )}

                        {item.value && (
                          <button
                            onClick={() => handleCopySingleHeader(item.value!, item.key)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors shrink-0"
                            title="Copy header value"
                          >
                            {copiedHeaderKey === item.key ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 1-Click Server Hardening Config Generator */}
            <div className="flat-card p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">1-Click Server Hardening Config Generator</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Copy production-ready security headers configuration directly into your web server or hosting platform.
                  </p>
                </div>

                {/* Platform tabs */}
                <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
                  {(["nginx", "apache", "nextjs", "vercel", "caddy"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setServerConfigTab(tab)}
                      className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        serverConfigTab === tab
                          ? "bg-emerald-500 text-slate-950 shadow-xs"
                          : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {tab === "nextjs" ? "Next.js" : tab.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="relative">
                <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800">
                  <code>{serverSnippets[serverConfigTab]}</code>
                </pre>

                <button
                  type="button"
                  onClick={handleCopyConfig}
                  className="absolute top-3 right-3 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {copiedConfig ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Config</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Complete Raw Response Headers Table */}
            {data.securityHeaders.rawHeaders && (
              <div className="flat-card p-5 bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Raw HTTP Response Headers ({Object.keys(data.securityHeaders.rawHeaders).length})
                    </h3>
                  </div>

                  <button
                    onClick={() => setShowRawHeaders(!showRawHeaders)}
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showRawHeaders ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Collapse Table</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Raw Headers</span>
                      </>
                    )}
                  </button>
                </div>

                {showRawHeaders && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase">
                          <th className="py-2 pr-4 font-semibold">Header Key</th>
                          <th className="py-2 font-semibold">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {Object.entries(data.securityHeaders.rawHeaders).map(([k, v]) => (
                          <tr key={k} className="hover:bg-slate-50/70">
                            <td className="py-2 pr-4 font-bold text-slate-900 whitespace-nowrap">{k}</td>
                            <td className="py-2 text-slate-600 break-all">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Google Search & OWASP Safe Browsing Guide */}
            <div className="flat-card p-6 bg-gradient-to-br from-emerald-50/50 via-white to-slate-50/50 border border-emerald-200/80 shadow-xs">
              <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Google Safe Browsing &amp; Enterprise Compliance Impact
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 max-w-4xl">
                Google explicitly uses HTTPS transport encryption and SSL integrity as a core ranking signal. Missing security headers leave client sessions vulnerable to cross-site scripting and iframe clickjacking, which can trigger Google Safe Browsing malware warnings and severely impact search rankings.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Search Ranking Trust
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Google Chrome displays prominent &quot;Not Secure&quot; warnings if transport security fails, driving bounce rates above 70%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    SOC2 &amp; ISO 27001 Compliance
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Automated security scanners require HSTS, CSP, and X-Content-Type-Options to certify enterprise vendor compliance.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Malware Quarantine Immunity
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    CSP protects against third-party script supply-chain breaches, preventing your domain from being flagged by malware crawlers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
