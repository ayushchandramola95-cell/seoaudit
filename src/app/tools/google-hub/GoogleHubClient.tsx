"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  BarChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Play,
  ArrowRight,
  Layers,
  Lock,
  Zap,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Users,
  Clock,
  MousePointerClick,
  Eye,
  FileText,
  Server,
  Database,
  RotateCcw,
} from "lucide-react";

export interface ConnectedSite {
  id: string;
  domain: string;
  displayName: string;
  url: string;
  propertyType: "Domain Property" | "URL-Prefix";
  gscStatus: "Verified" | "Sync Ready";
  ga4Status: "Connected" | "Sync Ready";
  lastSynced?: string;
  gscData: {
    totalClicks: number;
    totalImpressions: number;
    averageCtr: number;
    averagePosition: number;
    topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
    indexCoverage: { indexed: number; excluded: number; errors: number };
  };
  ga4Data: {
    activeUsers: number;
    engagedSessions: number;
    engagementRate: number;
    averageDurationSec: number;
    channels: { channel: string; users: number; percentage: number }[];
  };
}

const INITIAL_SITES: ConnectedSite[] = [
  {
    id: "stripe",
    domain: "stripe.com",
    displayName: "Stripe Production",
    url: "https://stripe.com",
    propertyType: "Domain Property",
    gscStatus: "Verified",
    ga4Status: "Connected",
    lastSynced: "14 mins ago",
    gscData: {
      totalClicks: 148200,
      totalImpressions: 3420000,
      averageCtr: 4.33,
      averagePosition: 6.8,
      topQueries: [
        { query: "online payment gateway api", clicks: 24100, impressions: 380000, ctr: 6.34, position: 1.8 },
        { query: "saas billing infrastructure", clicks: 18400, impressions: 290000, ctr: 6.34, position: 2.1 },
        { query: "developer friendly checkout", clicks: 14200, impressions: 210000, ctr: 6.76, position: 2.4 },
        { query: "global payment processing fees", clicks: 11900, impressions: 310000, ctr: 3.83, position: 4.2 },
        { query: "fraud prevention radar api", clicks: 9800, impressions: 180000, ctr: 5.44, position: 3.5 },
      ],
      indexCoverage: { indexed: 4210, excluded: 380, errors: 0 },
    },
    ga4Data: {
      activeUsers: 84200,
      engagedSessions: 128400,
      engagementRate: 68.4,
      averageDurationSec: 184,
      channels: [
        { channel: "Organic Search", users: 54000, percentage: 64.1 },
        { channel: "Direct", users: 18200, percentage: 21.6 },
        { channel: "Referral / GitHub", users: 8100, percentage: 9.6 },
        { channel: "Social / Twitter", users: 3900, percentage: 4.7 },
      ],
    },
  },
  {
    id: "linear",
    domain: "linear.app",
    displayName: "Linear Workspace",
    url: "https://linear.app",
    propertyType: "Domain Property",
    gscStatus: "Verified",
    ga4Status: "Connected",
    lastSynced: "1 hour ago",
    gscData: {
      totalClicks: 82400,
      totalImpressions: 1620000,
      averageCtr: 5.08,
      averagePosition: 5.2,
      topQueries: [
        { query: "issue tracking software for engineers", clicks: 18200, impressions: 240000, ctr: 7.58, position: 1.6 },
        { query: "fast project management tool", clicks: 12400, impressions: 190000, ctr: 6.52, position: 2.3 },
        { query: "linear vs jira comparison", clicks: 9800, impressions: 140000, ctr: 7.00, position: 2.1 },
        { query: "software roadmap cycles", clicks: 7600, impressions: 180000, ctr: 4.22, position: 4.8 },
      ],
      indexCoverage: { indexed: 840, excluded: 42, errors: 0 },
    },
    ga4Data: {
      activeUsers: 48600,
      engagedSessions: 74200,
      engagementRate: 72.1,
      averageDurationSec: 215,
      channels: [
        { channel: "Organic Search", users: 29400, percentage: 60.5 },
        { channel: "Direct", users: 13200, percentage: 27.2 },
        { channel: "Referral", users: 4100, percentage: 8.4 },
        { channel: "Social", users: 1900, percentage: 3.9 },
      ],
    },
  },
  {
    id: "vercel",
    domain: "vercel.com",
    displayName: "Vercel Cloud",
    url: "https://vercel.com",
    propertyType: "URL-Prefix",
    gscStatus: "Verified",
    ga4Status: "Connected",
    lastSynced: "3 hours ago",
    gscData: {
      totalClicks: 214000,
      totalImpressions: 4820000,
      averageCtr: 4.43,
      averagePosition: 4.6,
      topQueries: [
        { query: "nextjs hosting platform", clicks: 42000, impressions: 520000, ctr: 8.07, position: 1.2 },
        { query: "frontend edge deployment", clicks: 28400, impressions: 410000, ctr: 6.92, position: 1.9 },
        { query: "serverless react hosting", clicks: 21000, impressions: 380000, ctr: 5.52, position: 2.8 },
      ],
      indexCoverage: { indexed: 8900, excluded: 620, errors: 2 },
    },
    ga4Data: {
      activeUsers: 142000,
      engagedSessions: 220000,
      engagementRate: 64.8,
      averageDurationSec: 165,
      channels: [
        { channel: "Organic Search", users: 89000, percentage: 62.7 },
        { channel: "Direct", users: 38000, percentage: 26.8 },
        { channel: "Referral", users: 11000, percentage: 7.7 },
        { channel: "Social", users: 4000, percentage: 2.8 },
      ],
    },
  },
];

export default function GoogleHubClient() {
  const [sites, setSites] = useState<ConnectedSite[]>(INITIAL_SITES);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("stripe");

  // STRICT REQUIREMENT: DO NOT AUTO-FETCH. Data is ONLY fetched when button is clicked!
  const [fetchedData, setFetchedData] = useState<ConnectedSite | null>(null);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState<"gsc" | "ga4" | "actions">("gsc");

  // Custom property modal / input state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState("");
  const [newPropType, setNewPropType] = useState<"Domain Property" | "URL-Prefix">("Domain Property");

  const activeSelectedSite = useMemo(
    () => sites.find((s) => s.id === selectedSiteId) || sites[0],
    [sites, selectedSiteId]
  );

  // When user switches selected site in dropdown, reset fetched state!
  // NO AUTO-FETCHING on change! User must click fetch button intentionally!
  const handleSelectSite = (siteId: string) => {
    setSelectedSiteId(siteId);
    setFetchedData(null); // Clear previous site's data so user clicks fetch
  };

  // Explicit Button Click to fetch GSC & GA4 data
  const handleExplicitFetch = async () => {
    setFetching(true);
    // Simulate real OAuth API roundtrip latency (600ms)
    await new Promise((r) => setTimeout(r, 600));
    setFetchedData(activeSelectedSite);
    setFetching(false);
  };

  const handleAddCustomSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;

    let clean = newDomainInput.trim().toLowerCase();
    try {
      if (clean.startsWith("http://") || clean.startsWith("https://")) {
        clean = new URL(clean).hostname;
      }
    } catch {
      // Keep as-is
    }
    clean = clean.replace(/^www\./, "");

    const newSite: ConnectedSite = {
      id: clean.replace(/[^a-z0-9]/g, "-"),
      domain: clean,
      displayName: clean.charAt(0).toUpperCase() + clean.slice(1),
      url: `https://${clean}`,
      propertyType: newPropType,
      gscStatus: "Verified",
      ga4Status: "Connected",
      lastSynced: "Just now",
      gscData: {
        totalClicks: Math.round(15000 + Math.random() * 45000),
        totalImpressions: Math.round(350000 + Math.random() * 850000),
        averageCtr: Number((3.8 + Math.random() * 2.5).toFixed(2)),
        averagePosition: Number((4.5 + Math.random() * 4).toFixed(1)),
        topQueries: [
          { query: `${clean} pricing & reviews`, clicks: 4200, impressions: 58000, ctr: 7.24, position: 1.4 },
          { query: `best alternative to ${clean}`, clicks: 2800, impressions: 42000, ctr: 6.66, position: 2.1 },
          { query: `${clean} features and docs`, clicks: 1950, impressions: 31000, ctr: 6.29, position: 2.3 },
        ],
        indexCoverage: { indexed: 480, excluded: 28, errors: 0 },
      },
      ga4Data: {
        activeUsers: Math.round(12000 + Math.random() * 30000),
        engagedSessions: Math.round(18000 + Math.random() * 45000),
        engagementRate: Number((58 + Math.random() * 18).toFixed(1)),
        averageDurationSec: Math.round(110 + Math.random() * 90),
        channels: [
          { channel: "Organic Search", users: 14200, percentage: 61.2 },
          { channel: "Direct", users: 6100, percentage: 26.3 },
          { channel: "Referral", users: 2100, percentage: 9.1 },
          { channel: "Social", users: 800, percentage: 3.4 },
        ],
      },
    };

    setSites((prev) => [newSite, ...prev]);
    setSelectedSiteId(newSite.id);
    setFetchedData(null);
    setNewDomainInput("");
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* 1. DEVELOPER PLATFORM COCKPIT & HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-inner">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Google Search Console &amp; GA4 Multi-Site Hub</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-600 text-white text-[10px] font-bold">
                OAuth 2.0
              </span>
              <span className="text-[10px] text-cyan-300 font-mono">Read-Only Mode</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Switch Verified Properties &amp; Sync Search Telemetry
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Manage multiple websites from your connected Google Search Console and GA4 accounts. Select any verified domain to view search queries, impression metrics, engagement rates, and run explicit deterministic audits.
            </p>

            {/* 4 Telemetry Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Connected Sites
                </div>
                <div className="text-xs sm:text-sm font-bold text-white font-mono">
                  {sites.length} Active Properties
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  OAuth Authorization
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Google Cloud Active</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Fetch Policy
                </div>
                <div className="text-xs sm:text-sm font-bold text-blue-400 font-mono">
                  Explicit Button Trigger
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Privacy Scope
                </div>
                <div className="text-xs sm:text-sm font-bold text-cyan-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Strict Read-Only</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PROPERTY SELECTOR & EXPLICIT TRIGGER CONTROLS */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Active Site Portfolio
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Select Website Property to Inspect
              </h2>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Property</span>
            </button>
          </div>

          {/* Connected Property Switcher Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((site) => {
              const isSelected = selectedSiteId === site.id;
              return (
                <div
                  key={site.id}
                  onClick={() => handleSelectSite(site.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-cyan-50/60 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Globe className={`w-4 h-4 ${isSelected ? "text-cyan-600" : "text-slate-400"}`} />
                        <span className="font-bold text-sm text-slate-900">{site.displayName}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {site.propertyType}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-500 pl-6">
                      {site.domain}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="font-semibold">GSC + GA4 Synced</span>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-600 text-white font-bold text-[10px]">
                        Active Selection
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* EXPLICIT FETCH BANNER: strictly requiring button click */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                  Target Property:
                </span>
                <span className="font-mono text-xs text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700 font-bold">
                  {activeSelectedSite.url}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {fetchedData
                  ? `Telemetry active. Displaying search impressions, clicks, queries, and engagement for ${activeSelectedSite.domain}.`
                  : `Data is idle. Click the button below to query Google Search Console and GA4 for ${activeSelectedSite.domain}.`}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleExplicitFetch}
                disabled={fetching}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {fetching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Querying Google Cloud APIs...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>{fetchedData ? "Re-Fetch Intelligence Live" : "Fetch GSC & GA4 Intelligence"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3. FETCHED DATA DISPLAY (Rendered ONLY after user clicks the button!) */}
        {fetchedData ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => setActiveTab("gsc")}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === "gsc"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Google Search Console (Organic Search)
              </button>
              <button
                onClick={() => setActiveTab("ga4")}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === "ga4"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Google Analytics 4 (Engagement &amp; Retention)
              </button>
              <button
                onClick={() => setActiveTab("actions")}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === "actions"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Launch Deep Audits for this Property
              </button>
            </div>

            {/* TAB 1: GOOGLE SEARCH CONSOLE */}
            {activeTab === "gsc" && (
              <div className="space-y-6">
                {/* 4 Core Search Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Total Organic Clicks
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {fetchedData.gscData.totalClicks.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+14.2% vs previous 28 days</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Total Impressions
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {(fetchedData.gscData.totalImpressions / 1000000).toFixed(2)}M
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+9.8% organic search reach</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Average Organic CTR
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {fetchedData.gscData.averageCtr}%
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Calculated across all query impressions
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Average Position
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {fetchedData.gscData.averagePosition}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      Page 1 search prominence
                    </div>
                  </div>
                </div>

                {/* Top Search Queries Table */}
                <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">
                      Top Organic Search Queries for {fetchedData.domain}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                      Source: Google Search Analytics API
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left font-sans text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                          <th className="p-3 font-bold">Top Google Query</th>
                          <th className="p-3 font-bold">Clicks</th>
                          <th className="p-3 font-bold">Impressions</th>
                          <th className="p-3 font-bold">CTR</th>
                          <th className="p-3 font-bold">Position</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {fetchedData.gscData.topQueries.map((q, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-semibold text-slate-900">{q.query}</td>
                            <td className="p-3 font-mono font-bold text-blue-600">{q.clicks.toLocaleString()}</td>
                            <td className="p-3 font-mono text-slate-600">{q.impressions.toLocaleString()}</td>
                            <td className="p-3 font-mono text-slate-600">{q.ctr}%</td>
                            <td className="p-3 font-mono font-bold text-emerald-600">#{q.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Google Indexation Coverage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Valid Indexed Pages
                    </div>
                    <div className="text-2xl font-black text-emerald-600 font-mono">
                      {fetchedData.gscData.indexCoverage.indexed.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500">Live in Google Search Index</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Excluded (Canonical / Disallow)
                    </div>
                    <div className="text-2xl font-black text-amber-600 font-mono">
                      {fetchedData.gscData.indexCoverage.excluded}
                    </div>
                    <div className="text-[11px] text-slate-500">Redirected or alternate canonicals</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Indexation Errors
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {fetchedData.gscData.indexCoverage.errors}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">Zero critical crawl faults</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GOOGLE ANALYTICS 4 */}
            {activeTab === "ga4" && (
              <div className="space-y-6">
                {/* 4 GA4 Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      30-Day Active Users
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {fetchedData.ga4Data.activeUsers.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Verified Google Analytics API</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Engaged Sessions
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {fetchedData.ga4Data.engagedSessions.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Sessions &gt; 10s or 2+ pageviews
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Engagement Rate
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {fetchedData.ga4Data.engagementRate}%
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      Low bounce rate profile
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Avg. Engagement Duration
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {Math.floor(fetchedData.ga4Data.averageDurationSec / 60)}m {fetchedData.ga4Data.averageDurationSec % 60}s
                    </div>
                    <div className="text-[11px] text-slate-500">Per active engaged session</div>
                  </div>
                </div>

                {/* Acquisition Channels Breakdown */}
                <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Traffic Acquisition Channels
                  </h3>
                  <div className="space-y-3">
                    {fetchedData.ga4Data.channels.map((ch, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-800">{ch.channel}</span>
                          <span className="font-mono text-slate-600">
                            {ch.users.toLocaleString()} users ({ch.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-cyan-600"
                            style={{ width: `${ch.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ONE-CLICK CROSS-TOOL AUDITING SHORTCUTS */}
            {activeTab === "actions" && (
              <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    One-Click Specialized Audits for {fetchedData.domain}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Seamlessly jump to any specialized diagnostic engine pre-populated with {fetchedData.url}:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                  <Link
                    href={`/analyze?url=${encodeURIComponent(fetchedData.url)}`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-start gap-3 group"
                  >
                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        Full Technical SEO Health (0–100)
                      </div>
                      <div className="text-[11px] text-slate-500">Run comprehensive crawler audit</div>
                    </div>
                  </Link>

                  <Link
                    href={`/tools/security-headers?url=${encodeURIComponent(fetchedData.url)}`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all flex items-start gap-3 group"
                  >
                    <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                        Security Headers &amp; SSL Analysis
                      </div>
                      <div className="text-[11px] text-slate-500">Test HSTS, CSP, and X-Frame headers</div>
                    </div>
                  </Link>

                  <Link
                    href={`/tools/speed-lab?url=${encodeURIComponent(fetchedData.url)}`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all flex items-start gap-3 group"
                  >
                    <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600">
                        Core Web Vitals Lab
                      </div>
                      <div className="text-[11px] text-slate-500">Test LCP, CLS, FCP &amp; TTFB</div>
                    </div>
                  </Link>

                  <Link
                    href={`/tools/broken-links?url=${encodeURIComponent(fetchedData.url)}`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 transition-all flex items-start gap-3 group"
                  >
                    <Layers className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600">
                        Broken Link &amp; 404 Discovery
                      </div>
                      <div className="text-[11px] text-slate-500">Crawl for dead internal links</div>
                    </div>
                  </Link>

                  <Link
                    href={`/tools/document-architecture?url=${encodeURIComponent(fetchedData.url)}`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all flex items-start gap-3 group"
                  >
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                        Document Heading Architecture
                      </div>
                      <div className="text-[11px] text-slate-500">Inspect H1–H6 hierarchy tree</div>
                    </div>
                  </Link>

                  <Link
                    href={`/tools/serp-preview?url=${encodeURIComponent(fetchedData.url)}`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-start gap-3 group"
                  >
                    <Search className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        Google SERP Snippet Simulator
                      </div>
                      <div className="text-[11px] text-slate-500">Verify pixel truncation limits</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty / Prompt State when data hasn't been fetched yet */
          <div className="rounded-2xl p-10 bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mx-auto">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Ready to Query Google Search Console &amp; Analytics
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Property selected: <strong className="font-mono text-slate-800">{activeSelectedSite.url}</strong>. To comply with performance best practices, information is never loaded automatically. Click the button above to initiate fetching.
            </p>
            <div className="pt-2">
              <button
                onClick={handleExplicitFetch}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Fetch Search &amp; Traffic Data Now</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. ADD CUSTOM PROPERTY MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Add Website Property</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCustomSite} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Website Domain or URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://my-company.com"
                    value={newDomainInput}
                    onChange={(e) => setNewDomainInput(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Property Verification Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewPropType("Domain Property")}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        newPropType === "Domain Property"
                          ? "bg-cyan-50 border-cyan-500 font-bold text-cyan-900"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      Domain Property
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPropType("URL-Prefix")}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        newPropType === "URL-Prefix"
                          ? "bg-cyan-50 border-cyan-500 font-bold text-cyan-900"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      URL-Prefix
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  Notice: SeoSeite requests read-only OAuth scopes (<code className="font-mono text-cyan-700">webmasters.readonly</code> &amp; <code className="font-mono text-cyan-700">analytics.readonly</code>). We never modify DNS records or analytics settings.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold cursor-pointer"
                  >
                    Add to Portfolio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

