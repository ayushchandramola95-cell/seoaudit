"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Server,
  Database,
  Globe,
  GitCompare,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  Clock,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface SavedScan {
  id: string;
  domain: string;
  targetUrl: string;
  seoScore: number;
  grade: string;
  responseTimeMs: number;
  perfScore: number | null;
  techCount: number;
  trafficRange: string;
  createdAt: string;
}

interface SavedComparison {
  id: string;
  siteADomain: string;
  siteBDomain: string;
  siteAScore: number;
  siteBScore: number;
  seoDiff: number;
  createdAt: string;
}

interface DbStatus {
  isCloudRun: boolean;
  isCloudSqlConfigured: boolean;
  serviceName: string;
  revision: string;
  port: string;
  platform: string;
  databaseType: string;
  cloudRunDomain: string;
  totalSavedScans: number;
  totalSavedComparisons: number;
}

export default function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [scans, setScans] = useState<SavedScan[]>([]);
  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);
  const [activeTab, setActiveTab] = useState<"scans" | "comparisons" | "infra">("scans");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Quick Action form states
  const [quickUrl, setQuickUrl] = useState("");
  const [compSiteA, setCompSiteA] = useState("");
  const [compSiteB, setCompSiteB] = useState("");

  async function loadDashboardData() {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (json.success) {
        setStatus(json.status);
        setScans(json.scans || []);
        setComparisons(json.comparisons || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Server className="w-3.5 h-3.5" />
                Google Cloud Platform Native
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Container Port 8080 Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              SaaS Operational Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Inspect live audit history, competitor benchmarks, and Google Cloud Run / Cloud SQL PostgreSQL runtime connections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
              Refresh
            </button>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-none"
            >
              New Audit
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Runtime & Infrastructure Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Cloud Run Service */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Deployment Host
              </span>
              <Server className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-lg font-bold text-slate-900 truncate">
              {status?.serviceName || "seoseite"}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{status?.platform || "Google Cloud Run"}</span>
            </div>
          </div>

          {/* Card 2: Cloud SQL Database */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Database Engine
              </span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-lg font-bold text-slate-900 truncate">
              {status?.isCloudSqlConfigured ? "Cloud SQL Active" : "In-Memory / Ready"}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 truncate">
              <span>{status?.databaseType || "PostgreSQL Ready"}</span>
            </div>
          </div>

          {/* Card 3: Total Audits */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Saved Audits
              </span>
              <Globe className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {scans.length}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Individual domain intelligence records
            </div>
          </div>

          {/* Card 4: Total Comparisons */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Competitor Benchmarks
              </span>
              <GitCompare className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {comparisons.length}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Head-to-head comparison records
            </div>
          </div>
        </div>

        {/* Quick Launch Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Analyze Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              Quick Website Audit
            </h2>
            <p className="text-xs text-slate-600 mt-1 mb-4">
              Enter any live URL to run SEO, Tech Stack, Core Web Vitals, and AI analysis.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (quickUrl.trim()) {
                  window.location.href = `/analyze?url=${encodeURIComponent(quickUrl.trim())}`;
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="example.com or https://company.io"
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Audit
              </button>
            </form>
          </div>

          {/* Quick Compare Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-purple-600" />
              Quick Competitor Comparison
            </h2>
            <p className="text-xs text-slate-600 mt-1 mb-4">
              Compare two domains side-by-side with automatic winner metrics.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (compSiteA.trim() && compSiteB.trim()) {
                  window.location.href = `/compare?siteA=${encodeURIComponent(
                    compSiteA.trim()
                  )}&siteB=${encodeURIComponent(compSiteB.trim())}`;
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Site A (e.g. github.com)"
                value={compSiteA}
                onChange={(e) => setCompSiteA(e.target.value)}
                className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 bg-white"
              />
              <input
                type="text"
                placeholder="Site B (e.g. gitlab.com)"
                value={compSiteB}
                onChange={(e) => setCompSiteB(e.target.value)}
                className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Compare
              </button>
            </form>
          </div>
        </div>

        {/* Tab Navigation for Data Tables */}
        <div className="border-b border-slate-200 flex gap-6">
          <button
            onClick={() => setActiveTab("scans")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "scans"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Globe className="w-4 h-4" />
            Audit History ({scans.length})
          </button>
          <button
            onClick={() => setActiveTab("comparisons")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "comparisons"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <GitCompare className="w-4 h-4" />
            Competitor Comparisons ({comparisons.length})
          </button>
          <button
            onClick={() => setActiveTab("infra")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "infra"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Server className="w-4 h-4" />
            Google Cloud Run & Cloud SQL Config
          </button>
        </div>

        {/* Tab 1: Recent Scans Table */}
        {activeTab === "scans" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Analyzed Websites</h3>
                <p className="text-xs text-slate-500">
                  Historical scans stored in PostgreSQL / in-memory cache. Click any row to view full report.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                Loading audit records...
              </div>
            ) : scans.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No website audits recorded yet. Run your first audit using the search bar above or on the homepage!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="px-6 py-3">Domain</th>
                      <th className="px-6 py-3">SEO Score</th>
                      <th className="px-6 py-3">Grade</th>
                      <th className="px-6 py-3">Latency</th>
                      <th className="px-6 py-3">Tech Count</th>
                      <th className="px-6 py-3">Traffic Est.</th>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {scans.map((scan) => (
                      <tr key={scan.id} className="hover:bg-slate-50/70 transition-colors font-sans">
                        <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="font-mono text-xs">{scan.domain}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                              scan.seoScore >= 80
                                ? "bg-emerald-100 text-emerald-800"
                                : scan.seoScore >= 60
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {scan.seoScore}/100
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {scan.grade}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                          {scan.responseTimeMs} ms
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {scan.techCount} detected
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                          {scan.trafficRange}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                          {new Date(scan.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/analyze?url=${encodeURIComponent(scan.domain)}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            View
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Recent Comparisons Table */}
        {activeTab === "comparisons" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Competitor Comparisons</h3>
                <p className="text-xs text-slate-500">
                  Head-to-head audits saved in Cloud SQL. Click any entry to inspect the comparative breakdown.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600 mb-2" />
                Loading comparisons...
              </div>
            ) : comparisons.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No competitor comparisons saved yet. Run your first comparison via the Quick Compare bar above!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="px-6 py-3">Site A</th>
                      <th className="px-6 py-3">Score A</th>
                      <th className="px-6 py-3 text-center">VS</th>
                      <th className="px-6 py-3">Site B</th>
                      <th className="px-6 py-3">Score B</th>
                      <th className="px-6 py-3">Leader</th>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans text-xs">
                    {comparisons.map((c) => {
                      const leader =
                        c.siteAScore > c.siteBScore
                          ? c.siteADomain
                          : c.siteBScore > c.siteAScore
                          ? c.siteBDomain
                          : "Tie";
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                            {c.siteADomain}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-blue-700">{c.siteAScore}/100</span>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-400">
                            vs
                          </td>
                          <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                            {c.siteBDomain}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-purple-700">{c.siteBScore}/100</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {leader === "Tie" ? "Tied" : `+${Math.abs(c.seoDiff)} pts: ${leader}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                            {new Date(c.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/compare?siteA=${encodeURIComponent(
                                c.siteADomain
                              )}&siteB=${encodeURIComponent(c.siteBDomain)}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                            >
                              Open
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Google Cloud Run & Cloud SQL Architecture Guide */}
        {activeTab === "infra" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Google Cloud Run & Cloud SQL Architecture
                  </h3>
                  <p className="text-xs text-slate-600">
                    Production configuration, environment variables, and zero-downtime deployment commands.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs font-semibold uppercase text-slate-500">Container Port</div>
                  <div className="text-lg font-bold text-slate-900 mt-1 font-mono">PORT=8080</div>
                  <div className="text-xs text-slate-600 mt-1">Configured in Dockerfile & Cloud Run contract</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs font-semibold uppercase text-slate-500">Default Cloud Run URL</div>
                  <div className="text-lg font-bold text-slate-900 mt-1 font-mono truncate">
                    *.a.run.app
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Free HTTPS wildcard domain generated automatically
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs font-semibold uppercase text-slate-500">SSRF Cloud Guard</div>
                  <div className="text-lg font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Enforced
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    metadata.google.internal & 169.254.169.254 blocked
                  </div>
                </div>
              </div>

              {/* Deployment Commands */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-700" />
                  1-Command Deployment to Google Cloud Run
                </h4>

                <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs relative overflow-x-auto">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                    <span>Terminal / PowerShell</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `gcloud run deploy seoseite --source . --region us-central1 --allow-unauthenticated --set-env-vars NODE_ENV=production,PORT=8080`,
                          "deploy-cmd"
                        )
                      }
                      className="flex items-center gap-1 text-xs text-slate-300 hover:text-white"
                    >
                      {copiedCmd === "deploy-cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCmd === "deploy-cmd" ? "Copied" : "Copy Command"}
                    </button>
                  </div>
                  <code>
                    gcloud run deploy seoseite \<br />
                    &nbsp;&nbsp;--source . \<br />
                    &nbsp;&nbsp;--region us-central1 \<br />
                    &nbsp;&nbsp;--allow-unauthenticated \<br />
                    &nbsp;&nbsp;--set-env-vars NODE_ENV=production,PORT=8080
                  </code>
                </div>

                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pt-2">
                  <Database className="w-4 h-4 text-emerald-700" />
                  Connecting Google Cloud SQL (PostgreSQL)
                </h4>

                <p className="text-xs text-slate-600">
                  When linking your Cloud SQL PostgreSQL instance to Cloud Run, attach the instance connection flag:
                </p>

                <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs relative overflow-x-auto">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                    <span>Cloud SQL Attachment Flag</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `gcloud run services update seoseite --add-cloudsql-instances YOUR_PROJECT_ID:REGION:INSTANCE_NAME --update-env-vars DATABASE_URL="postgresql://user:pass@/dbname?host=/cloudsql/YOUR_PROJECT_ID:REGION:INSTANCE_NAME"`,
                          "sql-cmd"
                        )
                      }
                      className="flex items-center gap-1 text-xs text-slate-300 hover:text-white"
                    >
                      {copiedCmd === "sql-cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCmd === "sql-cmd" ? "Copied" : "Copy Command"}
                    </button>
                  </div>
                  <code>
                    gcloud run services update seoseite \<br />
                    &nbsp;&nbsp;--add-cloudsql-instances YOUR_PROJECT_ID:REGION:INSTANCE_NAME \<br />
                    &nbsp;&nbsp;--update-env-vars DATABASE_URL="postgresql://user:pass@/dbname?host=/cloudsql/YOUR_PROJECT_ID:REGION:INSTANCE_NAME"
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
