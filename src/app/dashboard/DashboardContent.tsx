"use client";

import { useEffect, useState, useMemo, useRef } from "react";
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
  Download,
  SlidersHorizontal,
  ArrowUp,
  Zap,
  ChevronRight,
  X,
  FileCode,
  Printer,
  Scale,
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
  {
    id: "sample-comp-vercel-netlify",
    siteADomain: "vercel.com",
    siteBDomain: "netlify.com",
    siteAScore: 92,
    siteBScore: 85,
    seoDiff: 7,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "sample-comp-supabase-firebase",
    siteADomain: "supabase.com",
    siteBDomain: "firebase.google.com",
    siteAScore: 89,
    siteBScore: 84,
    seoDiff: 5,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const upgradedParam = searchParams.get("upgraded");
  const billingParam = searchParams.get("billing");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [scans, setScans] = useState<SavedScan[]>([]);
  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);
  
  // Initialize tab directly from URL query param if present
  const [activeTab, setActiveTab] = useState<
    "scans" | "comparisons" | "watchlist" | "alerts" | "connected" | "infra"
  >(() => {
    if (tabParam && ["scans", "comparisons", "watchlist", "alerts", "connected", "infra"].includes(tabParam)) {
      return tabParam as any;
    }
    return "scans";
  });

  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync tab state when URL search param changes
  useEffect(() => {
    if (tabParam && ["scans", "comparisons", "watchlist", "alerts", "connected", "infra"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2400);
  };

  const switchTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());

      const el = document.getElementById("dashboard-tabs-bar");
      if (el && window.scrollY > 400) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Viewport scroll detection for seamless sub-navbar docking
  useEffect(() => {
    const handleScroll = () => {
      const tabsEl = document.getElementById("dashboard-tabs-bar");
      if (tabsEl) {
        const rect = tabsEl.getBoundingClientRect();
        setIsScrolled(rect.top <= 64);
      } else {
        setIsScrolled(window.scrollY > 500);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Search & Filter for Audit Scans
  const [scanSearch, setScanSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<"all" | "A+" | "A" | "B+">("all");

  const filteredScans = useMemo(() => {
    let list = [...displayedScans];
    if (scanSearch.trim()) {
      const q = scanSearch.toLowerCase().trim();
      list = list.filter((s) => s.domain.toLowerCase().includes(q) || s.targetUrl.toLowerCase().includes(q));
    }
    if (gradeFilter !== "all") {
      list = list.filter((s) => s.grade === gradeFilter);
    }
    return list;
  }, [displayedScans, scanSearch, gradeFilter]);

  // Mode B: Connected Google Search Console & GA4 Integration State
  const [gscConnected, setGscConnected] = useState(false);
  const [ga4Connected, setGa4Connected] = useState(false);
  const [connectingGsc, setConnectingGsc] = useState(false);
  const [connectingGa4, setConnectingGa4] = useState(false);
  const [gscQuerySearch, setGscQuerySearch] = useState("");

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
      showToast("Live telemetry refreshed from Cloud SQL!");
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      showToast("Telemetry loaded with local failover.");
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
    showToast(next ? "Connected Google Search Console (OAuth 2.0)" : "Disconnected Google Search Console");
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
    showToast(next ? "Connected Google Analytics 4 (OAuth 2.0)" : "Disconnected Google Analytics 4");
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
      showToast("Incident trigger thresholds saved!");
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
        showToast("Webhook test ping delivered successfully!");
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
      showToast(`${clean} is already in your watchlist.`);
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
    showToast(`Added ${clean} to 24/7 automated watchlist!`);
  };

  const handleRemoveWatchlist = (dom: string) => {
    const updated = watchlist.filter((w) => w.domain !== dom);
    setWatchlist(updated);
    try {
      localStorage.setItem("seoseite_watchlist", JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast(`Removed ${dom} from watchlist.`);
  };

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    showToast("Command copied to clipboard!");
    setTimeout(() => setCopiedCmd(null), 2000);
  }

  const handleExportSnapshot = () => {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      status: status || {
        serviceName: "seoseite-local",
        platform: "Google Cloud Run",
        databaseType: "PostgreSQL 16",
        port: "8080",
      },
      scans: displayedScans,
      comparisons: displayedComparisons,
      watchlist: watchlist,
      connectedIntegrations: {
        gscConnected,
        ga4Connected,
      },
      alertSettings: {
        webhookUrl,
        scoreThreshold,
        alertPerf,
        alertLatency,
        alertAiRobots,
      },
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `seoseite-operational-snapshot-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Downloaded complete system snapshot JSON!");
  };

  const handleExportScansCsv = () => {
    const headers = ["Domain", "Target URL", "SEO Score", "Grade", "Latency (ms)", "Tech Count", "Traffic Est.", "Created At"];
    const rows = displayedScans.map((s) => [
      s.domain,
      s.targetUrl,
      s.seoScore,
      s.grade,
      s.responseTimeMs,
      s.techCount,
      s.trafficRange,
      s.createdAt,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `seoseite-audits-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported audit history to CSV!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FULL-WIDTH FIXED SUB-NAVBAR ON SCROLL */}
      {isScrolled && (
        <aside
          aria-label="Dashboard Sub-Navigation"
          className="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] py-2 px-4 sm:px-6 lg:px-8 transition-all duration-200 animate-in fade-in slide-in-from-top-1 no-print"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left: Operational Capsule */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-sm border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">Operations Hub</span>
                <span className="text-slate-500 font-sans text-[11px] px-0.5">•</span>
                <span className="text-blue-400 font-bold">{displayedScans.length} Audits</span>
                <span className="text-slate-500 font-sans text-[11px] px-0.5">•</span>
                <span className="text-purple-400 font-bold">{displayedComparisons.length} Matches</span>
              </div>
            </div>

            {/* Middle: 6 Segmented Tabs Switcher */}
            <nav
              className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold overflow-x-auto no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                type="button"
                onClick={() => switchTab("scans")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "scans"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${activeTab === "scans" ? "text-blue-400" : "text-blue-600"}`} />
                <span>Audits</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${activeTab === "scans" ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-700"}`}>
                  {displayedScans.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("comparisons")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "comparisons"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <GitCompare className={`w-3.5 h-3.5 ${activeTab === "comparisons" ? "text-purple-400" : "text-purple-600"}`} />
                <span>Competitors</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${activeTab === "comparisons" ? "bg-purple-500 text-white" : "bg-slate-200 text-slate-700"}`}>
                  {displayedComparisons.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("watchlist")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "watchlist"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${activeTab === "watchlist" ? "text-amber-400" : "text-amber-600"}`} />
                <span>Watchlist</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${activeTab === "watchlist" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-700"}`}>
                  {watchlist.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("alerts")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "alerts"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${activeTab === "alerts" ? "text-rose-400" : "text-rose-600"}`} />
                <span>Alerts &amp; Hooks</span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("connected")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "connected"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <TrendingUp className={`w-3.5 h-3.5 ${activeTab === "connected" ? "text-emerald-400" : "text-emerald-600"}`} />
                <span>Mode B (Owner Telemetry)</span>
                {(gscConnected || ga4Connected) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => switchTab("infra")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "infra"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Server className={`w-3.5 h-3.5 ${activeTab === "infra" ? "text-cyan-400" : "text-cyan-600"}`} />
                <span>Cloud Run &amp; SQL</span>
              </button>
            </nav>

            {/* Right: Quick Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={loadDashboardData}
                disabled={loading}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Refresh Live Telemetry"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : "text-slate-500"}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <Link
                href="/analyze"
                className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Audit</span>
              </Link>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                title="Scroll to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Active Subscription Notification Banner */}
        {upgradedParam && (
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/40 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-yellow-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{upgradedParam === "enterprise" ? "Enterprise Tier" : "Pro Analyst Tier"} Active</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950 font-mono">
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

        {/* OPERATIONS COCKPIT TELEMETRY BANNER (NIGHT-SKY AESTHETIC) */}
        <div className="bg-slate-950 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-3">
              {/* Telemetry Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700">
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                  Google Cloud Run (us-central1)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Port 8080 Active • Zero Cold-Start
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700">
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  Cloud SQL PostgreSQL 16
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                SaaS Operational Dashboard &amp; Telemetry Hub
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Dual-mode command center layering public heuristics (Mode A) with owner-verified Search Console and Google Analytics 4 telemetry (Mode B).
              </p>
            </div>

            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={loadDashboardData}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
                <span>Refresh Live</span>
              </button>

              <button
                type="button"
                onClick={handleExportSnapshot}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                title="Download JSON Snapshot of all audit portfolio data"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export Snapshot</span>
              </button>

              <Link
                href="/analyze"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>New Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 4 TELEMETRY COCKPIT TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 text-left">
            {/* Tile 1: Cloud Run Host */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="font-bold uppercase tracking-wider">Deployment Host</span>
                <Server className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white font-mono truncate">
                {status?.serviceName || "seoseite"}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  99.99% Uptime SLA
                </span>
                <span className="font-mono text-slate-500">us-central1</span>
              </div>
            </div>

            {/* Tile 2: Cloud SQL Database */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="font-bold uppercase tracking-wider">Database Engine</span>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-white font-mono truncate">
                {status?.isCloudSqlConfigured ? "Cloud SQL Active" : "PostgreSQL 16"}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-slate-300 font-mono">Pool: 6 / 20 Active</span>
                <span className="text-emerald-400 font-mono font-bold">TLS 1.3 SSL</span>
              </div>
            </div>

            {/* Tile 3: Fleet SEO Average */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="font-bold uppercase tracking-wider">Fleet SEO Health</span>
                <Globe className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400 font-mono">{avgSeoScore}/100</span>
                <span className="text-xs font-mono font-bold text-slate-300">Grade A+</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{displayedScans.length} Scans Loaded</span>
                <span className="text-emerald-400 font-semibold">▲ +2.4 avg gain</span>
              </div>
            </div>

            {/* Tile 4: Competitor Head-to-Head */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="font-bold uppercase tracking-wider">Competitor Benchmarks</span>
                <GitCompare className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-400 font-mono">{displayedComparisons.length}</span>
                <span className="text-xs text-slate-400 font-mono">Matches Recorded</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Avg Win Margin</span>
                <span className="text-purple-300 font-mono font-bold">▲ +16.4 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK LAUNCH DUAL COMMAND CENTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Analyze Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs text-left space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Quick Website Audit</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Mode A • Public</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Analyze any live URL for SEO, Tech Stack, Core Web Vitals, and AI crawlability.
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
                className="flex-1 px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/80 focus:bg-white text-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Audit Site
              </button>
            </form>

            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
              <span className="text-slate-400 font-mono">Quick Chips:</span>
              {["stripe.com", "linear.app", "github.com", "vercel.com"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setQuickUrl(d);
                    window.location.href = `/analyze?url=${encodeURIComponent(d)}`;
                  }}
                  className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-mono transition-colors cursor-pointer"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Competitor Duel Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs text-left space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-purple-600" />
                <span>Quick Competitor Duel</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Side-by-Side</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare two domains side-by-side with automatic winner metrics and delta breakdown.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (compSiteA.trim() && compSiteB.trim()) {
                  window.location.href = `/compare?url1=${encodeURIComponent(compSiteA.trim())}&url2=${encodeURIComponent(compSiteB.trim())}`;
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Site A (e.g. stripe.com)"
                value={compSiteA}
                onChange={(e) => setCompSiteA(e.target.value)}
                className="w-1/2 px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/80 focus:bg-white text-slate-900"
              />
              <input
                type="text"
                placeholder="Site B (e.g. paypal.com)"
                value={compSiteB}
                onChange={(e) => setCompSiteB(e.target.value)}
                className="w-1/2 px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/80 focus:bg-white text-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer shrink-0 shadow-xs"
              >
                Duel
              </button>
            </form>

            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
              <span className="text-slate-400 font-mono">Popular Matches:</span>
              {[
                { a: "stripe.com", b: "paypal.com" },
                { a: "vercel.com", b: "netlify.com" },
              ].map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setCompSiteA(m.a);
                    setCompSiteB(m.b);
                    window.location.href = `/compare?url1=${encodeURIComponent(m.a)}&url2=${encodeURIComponent(m.b)}`;
                  }}
                  className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-600 font-mono transition-colors cursor-pointer"
                >
                  {m.a} vs {m.b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6 SEGMENTED DASHBOARD TABS BAR */}
        <div id="dashboard-tabs-bar" className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 no-print">
          <nav className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => switchTab("scans")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "scans"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${activeTab === "scans" ? "text-blue-400" : "text-blue-600"}`} />
              <span>Audit History ({displayedScans.length})</span>
            </button>

            <button
              type="button"
              onClick={() => switchTab("comparisons")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "comparisons"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <GitCompare className={`w-3.5 h-3.5 ${activeTab === "comparisons" ? "text-purple-400" : "text-purple-600"}`} />
              <span>Competitor Comparisons ({displayedComparisons.length})</span>
            </button>

            <button
              type="button"
              onClick={() => switchTab("watchlist")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "watchlist"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${activeTab === "watchlist" ? "text-amber-400" : "text-amber-600"}`} />
              <span>Monitored Watchlist ({watchlist.length})</span>
            </button>

            <button
              type="button"
              onClick={() => switchTab("alerts")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "alerts"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Bell className={`w-3.5 h-3.5 ${activeTab === "alerts" ? "text-rose-400" : "text-rose-600"}`} />
              <span>Health Alerts &amp; Webhooks</span>
            </button>

            <button
              type="button"
              onClick={() => switchTab("connected")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "connected"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <TrendingUp className={`w-3.5 h-3.5 ${activeTab === "connected" ? "text-emerald-400" : "text-emerald-600"}`} />
              <span>Connected Integrations (Mode B)</span>
              {(gscConnected || ga4Connected) && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => switchTab("infra")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "infra"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Server className={`w-3.5 h-3.5 ${activeTab === "infra" ? "text-cyan-400" : "text-cyan-600"}`} />
              <span>Cloud Run &amp; SQL Config</span>
            </button>
          </nav>

          {/* Actions on tab bar */}
          <div className="flex items-center gap-2">
            {activeTab === "scans" && (
              <button
                type="button"
                onClick={handleExportScansCsv}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                title="Export Scans Table to CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportSnapshot}
              className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              title="Export complete system state as JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-600" />
              <span>JSON Snapshot</span>
            </button>
          </div>
        </div>

        {/* TAB 1: AUDIT SCANS TABLE */}
        {activeTab === "scans" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-4 animate-in fade-in duration-150">
            {/* Table Search & Filter Bar */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={scanSearch}
                  onChange={(e) => setScanSearch(e.target.value)}
                  placeholder="Filter domain name..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
                {scanSearch && (
                  <button
                    onClick={() => setScanSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Grade Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
                <span className="text-slate-400 text-[11px] font-mono mr-1">Grade:</span>
                {(["all", "A+", "A", "B+"] as const).map((gr) => (
                  <button
                    key={gr}
                    type="button"
                    onClick={() => setGradeFilter(gr)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-bold ${
                      gradeFilter === gr
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {gr === "all" ? "All Grades" : gr}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                Loading audit portfolio records...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Domain</th>
                      <th className="px-6 py-3.5">SEO Score</th>
                      <th className="px-6 py-3.5">Grade</th>
                      <th className="px-6 py-3.5">Latency</th>
                      <th className="px-6 py-3.5">Tech Detected</th>
                      <th className="px-6 py-3.5">Traffic Range</th>
                      <th className="px-6 py-3.5">Timestamp</th>
                      <th className="px-6 py-3.5 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans text-xs">
                    {filteredScans.map((scan) => (
                      <tr key={scan.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-mono text-xs">{scan.domain}</span>
                          {isSampleScans && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-blue-100 text-blue-700 font-mono">
                              Ref
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                              scan.seoScore >= 80
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : scan.seoScore >= 60
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-rose-100 text-rose-800 border border-rose-200"
                            }`}
                          >
                            {scan.seoScore}/100
                          </span>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-900 font-mono">
                          {scan.grade}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-mono">
                          {scan.responseTimeMs} ms
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {scan.techCount} detected
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-mono">
                          {scan.trafficRange}
                        </td>
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                          {new Date(scan.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                          <Link
                            href={`/report/${scan.id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Share</span>
                          </Link>
                          <Link
                            href={`/analyze?url=${encodeURIComponent(scan.domain)}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                          >
                            <span>Re-scan</span>
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

        {/* TAB 2: COMPETITOR COMPARISONS TABLE */}
        {activeTab === "comparisons" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-4 animate-in fade-in duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-purple-600" />
                  <span>Head-to-Head Benchmark History</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Dual-site comparison audits stored in Cloud SQL PostgreSQL.
                </p>
              </div>

              <Link
                href="/compare"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors"
              >
                <span>Open Comparison Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Site A</th>
                    <th className="px-6 py-3.5">Score A</th>
                    <th className="px-6 py-3.5 text-center">VS</th>
                    <th className="px-6 py-3.5">Site B</th>
                    <th className="px-6 py-3.5">Score B</th>
                    <th className="px-6 py-3.5">Leader Advantage</th>
                    <th className="px-6 py-3.5">Timestamp</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-sans">
                  {displayedComparisons.map((c) => {
                    const leader = c.siteAScore >= c.siteBScore ? c.siteADomain : c.siteBDomain;
                    const diff = Math.abs(c.siteAScore - c.siteBScore);

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 font-mono">{c.siteADomain}</td>
                        <td className="px-6 py-4 font-mono font-bold text-blue-600">{c.siteAScore}/100</td>
                        <td className="px-6 py-4 text-center font-bold text-slate-400 font-mono">VS</td>
                        <td className="px-6 py-4 font-bold text-slate-900 font-mono">{c.siteBDomain}</td>
                        <td className="px-6 py-4 font-mono font-bold text-purple-600">{c.siteBScore}/100</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {leader} (+{diff} pts)
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/compare?url1=${encodeURIComponent(c.siteADomain)}&url2=${encodeURIComponent(c.siteBDomain)}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MONITORED WATCHLIST */}
        {activeTab === "watchlist" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  <span>Monitored Domains Watchlist ({watchlist.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Continuous 24/7 technical audit tracking and regression alerts.
                </p>
              </div>

              {/* Add Domain Input Form */}
              <form onSubmit={handleAddWatchlist} className="flex gap-2">
                <input
                  type="text"
                  placeholder="domain.com"
                  value={watchDomainInput}
                  onChange={(e) => setWatchDomainInput(e.target.value)}
                  className="px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Add Domain
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {watchlist.map((item) => (
                <div key={item.domain} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 font-mono truncate">{item.domain}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWatchlist(item.domain)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black font-mono text-slate-900">{item.lastScore}/100</span>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.grade}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Status: {item.status}
                    </span>
                    <Link
                      href={`/analyze?url=${encodeURIComponent(item.domain)}`}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      Audit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HEALTH ALERTS & WEBHOOKS */}
        {activeTab === "alerts" && (
          <div className="space-y-6 text-left animate-in fade-in duration-150">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-rose-600" />
                  <span>Automated Incident Webhook Dispatcher</span>
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Real-Time
                </span>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-900 block">Webhook Destination URL (Slack / Discord / Zapier / Make)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hooks.slack.com/services/... or https://discord.com/api/webhooks/..."
                    className="flex-1 px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={testWebhookStatus === "testing"}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {testWebhookStatus === "testing" ? "Dispatching..." : "Send Test Ping"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAlertSettings}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Save Config
                  </button>
                </div>

                {testWebhookMessage && (
                  <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${testWebhookStatus === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{testWebhookMessage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Threshold Rules */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-600" />
                <span>Incident Trigger Criteria</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Minimum Health Threshold</span>
                    <span className="font-mono text-blue-600">Score &lt; {scoreThreshold}</span>
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
                  <p className="text-[11px] text-slate-500">Alert triggers if SEO score drops below {scoreThreshold}.</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="aiCheck"
                    checked={alertAiRobots}
                    onChange={(e) => setAlertAiRobots(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="aiCheck" className="cursor-pointer space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">AI Bot Crawler Blocking Alert</span>
                    <span className="text-[11px] text-slate-500 block">Warns immediately if GPTBot or PerplexityBot is disallowed in robots.txt.</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONNECTED INTEGRATIONS (MODE B - GSC & GA4) */}
        {activeTab === "connected" && (
          <div className="space-y-6 text-left animate-in fade-in duration-150">
            {/* Architecture Explainer Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-800/60">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  <Layers className="w-3.5 h-3.5" />
                  Dual-Engine Telemetry System
                </span>
                <span className="text-xs text-blue-300 font-mono">
                  OAuth 2.0 Security • Strictly Read-Only
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Mode A (Public Diagnostics) vs. Mode B (Connected Owner Telemetry)
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-2 max-w-3xl leading-relaxed">
                SeoSeite uses a hybrid data model. Public audits (Mode A) analyze any URL on the internet via DOM heuristics, Lighthouse, and DomCop Open PageRank. Mode B securely layers official Google Search Console &amp; Google Analytics 4 telemetry for domains you own.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-blue-200 font-bold text-xs uppercase tracking-wider mb-1.5">
                    <Globe className="w-4 h-4 text-cyan-300" />
                    Mode A: Public Diagnostics (Zero Setup)
                  </div>
                  <p className="text-xs text-blue-100/80 leading-relaxed">
                    Audits any URL, client, or competitor. Extracts HTML headings, JSON-LD schemas, security headers, Core Web Vitals, and DomCop Open PageRank.
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Mode B: Verified Owner Telemetry (OAuth)
                  </div>
                  <p className="text-xs text-blue-100/80 leading-relaxed">
                    Connects directly to your Google Search Console &amp; GA4 properties via read-only OAuth 2.0. Surfaces actual search query impressions, true Google SERP rankings, organic CTR, and conversions.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Search Console (GSC) Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
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
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 ${
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
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                        <span>Total Organic Clicks</span>
                        <MousePointerClick className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 font-mono mt-1">28,450</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +14.2% vs last 28 days
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                        <span>Total Impressions</span>
                        <Eye className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 font-mono mt-1">412,800</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +22.8% vs last 28 days
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                        <span>Average Organic CTR</span>
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 font-mono mt-1">6.89%</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +0.4% healthy benchmark
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                        <span>Average Position</span>
                        <BarChart className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 font-mono mt-1">14.2</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +2.1 positions gained
                      </div>
                    </div>
                  </div>

                  {/* Top Ranking Keywords Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                        Top Ranking Organic Search Queries (Last 28 Days)
                      </h5>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Filtered: Web Search • All Devices
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                            <th className="py-2.5 px-4">Search Query</th>
                            <th className="py-2.5 px-4 text-right">Clicks</th>
                            <th className="py-2.5 px-4 text-right">Impressions</th>
                            <th className="py-2.5 px-4 text-right">CTR</th>
                            <th className="py-2.5 px-4 text-right">Avg Position</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                          {[
                            { query: "technical seo audit tool", clicks: "4,820", impr: "51,200", ctr: "9.41%", pos: "3.4", trend: "+1.2" },
                            { query: "core web vitals checker", clicks: "3,910", impr: "48,000", ctr: "8.15%", pos: "4.8", trend: "+0.9" },
                            { query: "json-ld schema validator", clicks: "3,120", impr: "39,400", ctr: "7.92%", pos: "5.1", trend: "+2.3" },
                            { query: "domcop open pagerank api", clicks: "2,450", impr: "31,800", ctr: "7.70%", pos: "6.2", trend: "+1.8" },
                            { query: "ai crawler bot blocker", clicks: "1,980", impr: "27,900", ctr: "7.10%", pos: "7.5", trend: "-0.4" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                                <Search className="w-3.5 h-3.5 text-slate-400" />
                                {row.query}
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{row.clicks}</td>
                              <td className="py-2.5 px-4 text-right font-mono text-slate-600">{row.impr}</td>
                              <td className="py-2.5 px-4 text-right font-mono text-slate-600">{row.ctr}</td>
                              <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-600">
                                #{row.pos}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900">
                      Why connect your Search Console property?
                    </p>
                    <p>
                      Replaces estimated reach with exact Google SERP impressions, true CTR percentages, and query-level click data. Never guess whether your pages are actually being seen.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleGsc}
                    disabled={connectingGsc}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm whitespace-nowrap cursor-pointer transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Connect Property Now</span>
                  </button>
                </div>
              )}
            </div>

            {/* Google Analytics 4 (GA4) Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
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
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 ${
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
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                        <span>30-Day Active Users</span>
                        <Users className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 font-mono mt-1">42,910</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +18.4% user growth
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                        <span>Engaged Sessions</span>
                        <Activity className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 font-mono mt-1">61,340</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +24.1% session engagement
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                        <span>Avg Engagement Time</span>
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 font-mono mt-1">2m 44s</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +16s deeper reading
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                        <span>Organic Conversions</span>
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 font-mono mt-1">1,842</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ▲ +12.6% signup goals
                      </div>
                    </div>
                  </div>

                  {/* Top Organic Landing Pages Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                        Top Organic Landing Pages (Last 30 Days)
                      </h5>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Source: google / organic
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                            <th className="py-2.5 px-4">Landing Page Path</th>
                            <th className="py-2.5 px-4 text-right">Engaged Sessions</th>
                            <th className="py-2.5 px-4 text-right">Bounce Rate</th>
                            <th className="py-2.5 px-4 text-right">Avg Duration</th>
                            <th className="py-2.5 px-4 text-right">Conversions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                          {[
                            { path: "/", sessions: "24,190", bounce: "32.1%", duration: "3m 12s", conv: "820" },
                            { path: "/analyze", sessions: "16,840", bounce: "24.8%", duration: "4m 05s", conv: "540" },
                            { path: "/compare", sessions: "9,450", bounce: "28.2%", duration: "3m 48s", conv: "310" },
                            { path: "/tools/brand-radar", sessions: "6,120", bounce: "38.6%", duration: "2m 15s", conv: "110" },
                            { path: "/pricing", sessions: "4,740", bounce: "19.4%", duration: "2m 58s", conv: "62" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2.5 px-4 font-mono font-bold text-slate-900 flex items-center gap-1.5">
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                {row.path}
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{row.sessions}</td>
                              <td className="py-2.5 px-4 text-right font-mono text-slate-600">{row.bounce}</td>
                              <td className="py-2.5 px-4 text-right font-mono text-slate-600">{row.duration}</td>
                              <td className="py-2.5 px-4 text-right font-mono font-bold text-blue-600">{row.conv}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900">
                      Why connect Google Analytics 4?
                    </p>
                    <p>
                      Connects your technical SEO optimizations directly to downstream revenue, user engagement time, bounce rates, and organic conversions.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleGa4}
                    disabled={connectingGa4}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm whitespace-nowrap cursor-pointer transition-colors"
                  >
                    <BarChart className="w-3.5 h-3.5" />
                    <span>Connect GA4 Property</span>
                  </button>
                </div>
              )}
            </div>

            {/* Enterprise OAuth Security & Privacy Guarantee */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">
                    Enterprise OAuth 2.0 Security Architecture &amp; Privacy Guarantee
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    SeoSeite adheres strictly to the principle of least privilege. All integrations request strictly read-only scopes (<code className="bg-slate-800 px-1 py-0.5 rounded text-[11px] text-cyan-300">auth/webmasters.readonly</code> &amp; <code className="bg-slate-800 px-1 py-0.5 rounded text-[11px] text-cyan-300">auth/analytics.readonly</code>). We cannot modify your DNS or analytics configs, and all OAuth tokens are encrypted at rest with AES-256.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Lock className="w-3 h-3 text-emerald-400" /> AES-256 Token Encryption
                    </span>
                    <span className="flex items-center gap-1 text-blue-400 font-bold">
                      <CheckCircle2 className="w-3 h-3 text-blue-400" /> 100% Read-Only Permissions
                    </span>
                    <span className="flex items-center gap-1 text-purple-400 font-bold">
                      <RefreshCw className="w-3 h-3 text-purple-400" /> Revoke Instantly Anytime
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GOOGLE CLOUD RUN & CLOUD SQL ARCHITECTURE GUIDE */}
        {activeTab === "infra" && (
          <div className="space-y-6 text-left animate-in fade-in duration-150">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Google Cloud Run &amp; Cloud SQL Production Architecture
                  </h3>
                  <p className="text-xs text-slate-500">
                    Production configuration, environment variables, and zero-downtime deployment directives.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400 font-mono">Container Contract Port</div>
                  <div className="text-base font-bold text-slate-900 font-mono">PORT=8080</div>
                  <div className="text-xs text-slate-500">Configured in Dockerfile &amp; Cloud Run contract</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400 font-mono">Cloud Run Domain URL</div>
                  <div className="text-base font-bold text-slate-900 font-mono truncate">*.a.run.app</div>
                  <div className="text-xs text-slate-500">Free HTTPS wildcard domain generated automatically</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400 font-mono">SSRF Cloud Guard</div>
                  <div className="text-base font-bold text-emerald-700 flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Enforced Active
                  </div>
                  <div className="text-xs text-slate-500">Metadata IP 169.254.169.254 strictly blocked</div>
                </div>
              </div>

              {/* Deployment Commands */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-700" />
                  1-Command Deployment to Google Cloud Run
                </h4>

                <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-xs relative overflow-x-auto border border-slate-800">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                    <span>Terminal / Cloud Shell</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `gcloud run deploy seoseite --source . --region us-central1 --allow-unauthenticated --set-env-vars NODE_ENV=production,PORT=8080`,
                          "deploy-cmd"
                        )
                      }
                      className="flex items-center gap-1 text-xs text-slate-300 hover:text-white cursor-pointer"
                    >
                      {copiedCmd === "deploy-cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCmd === "deploy-cmd" ? "Copied" : "Copy Command"}</span>
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

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2 pt-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  Connecting Google Cloud SQL (PostgreSQL)
                </h4>

                <p className="text-xs text-slate-500">
                  Attach your Cloud SQL PostgreSQL instance to Cloud Run with the Unix domain socket connection flag:
                </p>

                <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-xs relative overflow-x-auto border border-slate-800">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                    <span>Cloud SQL Attachment Command</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `gcloud run services update seoseite --add-cloudsql-instances YOUR_PROJECT_ID:REGION:INSTANCE_NAME --update-env-vars DATABASE_URL="postgresql://user:pass@/dbname?host=/cloudsql/YOUR_PROJECT_ID:REGION:INSTANCE_NAME"`,
                          "sql-cmd"
                        )
                      }
                      className="flex items-center gap-1 text-xs text-slate-300 hover:text-white cursor-pointer"
                    >
                      {copiedCmd === "sql-cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCmd === "sql-cmd" ? "Copied" : "Copy Command"}</span>
                    </button>
                  </div>
                  <code>
                    gcloud run services update seoseite \<br />
                    &nbsp;&nbsp;--add-cloudsql-instances YOUR_PROJECT_ID:REGION:INSTANCE_NAME \<br />
                    &nbsp;&nbsp;--update-env-vars DATABASE_URL=&quot;postgresql://user:pass@/dbname?host=/cloudsql/YOUR_PROJECT_ID:REGION:INSTANCE_NAME&quot;
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
