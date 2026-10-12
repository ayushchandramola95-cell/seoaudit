"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  ShieldCheck, 
  Zap, 
  Key, 
  Copy, 
  Check, 
  RefreshCw, 
  LogOut, 
  Sliders, 
  Users, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  CreditCard,
  Building
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { usePlan } from "@/lib/auth/PlanContext";
import { PlanTier, formatTierName, PLAN_CONFIGS } from "@/lib/auth/tierLimits";

export default function AccountClient() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUser, loginWithDemo } = useAuth();
  const { tier, setTier, scansUsed, remainingScans, limits } = usePlan();

  const [copiedKey, setCopiedKey] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [newTeamEmail, setNewTeamEmail] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([
    "alex@riverastudio.dev (Owner)",
    "dev-ci-bot@riverastudio.dev (GitHub Actions)",
  ]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sign in to view your account</h2>
          <p className="text-xs text-slate-500">
            Manage your subscription, daily scan quotas, FastMCP tokens, and team seats.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(user.apiKey || "sk_live_demo_12345");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 14)}_${Date.now().toString(36)}`;
    updateUser({ apiKey: newKey });
    setSuccessNotice("API Key regenerated successfully. Remember to update your FastMCP config.");
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handlePlanChange = (newTier: PlanTier) => {
    setTier(newTier);
    updateUser({ tier: newTier });
    setSuccessNotice(`Switched to ${formatTierName(newTier)}! Your quotas and permissions are updated.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamEmail || !newTeamEmail.includes("@")) return;
    if (limits.includedSeats !== Infinity && teamMembers.length >= limits.includedSeats) {
      alert(`Your ${formatTierName(tier)} plan includes ${limits.includedSeats} seats. Upgrade to add more team members.`);
      return;
    }
    setTeamMembers([...teamMembers, `${newTeamEmail} (Member)`]);
    setNewTeamEmail("");
    setSuccessNotice(`Seat invitation sent to ${newTeamEmail}`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const dailyLimitDisplay = limits.dailyScans === Infinity ? "Unlimited" : limits.dailyScans;
  const quotaPercentage = limits.dailyScans === Infinity ? 0 : Math.min(100, Math.round((scansUsed / limits.dailyScans) * 100));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{user.email}</span>
                  {user.company && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        {user.company}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out</span>
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {successNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Section 1: Active Subscription & Quota Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Plan Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Active Subscription
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
                  <span>{formatTierName(tier)}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </h3>
              </div>

              <Link
                href="/pricing"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Compare All Tiers</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Daily Scans Quota Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Daily Website Audits Quota</span>
                <span className="font-semibold text-slate-500">
                  {scansUsed} / {dailyLimitDisplay} used today
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    quotaPercentage > 80 ? "bg-rose-500" : quotaPercentage > 50 ? "bg-amber-500" : "bg-blue-600"
                  }`}
                  style={{ width: `${limits.dailyScans === Infinity ? 15 : quotaPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Resets at midnight UTC</span>
                <span>{limits.dailyScans === Infinity ? "Unlimited capacity" : `${remainingScans} scans remaining`}</span>
              </div>
            </div>

            {/* Change Plan 1-Click Toggle */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-700">Quick Plan Switcher:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["free", "starter", "pro", "enterprise"] as PlanTier[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handlePlanChange(t)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                      tier === t
                        ? "bg-blue-50 border-blue-600 text-blue-700 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="capitalize">{t}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {t === "free" ? "$0" : t === "starter" ? "$19/mo" : t === "pro" ? "$49/mo" : "$149/mo"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Plan Limits Overview (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                Included Plan Features
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">Entitlements</h3>

              <ul className="space-y-2.5 text-xs text-slate-300 mt-4">
                <li className="flex items-center justify-between">
                  <span>Monitored Domains</span>
                  <span className="font-bold text-white">{limits.maxProjects === Infinity ? "Unlimited" : limits.maxProjects}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Max Crawled Links per Audit</span>
                  <span className="font-bold text-white">{limits.maxLinksCrawled}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Competitor Benchmarking</span>
                  <span className={`font-bold ${limits.allowCompetitorCompare ? "text-emerald-400" : "text-slate-500"}`}>
                    {limits.allowCompetitorCompare ? "Enabled" : "Upgrade Required"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Semantic Content Gap</span>
                  <span className={`font-bold ${limits.allowTopicGap ? "text-emerald-400" : "text-slate-500"}`}>
                    {limits.allowTopicGap ? "Enabled" : "Upgrade Required"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>White-Label Client PDF</span>
                  <span className={`font-bold ${limits.allowWhiteLabelPDF ? "text-emerald-400" : "text-slate-500"}`}>
                    {limits.allowWhiteLabelPDF ? "Enabled" : "Agency Tier"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Team Member Seats</span>
                  <span className="font-bold text-white">{limits.includedSeats === Infinity ? "Unlimited" : `${limits.includedSeats} Seats`}</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Need more capacity?{" "}
              <Link href="/pricing" className="text-blue-400 font-bold hover:underline">
                View all pricing details &amp; quotas →
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2: Developer API Key & FastMCP Integration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Developer Integration
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <span>Personal API &amp; FastMCP Key</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  Live
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/api-docs"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Interactive API Docs</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <span>•</span>
              <Link
                href="/mcp"
                className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
              >
                <span>FastMCP Setup Guide</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Use this key to authorize REST API endpoints or configure your local Claude Desktop &amp; Cursor IDE Model Context Protocol server.
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-xs bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 overflow-x-auto truncate">
                {user.apiKey}
              </div>
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Key</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleRegenerateKey}
                className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                title="Regenerate key"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Team Seats Management */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Team Collaboration
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Assigned Team Seats ({teamMembers.length} / {limits.includedSeats === Infinity ? "Unlimited" : limits.includedSeats})
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {limits.includedSeats === 1 ? "1 Solo Seat (Starter)" : limits.includedSeats === 3 ? "3 Seats ($0 extra on Pro)" : "Unlimited Seats (Agency)"}
            </span>
          </div>

          <div className="space-y-3">
            <ul className="divide-y divide-slate-100 text-xs text-slate-700">
              {teamMembers.map((member, i) => (
                <li key={i} className="py-2.5 flex items-center justify-between">
                  <span className="font-medium">{member}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </li>
              ))}
            </ul>

            <form onSubmit={handleAddTeamMember} className="flex gap-2 pt-2">
              <input
                type="email"
                value={newTeamEmail}
                onChange={(e) => setNewTeamEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Invite Member
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
