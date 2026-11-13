"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ShieldCheck, AlertCircle, Globe, GitCompare, Zap, Radar, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

type LaunchMode = "audit" | "compare" | "speed" | "radar";

interface UrlAnalyzerInputProps {
  compact?: boolean;
  onQuickAnalyze?: (url: string) => void;
}

export default function UrlAnalyzerInput({ compact = false, onQuickAnalyze }: UrlAnalyzerInputProps = {}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<LaunchMode>("audit");
  const [error, setError] = useState("");

  const sampleSites = ["stripe.com", "linear.app", "github.com", "vercel.com", "nextjs.org"];

  const modes: Array<{
    id: LaunchMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    placeholder: string;
    cta: string;
  }> = [
    { id: "audit", label: "Full 14-Engine Audit", icon: Globe, placeholder: "Enter domain to run 0–100 SEO audit (e.g. stripe.com)", cta: "Audit Website" },
    { id: "compare", label: "Competitor Compare", icon: GitCompare, placeholder: "Enter domain to benchmark vs competitors (e.g. linear.app)", cta: "Compare Domain" },
    { id: "speed", label: "Core Web Vitals Lab", icon: Zap, placeholder: "Enter URL for Lighthouse LCP, CLS & INP test", cta: "Test PageSpeed" },
    { id: "radar", label: "AI Brand Radar (AEO)", icon: Radar, placeholder: "Enter brand domain for ChatGPT/Gemini Share of Voice", cta: "Scan AI Radar" },
  ];

  const activeMode = modes.find((m) => m.id === mode) || modes[0];

  const handleAnalyze = (targetUrl?: string) => {
    const raw = (targetUrl || url).trim();
    if (!raw) {
      setError("Please enter a website URL or domain name.");
      return;
    }

    let formatted = raw;
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = `https://${formatted}`;
    }

    try {
      const parsed = new URL(formatted);
      if (!parsed.hostname || !parsed.hostname.includes(".")) {
        setError("Please enter a valid domain (e.g. stripe.com).");
        return;
      }

      if (
        parsed.hostname === "localhost" ||
        parsed.hostname.startsWith("127.") ||
        parsed.hostname.startsWith("192.168.") ||
        parsed.hostname.startsWith("10.") ||
        parsed.hostname === "169.254.169.254"
      ) {
        setError("Local and internal addresses cannot be analyzed for security reasons.");
        return;
      }

      setError("");
      
      let targetDestination = `/analyze?url=${encodeURIComponent(formatted)}`;
      if (mode === "compare") {
        targetDestination = `/compare?siteA=${encodeURIComponent(formatted)}&siteB=${encodeURIComponent("https://stripe.com")}`;
      } else if (mode === "speed") {
        targetDestination = `/tools/speed-lab?url=${encodeURIComponent(formatted)}`;
      } else if (mode === "radar") {
        targetDestination = `/tools/brand-radar?brand=${encodeURIComponent(parsed.hostname)}`;
      }

      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(targetDestination)}`);
        return;
      }

      if (onQuickAnalyze && mode === "audit") {
        onQuickAnalyze(formatted);
        return;
      }

      router.push(targetDestination);
    } catch {
      setError("Please enter a valid website address.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Launch Mode Segmented Tabs */}
      {!compact && (
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 mb-4 rounded-2xl bg-slate-100/90 border border-slate-200/90 shadow-2xs">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isActive 
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200/80" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? "text-blue-600 scale-110" : "text-slate-400"}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-white border-2 border-slate-300/90 hover:border-slate-400 rounded-2xl focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/15 transition-all shadow-lg shadow-slate-900/5">
          <div className="flex items-center flex-1 px-3 py-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center mr-3 shrink-0">
              <Search className="w-4 h-4 text-blue-600" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder={activeMode.placeholder}
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base outline-none font-medium"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all cursor-pointer shrink-0 shadow-md shadow-blue-600/20 active:scale-[0.98] group/btn whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span>{activeMode.cta}</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-rose-600 font-semibold px-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {!compact && (
        <>
          {/* Quick 1-click sample sites */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
            <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">
              1-Click Sample:
            </span>
            {sampleSites.map((site) => (
              <button
                key={site}
                type="button"
                onClick={() => {
                  setUrl(site);
                  handleAnalyze(site);
                }}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg font-mono text-[11px] font-semibold transition-all border border-slate-200 hover:border-blue-300 cursor-pointer shadow-2xs hover:-translate-y-0.5"
              >
                {site}
              </button>
            ))}
          </div>

          {/* Grounded & Security Trust Ribbons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              SSRF &amp; DNS Pinning Shield
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span>No Account Required for Instant Audits</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              100% Deterministic Engine
            </span>
          </div>
        </>
      )}
    </div>
  );
}
