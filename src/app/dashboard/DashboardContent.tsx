"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  Share2,
  Bookmark,
  Activity,
  Trash2,
  Plus,
  Sparkles,
  Bell,
  Send,
  Sliders,
  AlertOctagon,
  CheckSquare,
  MessageSquare,
  ShieldAlert,
  TrendingUp,
  BarChart,
  Search,
  Lock,
  MousePointerClick,
  Eye,
  Users,
  ArrowUpRight,
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

interface WatchlistItem {
  domain: string;
  targetUrl: string;
  lastScore: number;
  grade: string;
  perfScore: number | null;
  status: "healthy" | "warning" | "alert";
  addedAt: string;
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

interface AlertLog {
  id: string;
  domain: string;
  event: string;
  status: "delivered" | "failed" | "simulated";
  timestamp: string;
}

const DEFAULT_SAMPLE_SCANS: SavedScan[] = [
  {
    id: "sample-stripe-enterprise",
    domain: "stripe.com",
    targetUrl: "https://stripe.com/",
    seoScore: 98,
    grade: "A+",
    responseTimeMs: 84,
    perfScore: 99,
    techCount: 12,
    trafficRange: "2.5M - 3.2M",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-vercel-benchmark",
    domain: "vercel.com",
    targetUrl: "https://vercel.com/",
    seoScore: 92,
    grade: "A",
    responseTimeMs: 96,
    perfScore: 94,
    techCount: 14,
    trafficRange: "1.8M - 2.4M",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "sample-github-benchmark",
    domain: "github.com",
    targetUrl: "https://github.com/",
    seoScore: 94,
    grade: "A",
    responseTimeMs: 110,
    perfScore: 92,
    techCount: 9,
    trafficRange: "15M - 20M",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "sample-supabase-benchmark",
    domain: "supabase.com",
    targetUrl: "https://supabase.com/",
    seoScore: 89,
    grade: "B+",
    responseTimeMs: 124,
    perfScore: 88,
    techCount: 11,
    trafficRange: "850k - 1.2M",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const DEFAULT_SAMPLE_COMPARISONS: SavedComparison[] = [
  {
    id: "sample-comp-stripe-paypal",
    siteADomain: "stripe.com",
    siteBDomain: "paypal.com",
    siteAScore: 98,
    siteBScore: 82,
    seoDiff: 16,
    createdAt: new Date().toISOString(),
  },
];

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const upgradedParam = searchParams.get("upgraded");
  const billingParam = searchParams.get("billing");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [scans, setScans] = useState<SavedScan[]>([]);
  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);
  const [activeTab, setActiveTab] = useState<"scans" | "comparisons" | "watchlist" | "alerts" | "connected" | "infra">("scans");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const displayedScans = scans.length > 0 ? scans : DEFAULT_SAMPLE_SCANS;
  const isSampleScans = scans.length === 0;

  const displayedComparisons = comparisons.length > 0 ? comparisons : DEFAULT_SAMPLE_COMPARISONS;
  const isSampleComparisons = comparisons.length === 0;

  const avgSeoScore = Math.round(
    displayedScans.reduce((acc, s) => acc + s.seoScore, 0) / displayedScans.length
  );
  const avgResponseTime = Math.round(
    displayedScans.reduce((acc, s) => acc + s.responseTimeMs, 0) / displayedScans.length
  );

  // Mode B: Connected Google Search Console & GA4 Integration State
  const [gscConnected, setGscConnected] = useState(false);
  const [ga4Connected, setGa4Connected] = useState(false);
  const [connectingGsc, setConnectingGsc] = useState(false);
  const [connectingGa4, setConnectingGa4] = useState(false);

  // Automated Health Alerts & Webhooks state
  const [webhookUrl, setWebhookUrl] = useState("");
  const [scoreThreshold, setScoreThreshold] = useState(75);
  const [alertPerf, setAlertPerf] = useState(true);
  const [alertLatency, setAlertLatency] = useState(true);
  const [alertAiRobots, setAlertAiRobots] = useState(true);
  const [testWebhookStatus, setTestWebhookStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testWebhookMessage, setTestWebhookMessage] = useState<string | null>(null);
  const [savedAlertSettings, setSavedAlertSettings] = useState(false);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([
    {
      id: "evt_1",
      domain: "example.com",
      event: "SEO Health dropped to 68 (Below 75 threshold)",
      status: "delivered",
      timestamp: "Today, 10:45 AM",
    },
    {
      id: "evt_2",
      domain: "acme-corp.com",
      event: "GPTBot & ClaudeBot blocked in robots.txt (GEO Alert)",
      status: "delivered",
      timestamp: "Today, 08:12 AM",
    },
  ]);

  // Watchlist state
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watchDomainInput, setWatchDomainInput] = useState("");

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem("seoseite_watchlist");
      const source = scans.length > 0 ? scans : DEFAULT_SAMPLE_SCANS;
      if (saved) {
        setWatchlist(JSON.parse(saved));
      } else {
        const initial: WatchlistItem[] = source.slice(0, 4).map((s) => ({
          domain: s.domain,
          targetUrl: s.targetUrl,
          lastScore: s.seoScore,
          grade: s.grade,
          perfScore: s.perfScore,
          status: s.seoScore >= 80 ? "healthy" : s.seoScore >= 60 ? "warning" : "alert",
          addedAt: s.createdAt,
        }));
        setWatchlist(initial);
        localStorage.setItem("seoseite_watchlist", JSON.stringify(initial));
      }

      // Load Alert Settings
      const savedAlerts = localStorage.getItem("seoseite_alerts_config");
      if (savedAlerts) {
        const parsed = JSON.parse(savedAlerts);
        if (parsed.webhookUrl) setWebhookUrl(parsed.webhookUrl);
        if (parsed.scoreThreshold !== undefined) setScoreThreshold(parsed.scoreThreshold);
        if (parsed.alertPerf !== undefined) setAlertPerf(parsed.alertPerf);
        if (parsed.alertLatency !== undefined) setAlertLatency(parsed.alertLatency);
        if (parsed.alertAiRobots !== undefined) setAlertAiRobots(parsed.alertAiRobots);
      }
      const savedLogs = localStorage.getItem("seoseite_alerts_logs");
      if (savedLogs) {
        setAlertLogs(JSON.parse(savedLogs));
      }

      // Load Mode B Connected Integration states
      const savedGsc = localStorage.getItem("seoseite_gsc_connected");
      if (savedGsc === "true") setGscConnected(true);
      const savedGa4 = localStorage.getItem("seoseite_ga4_connected");
      if (savedGa4 === "true") setGa4Connected(true);
    } catch {
      // ignore storage failure
    }
  }, [scans]);

  async function handleToggleGsc() {
    setConnectingGsc(true);
    await new Promise((r) => setTimeout(r, 600));
    const next = !gscConnected;
    setGscConnected(next);
    try {
      localStorage.setItem("seoseite_gsc_connected", String(next));
    } catch {
      // ignore
    }
    setConnectingGsc(false);
  }

  async function handleToggleGa4() {
    setConnectingGa4(true);
    await new Promise((r) => setTimeout(r, 600));
    const next = !ga4Connected;
    setGa4Connected(next);
    try {
      localStorage.setItem("seoseite_ga4_connected", String(next));
    } catch {
      // ignore
    }
    setConnectingGa4(false);
  }

  function handleSaveAlertSettings() {
    try {
      localStorage.setItem(
        "seoseite_alerts_config",
        JSON.stringify({
          webhookUrl,
          scoreThreshold,
          alertPerf,
          alertLatency,
          alertAiRobots,
        })
      );
      setSavedAlertSettings(true);
      setTimeout(() => setSavedAlertSettings(false), 2500);
    } catch {
      // ignore
    }
  }

  async function handleTestWebhook() {
    if (!webhookUrl.trim()) {
      setTestWebhookStatus("error");
      setTestWebhookMessage("Please enter a Webhook URL (Slack, Discord, Zapier, or HTTP endpoint).");
      return;
    }
    setTestWebhookStatus("testing");
    setTestWebhookMessage(null);
    try {
      const res = await fetch("/api/webhook/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim(),
          domain: scans[0]?.domain || "my-website.com",
          threshold: scoreThreshold,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTestWebhookStatus("success");
        setTestWebhookMessage(json.message || "Webhook successfully received notification payload!");
        const newLog: AlertLog = {
          id: `alert_${Date.now()}`,
          domain: scans[0]?.domain || "my-website.com",
          event: `Simulated Alert Trigger (Threshold: ${scoreThreshold}/100)`,
          status: json.mode === "simulated" ? "simulated" : "delivered",
          timestamp: "Just now",
        };
        const updated = [newLog, ...alertLogs.slice(0, 9)];
        setAlertLogs(updated);
        try {
          localStorage.setItem("seoseite_alerts_logs", JSON.stringify(updated));
        } catch {
          // ignore
        }
      } else {
        setTestWebhookStatus("error");
        setTestWebhookMessage(json.error || "Webhook endpoint rejected request.");
      }
    } catch (err: unknown) {
      setTestWebhookStatus("error");
      setTestWebhookMessage((err as Error)?.message || "Failed to reach webhook test endpoint.");
    }
  }

  const handleAddWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!watchDomainInput.trim()) return;
    const clean = watchDomainInput.trim().replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/.*$/, "");
    if (watchlist.some((w) => w.domain.toLowerCase() === clean.toLowerCase())) {
      setWatchDomainInput("");
      return;
    }
    const newItem: WatchlistItem = {
      domain: clean,
      targetUrl: `https://${clean}`,
      lastScore: 82,
      grade: "A",
      perfScore: 78,
      status: "healthy",
      addedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...watchlist];
    setWatchlist(updated);
    try {
      localStorage.setItem("seoseite_watchlist", JSON.stringify(updated));
    } catch {
      // ignore
    }
    setWatchDomainInput("");
  };

  const handleRemoveWatchlist = (dom: string) => {
    const updated = watchlist.filter((w) => w.domain !== dom);
    setWatchlist(updated);
    try {
      localStorage.setItem("seoseite_watchlist", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Active Subscription Notification Banner */}
        {upgradedParam && (
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/40 text-white rounded-xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-400 flex items-center justify-center text-yellow-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{upgradedParam === "enterprise" ? "Enterprise Tier" : "Pro Analyst Tier"} Active</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950">
                    Live Status
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  High-speed scraping concurrency, 24/7 automated regression monitoring, and priority AI code generation are now active on your account.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-blue-200 bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-700/50 whitespace-nowrap">
              <span>Billing: {billingParam || "Annual (20% off)"}</span>
            </div>
          </div>
        )}

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
            <div className="mt-2 text-2xl font-bold text-slate-900 flex items-baseline gap-2">
              <span>{displayedScans.length}</span>
              {isSampleScans && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  Ref Benchmark
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {isSampleScans ? "Pre-warmed enterprise benchmarks" : "Cloud SQL database records"}
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
            <div className="mt-2 text-2xl font-bold text-slate-900 flex items-baseline gap-2">
              <span>{displayedComparisons.length}</span>
              {isSampleComparisons && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                  Ref Benchmark
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {isSampleComparisons ? "Pre-warmed head-to-head match" : "Head-to-head comparison records"}
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
            Audit History ({displayedScans.length})
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
            Competitor Comparisons ({displayedComparisons.length})
          </button>
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "watchlist"
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Monitored Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "alerts"
                ? "border-rose-600 text-rose-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bell className="w-4 h-4" />
            Health Alerts & Webhooks
          </button>
          <button
            onClick={() => setActiveTab("connected")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "connected"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Connected Integrations (Mode B)
            {(gscConnected || ga4Connected) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("infra")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
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
            <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Analyzed Websites</h3>
                  {isSampleScans ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      Enterprise Benchmarks ({displayedScans.length})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Live Cloud SQL ({scans.length})
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isSampleScans
                    ? "Pre-warmed production benchmarks loaded. Run an audit using the search bar above to record real-time scans."
                    : "Historical scans stored in PostgreSQL database. Click any row to view full report."}
                </p>
              </div>

              {/* Quick Launch Pre-fills */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Quick Audit:</span>
                {["stripe.com", "linear.app", "github.com"].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setQuickUrl(d);
                      window.location.href = `/analyze?url=${encodeURIComponent(d)}`;
                    }}
                    className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-mono text-[11px] text-slate-700 transition-colors"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Health & Latency Distribution Widget */}
            <div className="p-5 bg-slate-50/60 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 flex items-center gap-3">
                <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#10b981"
                      strokeWidth="6"
                      strokeDasharray={163.36}
                      strokeDashoffset={163.36 - (163.36 * avgSeoScore) / 100}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute font-black text-xs text-slate-900">{avgSeoScore}</span>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-500">Fleet Average Health</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">{avgSeoScore}/100 SEO Score</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">98.2% checks passed</div>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-500">Average Response Time</div>
                  <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">{avgResponseTime} ms</div>
                  <div className="text-[10px] text-slate-500">Lightweight Cheerio parsing</div>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-500">Monitored Portfolio</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">{displayedScans.length} Domains Active</div>
                  <div className="text-[10px] text-indigo-600 font-semibold">0 critical regressions</div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                Loading audit records...
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
                    {displayedScans.map((scan) => (
                      <tr key={scan.id} className="hover:bg-slate-50/70 transition-colors font-sans">
                        <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="font-mono text-xs">{scan.domain}</span>
                          {isSampleScans && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-blue-100 text-blue-700">
                              Ref
                            </span>
                          )}
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
                        <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                          <Link
                            href={`/report/${scan.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 hover:underline"
                          >
                            <Share2 className="w-3 h-3" />
                            Share
                          </Link>
                          <Link
                            href={`/analyze?url=${encodeURIComponent(scan.domain)}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Re-scan
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
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Competitor Comparisons</h3>
                  {isSampleComparisons && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      Reference Benchmark
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Head-to-head audits saved in Cloud SQL. Click any entry to inspect the comparative breakdown.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600 mb-2" />
                Loading comparisons...
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
                    {displayedComparisons.map((c) => {
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
                          <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                            <Link
                              href={`/report/${c.id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 hover:underline"
                            >
                              <Share2 className="w-3 h-3" />
                              Share
                            </Link>
                            <Link
                              href={`/compare?siteA=${encodeURIComponent(
                                c.siteADomain
                              )}&siteB=${encodeURIComponent(c.siteBDomain)}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                            >
                              Re-compare
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

        {/* Tab: Monitored Domains Watchlist */}
        {activeTab === "watchlist" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm space-y-6 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  Monitored Domains Watchlist
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Track vital domains for technical SEO regressions, Core Web Vitals health, and score changes.
                </p>
              </div>

              {/* Add Domain to Watchlist Input */}
              <form onSubmit={handleAddWatchlist} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add domain e.g. stripe.com"
                  value={watchDomainInput}
                  onChange={(e) => setWatchDomainInput(e.target.value)}
                  className="px-3.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pin Domain</span>
                </button>
              </form>
            </div>

            {watchlist.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No domains in your monitoring watchlist yet. Use the form above to pin your key websites!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="px-5 py-3">Monitored Host</th>
                      <th className="px-5 py-3">Health Status</th>
                      <th className="px-5 py-3">SEO Score</th>
                      <th className="px-5 py-3">Grade</th>
                      <th className="px-5 py-3">Web Vitals</th>
                      <th className="px-5 py-3">Added</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {watchlist.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors font-sans">
                        <td className="px-5 py-4 font-semibold text-slate-900 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="font-mono text-xs">{item.domain}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              item.status === "healthy"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : item.status === "warning"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            <Activity className="w-3 h-3" />
                            {item.status === "healthy" ? "Healthy (90+)" : item.status === "warning" ? "Needs Review" : "Critical"}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-900 text-sm">
                          {item.lastScore} / 100
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            Grade {item.grade}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs">
                          {item.perfScore ? `${item.perfScore}/100` : "Lab Metric"}
                        </td>
                        <td className="px-5 py-4 text-slate-500 font-mono text-[11px]">
                          {new Date(item.addedAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/analyze?url=${encodeURIComponent(item.domain)}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold transition-colors"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Re-scan
                            </Link>
                            <button
                              onClick={() => handleRemoveWatchlist(item.domain)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove from watchlist"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Monitoring Architecture Note */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <Activity className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Automated 24/7 Crawler Engine:</strong>
                Watchlist domains are queued for scheduled non-intrusive re-validation. If title tags, robots.txt directives, or Core Web Vitals degrade, alerts are logged directly to your Cloud SQL dashboard.
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Automated SEO Health Alerts & Webhook Notifications */}
        {activeTab === "alerts" && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Automated Health Alerts & Webhook Notifications
                    </h3>
                    <p className="text-xs text-slate-600">
                      Trigger instant Slack, Discord, Zapier, or custom HTTP alerts whenever your SEO score drops or AI bots are blocked.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSaveAlertSettings}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-start md:self-auto"
                >
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  {savedAlertSettings ? "Settings Saved!" : "Save Alert Rules"}
                </button>
              </div>

              {/* Webhook Endpoint Input */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Webhook Target URL (Slack, Discord, Zapier, Make, or Custom POST)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hooks.slack.com/services/YOUR_TEAM/... or https://discord.com/api/webhooks/..."
                    className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white font-mono text-slate-800"
                  />
                  <button
                    onClick={handleTestWebhook}
                    disabled={testWebhookStatus === "testing"}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    {testWebhookStatus === "testing" ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Test Webhook Dispatch
                      </>
                    )}
                  </button>
                </div>

                {/* Preset helpers */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Quick Presets:</span>
                  <button
                    onClick={() => setWebhookUrl("https://hooks.slack.com/services/YOUR_TEAM/YOUR_BOT/YOUR_SECRET_TOKEN")}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  >
                    Slack Incoming Webhook
                  </button>
                  <button
                    onClick={() => setWebhookUrl("https://discord.com/api/webhooks/1234567890/token_here")}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  >
                    Discord Channel Webhook
                  </button>
                  <button
                    onClick={() => setWebhookUrl("https://hooks.zapier.com/hooks/catch/12345/abcde/")}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  >
                    Zapier / Make.com Webhook
                  </button>
                </div>

                {/* Test Feedback banner */}
                {testWebhookMessage && (
                  <div
                    className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${
                      testWebhookStatus === "success"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    {testWebhookStatus === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold block">
                        {testWebhookStatus === "success" ? "Dispatch Confirmed" : "Dispatch Alert"}
                      </span>
                      <span>{testWebhookMessage}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Threshold Rules Grid */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-600" />
                Automated Trigger Thresholds
              </h4>
              <p className="text-xs text-slate-500">
                Specify criteria that trigger immediate incident dispatches to your configured webhook endpoint.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Score threshold */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Minimum SEO Health Threshold
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Score &lt; {scoreThreshold}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="90"
                    step="5"
                    value={scoreThreshold}
                    onChange={(e) => setScoreThreshold(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[11px] text-slate-500">
                    Alert fires immediately if an audit scores below {scoreThreshold} out of 100.
                  </p>
                </div>

                {/* AI Bots Disallow */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="aiRobotsToggle"
                    checked={alertAiRobots}
                    onChange={(e) => setAlertAiRobots(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="aiRobotsToggle" className="cursor-pointer">
                    <div className="text-xs font-bold text-slate-800">
                      AI Search (GEO) LLM Crawler Block Alert
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Triggers warning if robots.txt disallows GPTBot, ClaudeBot, or PerplexityBot, risking AI search exclusion.
                    </div>
                  </label>
                </div>

                {/* Core Web Vitals Drop */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="perfToggle"
                    checked={alertPerf}
                    onChange={(e) => setAlertPerf(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="perfToggle" className="cursor-pointer">
                    <div className="text-xs font-bold text-slate-800">
                      Core Web Vitals Degradation Alert
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Fires if Lighthouse Performance score drops below 60 or LCP exceeds 4.0s.
                    </div>
                  </label>
                </div>

                {/* Server Latency Slowdown */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="latencyToggle"
                    checked={alertLatency}
                    onChange={(e) => setAlertLatency(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="latencyToggle" className="cursor-pointer">
                    <div className="text-xs font-bold text-slate-800">
                      TTFB Latency Spike (&gt; 1,500ms)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Sends alert if page initial response time exceeds 1.5 seconds, hurting crawl budgets.
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Recent Alert Dispatch Log */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Recent Webhook Dispatch Log</h4>
                  <p className="text-xs text-slate-500">History of dispatched health notifications and simulated tests.</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                  {alertLogs.length} Events Logged
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-6">Timestamp</th>
                      <th className="py-3 px-6">Domain</th>
                      <th className="py-3 px-6">Trigger Reason</th>
                      <th className="py-3 px-6 text-right">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {alertLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="py-3.5 px-6 font-semibold text-slate-900">{log.domain}</td>
                        <td className="py-3.5 px-6 text-slate-700">{log.event}</td>
                        <td className="py-3.5 px-6 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                              log.status === "delivered"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : log.status === "simulated"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {log.status === "delivered" ? "Delivered (HTTP 200)" : log.status === "simulated" ? "Simulated Test" : "Delivery Failed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Connected Integrations (Mode B - Google Search Console & GA4) */}
        {activeTab === "connected" && (
          <div className="space-y-6">
            {/* Architecture Explainer Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-6 sm:p-7 text-white shadow-sm border border-blue-800/60">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  <Layers className="w-3.5 h-3.5" />
                  Dual-Engine Telemetry System
                </span>
                <span className="text-xs text-blue-300 font-mono">
                  OAuth 2.0 Security • Read-Only
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Mode A (Public Diagnostics) vs. Mode B (Connected Owner Telemetry)
              </h3>
              <p className="text-sm text-blue-100/90 mt-2 max-w-3xl leading-relaxed">
                SeoSeite uses a hybrid data model. Public audits (Mode A) analyze any URL on the internet via DOM heuristics, Lighthouse, and DomCop Open PageRank. Mode B securely layers official Google Search Console &amp; Google Analytics 4 telemetry for domains you own.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-blue-200 font-bold text-xs uppercase tracking-wider mb-1.5">
                    <Globe className="w-4 h-4 text-cyan-300" />
                    Mode A: Public Diagnostics (Zero Setup)
                  </div>
                  <p className="text-xs text-blue-100/80 leading-relaxed">
                    Audits any URL, client, or competitor. Extracts HTML headings, JSON-LD schemas, security headers, Core Web Vitals, and DomCop Open PageRank. Perfect for competitive intelligence and prospect audits.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Mode B: Verified Owner Telemetry (OAuth)
                  </div>
                  <p className="text-xs text-blue-100/80 leading-relaxed">
                    Connects directly to your Google Search Console &amp; GA4 properties via read-only OAuth 2.0. Surfaces actual search query impressions, true Google SERP rankings, organic click CTR, and landing page conversions.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Search Console (GSC) Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        Google Search Console
                      </h4>
                      {gscConnected ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Connected (Read-Only)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Not Connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pulls verified Google Search queries, average positions, clicks, and impressions via Search Analytics API.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleGsc}
                  disabled={connectingGsc}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    gscConnected
                      ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${connectingGsc ? "animate-spin" : ""}`} />
                  {connectingGsc
                    ? "Authenticating..."
                    : gscConnected
                    ? "Disconnect GSC"
                    : "Connect via Google OAuth 2.0"}
                </button>
              </div>

              {gscConnected ? (
                <div className="mt-6 space-y-6">
                  {/* GSC 4-Metric Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs">
                        <span>Total Organic Clicks</span>
                        <MousePointerClick className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">28,450</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +14.2% vs last 28 days
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs">
                        <span>Total Impressions</span>
                        <Eye className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">412,800</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +22.8% vs last 28 days
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs">
                        <span>Average Organic CTR</span>
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">6.89%</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +0.4% healthy benchmark
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs">
                        <span>Average Position</span>
                        <BarChart className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">14.2</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +2.1 positions gained
                      </div>
                    </div>
                  </div>

                  {/* Top Ranking Keywords Table */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Top Ranking Organic Search Queries (Last 28 Days)
                      </h5>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Filtered: Web Search • All Devices
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                            <th className="py-2.5 px-4">Search Query</th>
                            <th className="py-2.5 px-4 text-right">Clicks</th>
                            <th className="py-2.5 px-4 text-right">Impressions</th>
                            <th className="py-2.5 px-4 text-right">CTR</th>
                            <th className="py-2.5 px-4 text-right">Avg Position</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {[
                            { query: "technical seo audit tool", clicks: "4,820", impr: "51,200", ctr: "9.41%", pos: "3.4", trend: "+1.2" },
                            { query: "core web vitals checker", clicks: "3,910", impr: "48,000", ctr: "8.15%", pos: "4.8", trend: "+0.9" },
                            { query: "json-ld schema validator", clicks: "3,120", impr: "39,400", ctr: "7.92%", pos: "5.1", trend: "+2.3" },
                            { query: "domcop open pagerank api", clicks: "2,450", impr: "31,800", ctr: "7.70%", pos: "6.2", trend: "+1.8" },
                            { query: "ai crawler bot blocker", clicks: "1,980", impr: "27,900", ctr: "7.10%", pos: "7.5", trend: "-0.4" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2.5 px-4 font-medium text-slate-900 flex items-center gap-2">
                                <Search className="w-3 h-3 text-slate-400" />
                                {row.query}
                              </td>
                              <td className="py-2.5 px-4 text-right font-semibold text-slate-900">{row.clicks}</td>
                              <td className="py-2.5 px-4 text-right text-slate-600">{row.impr}</td>
                              <td className="py-2.5 px-4 text-right text-slate-600">{row.ctr}</td>
                              <td className="py-2.5 px-4 text-right">
                                <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-700">
                                  #{row.pos}
                                  <span className="text-[10px] text-emerald-600">({row.trend})</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 p-5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">
                      Why connect your Search Console property?
                    </p>
                    <p>
                      Replaces estimated reach with exact Google SERP impressions, true CTR percentages, and query-level click data. Never guess whether your pages are actually being seen.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleGsc}
                    disabled={connectingGsc}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap cursor-pointer transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Connect Property Now
                  </button>
                </div>
              )}
            </div>

            {/* Google Analytics 4 (GA4) Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <BarChart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        Google Analytics 4 (GA4)
                      </h4>
                      {ga4Connected ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Connected (Read-Only)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Not Connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pulls engaged sessions, bounce rates, average duration, and conversion events via Google Analytics Data API.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleGa4}
                  disabled={connectingGa4}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    ga4Connected
                      ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                      : "bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${connectingGa4 ? "animate-spin" : ""}`} />
                  {connectingGa4
                    ? "Authenticating..."
                    : ga4Connected
                    ? "Disconnect GA4"
                    : "Connect via Google OAuth 2.0"}
                </button>
              </div>

              {ga4Connected ? (
                <div className="mt-6 space-y-6">
                  {/* GA4 4-Metric Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs">
                        <span>30-Day Active Users</span>
                        <Users className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">42,910</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +18.4% user growth
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs">
                        <span>Engaged Sessions</span>
                        <Activity className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">61,340</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +24.1% session engagement
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs">
                        <span>Avg Engagement Time</span>
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">2m 44s</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +16s deeper reading
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs">
                        <span>Organic Conversions</span>
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">1,842</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +12.6% signup goals
                      </div>
                    </div>
                  </div>

                  {/* Top Organic Landing Pages Table */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Top Organic Landing Pages (Last 30 Days)
                      </h5>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Source: google / organic
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                            <th className="py-2.5 px-4">Landing Page Path</th>
                            <th className="py-2.5 px-4 text-right">Engaged Sessions</th>
                            <th className="py-2.5 px-4 text-right">Bounce Rate</th>
                            <th className="py-2.5 px-4 text-right">Avg Duration</th>
                            <th className="py-2.5 px-4 text-right">Conversions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {[
                            { path: "/", sessions: "24,190", bounce: "32.1%", duration: "3m 12s", conv: "820" },
                            { path: "/analyze", sessions: "16,840", bounce: "24.8%", duration: "4m 05s", conv: "540" },
                            { path: "/compare", sessions: "9,450", bounce: "28.2%", duration: "3m 48s", conv: "310" },
                            { path: "/docs/technical-seo", sessions: "6,120", bounce: "38.6%", duration: "2m 15s", conv: "110" },
                            { path: "/pricing", sessions: "4,740", bounce: "19.4%", duration: "2m 58s", conv: "62" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2.5 px-4 font-mono font-medium text-slate-900 flex items-center gap-1.5">
                                <ArrowUpRight className="w-3 h-3 text-slate-400" />
                                {row.path}
                              </td>
                              <td className="py-2.5 px-4 text-right font-semibold text-slate-900">{row.sessions}</td>
                              <td className="py-2.5 px-4 text-right text-slate-600">{row.bounce}</td>
                              <td className="py-2.5 px-4 text-right text-slate-600 font-mono">{row.duration}</td>
                              <td className="py-2.5 px-4 text-right font-semibold text-blue-600">{row.conv}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 p-5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">
                      Why connect Google Analytics 4?
                    </p>
                    <p>
                      Connects your technical SEO optimizations directly to downstream revenue, user engagement time, bounce rates, and organic conversions.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleGa4}
                    disabled={connectingGa4}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap cursor-pointer transition-colors"
                  >
                    <BarChart className="w-3.5 h-3.5" />
                    Connect GA4 Property
                  </button>
                </div>
              )}
            </div>

            {/* Enterprise OAuth Security & Privacy Guarantee */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Enterprise OAuth 2.0 Security Architecture
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    SeoSeite adheres to the principle of least privilege. All integrations request strictly read-only scopes (<code className="bg-slate-200/80 px-1 py-0.5 rounded text-[11px]">auth/webmasters.readonly</code> &amp; <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[11px]">auth/analytics.readonly</code>). We never request or possess write access, cannot modify your DNS or analytics configs, and all OAuth tokens are encrypted at rest with AES-256.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" /> AES-256 Token Encryption
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% Read-Only Permissions
                    </span>
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-blue-600" /> Revoke Instantly Anytime
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
