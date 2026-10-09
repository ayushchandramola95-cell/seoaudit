"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function UrlAnalyzerInput() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const sampleSites = ["github.com", "stripe.com", "wikipedia.org", "nextjs.org"];

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
        setError("Please enter a valid domain (e.g. example.com).");
        return;
      }

      // Check for private / localhost entries early on client side
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
      router.push(`/analyze?url=${encodeURIComponent(formatted)}`);
    } catch {
      setError("Please enter a valid website address.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-white border-2 border-slate-300 rounded-xl focus-within:border-blue-600 transition-colors shadow-none">
          <div className="flex items-center flex-1 px-3 py-1">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter domain or URL, e.g. stripe.com"
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base outline-none font-medium"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Analyze Website
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 font-medium px-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Preset fast demo URLs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
        <span className="font-medium text-slate-400">Quick test:</span>
        {sampleSites.map((site) => (
          <button
            key={site}
            type="button"
            onClick={() => {
              setUrl(site);
              handleAnalyze(site);
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-mono transition-colors border border-slate-200"
          >
            {site}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          SSRF Safe Fetching
        </span>
        <span>•</span>
        <span>No Login Required for Public Audits</span>
        <span>•</span>
        <span>Grounded Deterministic Metrics</span>
      </div>
    </div>
  );
}
