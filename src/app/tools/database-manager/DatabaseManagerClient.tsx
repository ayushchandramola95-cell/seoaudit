"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Database,
  Server,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Play,
  RotateCcw,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowRight,
  Code2,
  Table,
  Cpu,
  Eye,
  X,
  FileText,
  Lock,
  Radio,
  Sliders,
} from "lucide-react";

interface DatabaseTelemetry {
  connected: boolean;
  mode: "custom_postgres" | "env_postgres" | "in_memory";
  isCustomPostgres: boolean;
  isCloudSqlConfigured: boolean;
  databaseType: string;
  maskedUrl: string;
  latencyMs: number;
  databaseVersion: string;
  currentDatabase: string;
  tableCounts: {
    website_scans: number;
    comparisons: number;
    workspace_projects: number;
    monitored_domains: number;
    users: number;
  };
  tables: string[];
  poolStats: {
    totalCount: number;
    idleCount: number;
    waitingCount: number;
  };
  platform: string;
}

interface ScanRecord {
  id: string;
  domain: string;
  targetUrl: string;
  seoScore: number;
  grade: string;
  responseTimeMs: number;
  perfScore: number | null;
  techCount: number;
  createdAt: string;
  fullReportJson?: Record<string, unknown>;
}

export default function DatabaseManagerClient() {
  const [telemetry, setTelemetry] = useState<DatabaseTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Configuration state
  const [inputMode, setInputMode] = useState<"uri" | "fields">("uri");
  const [databaseUri, setDatabaseUri] = useState("");
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("5432");
  const [user, setUser] = useState("postgres");
  const [password, setPassword] = useState("");
  const [dbName, setDbName] = useState("seoseite");
  const [ssl, setSsl] = useState(false);

  // Operation states
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message?: string;
    error?: string;
    latencyMs?: number;
    version?: string;
    database?: string;
  } | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Records explorer state
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"explorer" | "schema" | "presets">("explorer");

  const computedUri =
    inputMode === "uri"
      ? databaseUri
      : `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${dbName}${
          ssl ? "?sslmode=require" : ""
        }`;

  // Fetch live database status
  const fetchTelemetry = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/db/status");
      const json = await res.json();
      if (json.success && json.data) {
        setTelemetry(json.data);
      }
    } catch {
      // Ignore network errors
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Fetch recent scan records
  const fetchRecords = async () => {
    try {
      setLoadingRecords(true);
      const res = await fetch("/api/db/records?type=scans&limit=15");
      const json = await res.json();
      if (json.success && Array.isArray(json.records)) {
        setRecords(json.records);
      }
    } catch {
      // Ignore
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    fetchRecords();
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setNotification(null);
    try {
      const uriToTest = computedUri.trim() || undefined;
      const res = await fetch("/api/db/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseUrl: uriToTest }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          ok: true,
          message: data.message,
          latencyMs: data.details?.latencyMs,
          version: data.details?.version,
          database: data.details?.database,
        });
      } else {
        setTestResult({
          ok: false,
          error: data.error || "Connection test failed.",
          latencyMs: data.details?.latencyMs,
        });
      }
    } catch (err: unknown) {
      setTestResult({
        ok: false,
        error: (err as Error)?.message || "Network request failed.",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveAndConnect = async () => {
    if (!computedUri.trim()) {
      setNotification({ type: "error", text: "Please enter a valid PostgreSQL connection URI." });
      return;
    }
    setSaving(true);
    setNotification(null);
    try {
      const res = await fetch("/api/db/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseUrl: computedUri.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          text: "Custom PostgreSQL database connected and tables verified successfully!",
        });
        if (data.telemetry) setTelemetry(data.telemetry);
        fetchRecords();
      } else {
        setNotification({
          type: "error",
          text: data.error || "Failed to connect to custom database.",
        });
      }
    } catch (err: unknown) {
      setNotification({
        type: "error",
        text: (err as Error)?.message || "Failed to save database config.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Disconnect custom PostgreSQL and revert to in-memory fallback?")) return;
    try {
      const res = await fetch("/api/db/config", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          text: "Disconnected custom database. Reverted to default fallback.",
        });
        setDatabaseUri("");
        if (data.telemetry) setTelemetry(data.telemetry);
        fetchRecords();
      }
    } catch {
      // Ignore
    }
  };

  const handleRunMigrations = async () => {
    setMigrating(true);
    setNotification(null);
    try {
      const res = await fetch("/api/db/migrate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          text: "Schema migrations executed! All tables and indexes are ready.",
        });
        fetchTelemetry();
      } else {
        setNotification({ type: "error", text: data.error || "Migration failed." });
      }
    } catch {
      setNotification({ type: "error", text: "Failed to trigger migrations." });
    } finally {
      setMigrating(false);
    }
  };

  const handleSyncMemory = async () => {
    setSyncing(true);
    setNotification(null);
    try {
      const res = await fetch("/api/db/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", text: data.message });
        fetchTelemetry();
        fetchRecords();
      } else {
        setNotification({ type: "error", text: data.error || "Sync failed." });
      }
    } catch {
      setNotification({ type: "error", text: "Failed to sync memory records." });
    } finally {
      setSyncing(false);
    }
  };

  const applyPreset = (presetUri: string) => {
    setInputMode("uri");
    setDatabaseUri(presetUri);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/tools" className="hover:text-blue-600 transition-colors">
                Tools
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Custom PostgreSQL Database Manager</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchTelemetry}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-600" : "text-slate-500"}`} />
                <span>Refresh Status</span>
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero & Live Engine Status Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      In-Site Custom PostgreSQL Engine
                    </h1>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Live Manager
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Connect any self-hosted PostgreSQL, Supabase, Neon, or Cloud SQL instance directly from the UI.
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm">
                <span
                  className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    telemetry?.connected
                      ? "bg-emerald-400"
                      : telemetry?.mode === "in_memory"
                      ? "bg-amber-400"
                      : "bg-rose-400"
                  }`}
                />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Database State</div>
                  <div className="text-xs font-bold text-white leading-tight">
                    {telemetry?.isCustomPostgres
                      ? "Custom PostgreSQL Active"
                      : telemetry?.isCloudSqlConfigured
                      ? "Cloud SQL (DATABASE_URL)"
                      : "In-Memory Sandbox Active"}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active URI</div>
                <div className="text-xs font-mono font-bold text-slate-200 truncate mt-0.5" title={telemetry?.maskedUrl}>
                  {telemetry?.maskedUrl || "None"}
                </div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ping Latency</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{telemetry?.connected ? `${telemetry.latencyMs}ms` : "0ms (In-Memory)"}</span>
                </div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scans Persisted</div>
                <div className="text-xs font-bold text-white mt-0.5">
                  {telemetry?.tableCounts?.website_scans ?? 0} records
                </div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Version</div>
                <div className="text-xs font-bold text-slate-300 truncate mt-0.5">
                  {telemetry?.databaseVersion || "PostgreSQL Client"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Alert Notification */}
        {notification && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold ${
              notification.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-rose-50 text-rose-900 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{notification.text}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Connection Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Configuration
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                    <span>PostgreSQL Connection Settings</span>
                  </h2>
                </div>

                {/* Input Mode Toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setInputMode("uri")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      inputMode === "uri" ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                    }`}
                  >
                    URI String
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("fields")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      inputMode === "fields" ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                    }`}
                  >
                    Structured Fields
                  </button>
                </div>
              </div>

              {/* Form Body */}
              {inputMode === "uri" ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>PostgreSQL Connection URI</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      e.g. postgresql://user:pass@host:5432/dbname
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={databaseUri}
                      onChange={(e) => setDatabaseUri(e.target.value)}
                      placeholder="postgresql://postgres:password@localhost:5432/seoseite"
                      className="w-full font-mono text-xs bg-slate-50 focus:bg-white text-slate-900 px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Tip: You can use your local PostgreSQL or any cloud database from Supabase, Neon, AWS RDS, or GCP.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Host</label>
                    <input
                      type="text"
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                      placeholder="localhost or 127.0.0.1"
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Port</label>
                    <input
                      type="text"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="5432"
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">User</label>
                    <input
                      type="text"
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      placeholder="postgres"
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Database Name</label>
                    <input
                      type="text"
                      value={dbName}
                      onChange={(e) => setDbName(e.target.value)}
                      placeholder="seoseite"
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1 flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="ssl-check"
                      checked={ssl}
                      onChange={(e) => setSsl(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <label htmlFor="ssl-check" className="font-semibold text-slate-700 cursor-pointer">
                      Require SSL (Cloud / Production)
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Play className={`w-3.5 h-3.5 ${testing ? "animate-spin text-blue-600" : "text-blue-600"}`} />
                  <span>{testing ? "Testing Ping..." : "Test Connection"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndConnect}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/20"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{saving ? "Connecting..." : "Save & Connect Engine"}</span>
                </button>

                {telemetry?.isCustomPostgres && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-3.5 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              {/* Connection Test Output Banner */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium space-y-1.5 animate-in fade-in duration-150 ${
                    testResult.ok
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      : "bg-rose-50 text-rose-900 border border-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      {testResult.ok ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                      )}
                      <span>{testResult.ok ? "Connection Succeeded" : "Connection Failed"}</span>
                    </span>
                    {testResult.latencyMs !== undefined && (
                      <span className="font-mono text-[11px]">Latency: {testResult.latencyMs}ms</span>
                    )}
                  </div>
                  {testResult.ok ? (
                    <div className="text-[11px] text-emerald-700">
                      PostgreSQL Version: <span className="font-semibold">{testResult.version}</span> • Database:{" "}
                      <span className="font-semibold">{testResult.database}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-rose-700 font-mono break-all">{testResult.error}</div>
                  )}
                </div>
              )}
            </div>

            {/* Quick 1-Click Connection Presets */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                1-Click Preset Templates
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    name: "Local PostgreSQL (Default)",
                    uri: "postgresql://postgres:password@localhost:5432/seoseite",
                    tag: "Docker / Native",
                  },
                  {
                    name: "Google Cloud SQL",
                    uri: "postgresql://postgres:Ayush1234%407890@34.29.240.199:5432/postgres",
                    tag: "GCP Managed",
                  },
                  {
                    name: "Supabase Pooler",
                    uri: "postgresql://postgres.myproject:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require",
                    tag: "Serverless",
                  },
                  {
                    name: "Neon Serverless Postgres",
                    uri: "postgresql://alex:pass@ep-cool-fog-1234.us-east-2.aws.neon.tech/neondb?sslmode=require",
                    tag: "Cloud",
                  },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset.uri)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                        {preset.name}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {preset.tag}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate mt-1">{preset.uri}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Database Migrations & Tools (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Schema & Migrations Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Schema Operations
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">Database Tables &amp; Migrations</h3>
                </div>
                <button
                  type="button"
                  onClick={handleRunMigrations}
                  disabled={migrating}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <RefreshCw className={`w-3 h-3 ${migrating ? "animate-spin" : ""}`} />
                  <span>{migrating ? "Running..." : "Run Migrations"}</span>
                </button>
              </div>

              {/* Table List */}
              <div className="space-y-2">
                {[
                  {
                    table: "website_scans",
                    desc: "Full 0-100 SEO health audit reports with JSONB payloads",
                    count: telemetry?.tableCounts?.website_scans ?? 0,
                  },
                  {
                    table: "comparisons",
                    desc: "Competitor head-to-head benchmark and scoring diffs",
                    count: telemetry?.tableCounts?.comparisons ?? 0,
                  },
                  {
                    table: "workspace_projects",
                    desc: "Active workspace domains and verified properties",
                    count: telemetry?.tableCounts?.workspace_projects ?? 4,
                  },
                  {
                    table: "users",
                    desc: "User identities, API keys, and subscription plan tiers",
                    count: telemetry?.tableCounts?.users ?? 1,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <Table className="w-3.5 h-3.5 text-blue-600" />
                        <span>{item.table}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    <span className="font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
                      {item.count} rows
                    </span>
                  </div>
                ))}
              </div>

              {/* Sync In-Memory Data */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Sync Sample Data</div>
                  <div className="text-[11px] text-slate-500">Copy in-memory demo audits into PostgreSQL</div>
                </div>
                <button
                  type="button"
                  onClick={handleSyncMemory}
                  disabled={syncing}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCcw className={`w-3 h-3 ${syncing ? "animate-spin text-blue-600" : ""}`} />
                  <span>{syncing ? "Syncing..." : "Sync to DB"}</span>
                </button>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 p-6 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Zero-Friction Fallback Architecture</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If the PostgreSQL connection is unreachable or experiences latency &gt; 2.5s, the engine seamlessly diverts
                queries to the in-memory array. Your user experience never hangs or crashes.
              </p>
              <div className="text-[11px] font-semibold text-blue-700 pt-1">
                Active Pool Timeout: 2,500ms • SSL RejectUnauthorized: False • Max Clients: 8
              </div>
            </div>
          </div>
        </div>

        {/* Live Stored Records Explorer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Live Data Explorer
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Recent Website Scans Stored in Database</h3>
            </div>
            <button
              type="button"
              onClick={fetchRecords}
              disabled={loadingRecords}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3 h-3 ${loadingRecords ? "animate-spin text-blue-600" : ""}`} />
              <span>Refresh Records</span>
            </button>
          </div>

          {records.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No saved scans found yet. Run an audit on{" "}
              <Link href="/analyze" className="text-blue-600 font-bold underline">
                /analyze
              </Link>{" "}
              or click &quot;Sync to DB&quot; above to populate sample records.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-extrabold tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3">Scan ID</th>
                    <th className="py-2.5 px-3">Domain</th>
                    <th className="py-2.5 px-3">Score &amp; Grade</th>
                    <th className="py-2.5 px-3">Latency</th>
                    <th className="py-2.5 px-3">Tech Detected</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-600 text-[11px]">{r.id}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{r.domain}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {r.seoScore}/100 ({r.grade})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{r.responseTimeMs}ms</td>
                      <td className="py-2.5 px-3 text-slate-600">{r.techCount} frameworks</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(r)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Record Inspector</span>
                <h3 className="text-base font-bold text-slate-900 font-mono">{selectedRecord.domain}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <pre className="text-[11px] font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
                {JSON.stringify(selectedRecord, null, 2)}
              </pre>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
