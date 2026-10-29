"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Download,
  Filter,
  ArrowRight,
  BookOpen,
  PieChart,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { KeywordAnalysisReport, KeywordItem } from "@/lib/modules/keywords/extractor";

interface KeywordApiResponse {
  success: boolean;
  url: string;
  domain: string;
  title: string | null;
  wordCount: number;
  latencyMs: number;
  data: KeywordAnalysisReport;
}

const PRESET_DOMAINS = [
  { domain: "stripe.com", label: "Stripe" },
  { domain: "linear.app", label: "Linear" },
  { domain: "vercel.com", label: "Vercel" },
  { domain: "github.com", label: "GitHub" },
];

export default function KeywordResearchClient() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KeywordApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"1gram" | "2gram" | "3gram" | "warnings">("1gram");
  const [searchTerm, setSearchTerm] = useState("");

  // STRICT REQUIREMENT: NO AUTO-FETCHING!
  // Presets ONLY populate the input box. User MUST explicitly click "Extract Keywords".
  const handleSelectPreset = (domain: string) => {
    setUrlInput(domain);
  };

  const handleExtract = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/keyword-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to extract keyword analysis.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const currentList = useMemo(() => {
    if (!result) return [];
    if (activeTab === "1gram") return result.data.topSingleKeywords;
    if (activeTab === "2gram") return result.data.topTwoWordPhrases;
    if (activeTab === "3gram") return result.data.topThreeWordPhrases;
    return [];
  }, [result, activeTab]);

  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return currentList;
    return currentList.filter((item) =>
      item.phrase.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [currentList, searchTerm]);

  const exportCsv = () => {
    if (!result) return;
    const items = [
      ...result.data.topSingleKeywords.map((k) => ({ ...k, type: "1-Gram" })),
      ...result.data.topTwoWordPhrases.map((k) => ({ ...k, type: "2-Gram" })),
      ...result.data.topThreeWordPhrases.map((k) => ({ ...k, type: "3-Gram" })),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["N-Gram Type,Keyword Phrase,Frequency,Density %,In Title,In H1"]
        .concat(
          items.map(
            (i) =>
              `"${i.type}","${i.phrase}",${i.count},${i.density.toFixed(2)}%,${i.inTitle ? "Yes" : "No"},${i.inH1 ? "Yes" : "No"}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `keywords-${result.domain}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-emerald-600 transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Keyword Density Explorer</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-emerald-900/20 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              N-Gram Tokenizer v2.0
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <PieChart className="w-3.5 h-3.5" />
              TF-IDF Density Analyzer
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-3.5 h-3.5" />
              On-Page Heading Signals
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Keyword Density &amp; Frequency Matrix
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Extract exact 1-word, 2-word, and 3-word n-gram keyword distributions from live HTML. 
            Evaluate semantic content density, verify keyword placement in &lt;title&gt; and &lt;h1&gt; tags, and prevent keyword stuffing penalties.
          </p>

          {/* Form */}
          <form onSubmit={handleExtract} className="max-w-3xl">
            <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter URL to analyze (e.g., stripe.com or https://linear.app)"
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3 border border-slate-700/80 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !urlInput.trim()}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting N-Grams...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Extract Keyword Density</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets - STRICTLY populate only, user must click button to audit */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick presets (fills input, click Extract to run):</span>
              {PRESET_DOMAINS.map((p) => (
                <button
                  key={p.domain}
                  type="button"
                  onClick={() => handleSelectPreset(p.domain)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors ${
                    urlInput === p.domain
                      ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40"
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
                <p className="font-semibold text-rose-200">Extraction Failed</p>
                <p className="mt-0.5 text-xs text-rose-300/90">{error}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!result && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Ready to Mine On-Page Keyword Density
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
              Enter any URL above or choose a preset, then click <strong>&quot;Extract Keyword Density&quot;</strong>. 
              Data is never fetched automatically until you trigger the analysis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  1, 2 &amp; 3-Gram Phrases
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Extracts natural phrase groups while eliminating generic stop-words to isolate high-value topical terms.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                  <PieChart className="w-4 h-4 text-blue-600" />
                  TF-IDF Density %
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Flags optimal keyword density (1.5% - 3.5%) and warns against dangerous over-optimization stuffing.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Heading Placement Check
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verifies if high-frequency body keywords are represented in the &lt;title&gt; and &lt;h1&gt; tags.
                </p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>Total Word Count</span>
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {result.data.totalWords.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {result.data.uniqueWords.toLocaleString()} unique vocabulary tokens
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>Lexical Diversity</span>
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-purple-700">
                  {(result.data.lexicalDiversity * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Ratio of unique words to total volume
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>Estimated Reading Time</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-blue-700">
                  {result.data.readingTimeMinutes} min
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Based on standard 220 WPM reading rate
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>SEO Content Warnings</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-amber-600">
                  {result.data.warnings.length}
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {result.data.warnings.length === 0 ? "Clean lexical distribution" : "Optimization advice flagged"}
                </p>
              </div>
            </div>

            {/* Keyword Explorer Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200 bg-slate-50/50 p-2 sm:p-0">
                <div className="flex border-b sm:border-b-0 border-slate-200 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab("1gram")}
                    className={`px-5 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === "1gram"
                        ? "border-emerald-600 text-emerald-600 bg-white"
                        : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>1-Word Keywords</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-normal">
                      {result.data.topSingleKeywords.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("2gram")}
                    className={`px-5 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === "2gram"
                        ? "border-emerald-600 text-emerald-600 bg-white"
                        : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>2-Word Phrases</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-normal">
                      {result.data.topTwoWordPhrases.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("3gram")}
                    className={`px-5 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === "3gram"
                        ? "border-emerald-600 text-emerald-600 bg-white"
                        : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>3-Word Phrases</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-normal">
                      {result.data.topThreeWordPhrases.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("warnings")}
                    className={`px-5 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === "warnings"
                        ? "border-emerald-600 text-emerald-600 bg-white"
                        : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>SEO Advice</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-normal">
                      {result.data.warnings.length}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 sm:py-0">
                  <div className="relative">
                    <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter phrase..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 w-36 sm:w-44"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={exportCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Table Render */}
              {activeTab !== "warnings" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Rank</th>
                        <th className="py-3 px-4">Extracted Keyword / Phrase</th>
                        <th className="py-3 px-4">Frequency</th>
                        <th className="py-3 px-4">Density %</th>
                        <th className="py-3 px-4">In &lt;title&gt;</th>
                        <th className="py-3 px-4">In &lt;h1&gt;</th>
                        <th className="py-3 px-4">Density Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {filteredList.map((kw: KeywordItem, idx: number) => {
                        let statusColor = "bg-slate-100 text-slate-700";
                        let statusText = "Moderate";
                        if (kw.density > 4.0) {
                          statusColor = "bg-rose-100 text-rose-800 border-rose-200";
                          statusText = "Stuffing Risk";
                        } else if (kw.density >= 1.5) {
                          statusColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
                          statusText = "Optimal";
                        }

                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-4 text-xs font-mono text-slate-600">
                              #{idx + 1}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              {kw.phrase}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-700">
                              {kw.count}×
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">
                              {kw.density.toFixed(2)}%
                            </td>
                            <td className="py-3 px-4">
                              {kw.inTitle ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Yes
                                </span>
                              ) : (
                                <span className="text-xs text-slate-600">No</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {kw.inH1 ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Yes
                                </span>
                              ) : (
                                <span className="text-xs text-slate-600">No</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${statusColor}`}>
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredList.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-xs text-slate-600">
                            No keyword phrases matched &quot;{searchTerm}&quot;.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Warnings / Advice Tab */}
              {activeTab === "warnings" && (
                <div className="p-6">
                  {result.data.warnings.length === 0 ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        Excellent Lexical &amp; Density Distribution
                      </div>
                      <p className="text-xs text-emerald-800">
                        No keyword stuffing detected. Keyword frequencies appear natural and evenly distributed across the document body.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {result.data.warnings.map((warn, idx) => (
                        <div key={idx} className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-amber-900">Density Warning #{idx + 1}</p>
                            <p className="text-xs text-amber-800 mt-0.5">{warn}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cross-Tool Actions Footer */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold">Compare Semantic Gaps with Competitors</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Benchmark your extracted keywords against competitor pages in the Semantic Content Gap tool.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href={`/tools/content-gap`}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md"
                >
                  <span>Content Gap Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/tools/traffic-estimator?domain=${encodeURIComponent(result.domain)}`}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Estimate Traffic</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
