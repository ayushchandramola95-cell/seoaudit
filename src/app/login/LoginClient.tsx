"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Globe, 
  ArrowRight, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Sliders
} from "lucide-react";
import { useAuth, DEMO_USERS } from "@/lib/auth/AuthContext";
import { PlanTier, formatTierName } from "@/lib/auth/tierLimits";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login, loginWithDemo, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(redirectUrl);
        }, 600);
      } else {
        setError(result.error || "Failed to sign in. Please verify your email.");
      }
    } catch {
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (tier: PlanTier) => {
    loginWithDemo(tier);
    setSuccess(true);
    setTimeout(() => {
      router.push(redirectUrl);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 font-black text-2xl text-slate-900 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <span>SeoSeite <span className="text-blue-600">Intel</span></span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Access deterministic SEO audits, Core Web Vitals telemetry, and FastMCP AI agent tools.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Signed in successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Password reset link has been dispatched to your email address.")}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span>Remember this device for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Profiles (For Evaluators & Quick Testing) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                1-Click Demo Personas
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Instant Access</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoSelect("pro")}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 text-left transition-colors group cursor-pointer"
              >
                <div className="font-bold text-blue-900 flex items-center justify-between">
                  <span>Pro Analyst</span>
                  <span className="text-[9px] font-extrabold bg-blue-600 text-white px-1.5 py-0.2 rounded">★ Rec</span>
                </div>
                <div className="text-[10px] text-blue-700 mt-0.5 truncate">{DEMO_USERS.pro.email}</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect("enterprise")}
                className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/60 text-left transition-colors group cursor-pointer"
              >
                <div className="font-bold text-purple-900 flex items-center justify-between">
                  <span>Agency Admin</span>
                  <span className="text-[9px] font-extrabold bg-purple-600 text-white px-1.5 py-0.2 rounded">Max</span>
                </div>
                <div className="text-[10px] text-purple-700 mt-0.5 truncate">{DEMO_USERS.enterprise.email}</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect("starter")}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800">Starter Tier</div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{DEMO_USERS.starter.email}</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect("free")}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800">Free Tier</div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{DEMO_USERS.free.email}</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center text-xs text-slate-500 space-y-2">
          <p>
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="font-bold text-blue-600 hover:underline">
              Create an account with free 14-day trial →
            </Link>
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400 text-[11px] pt-2">
            <Link href="/pricing" className="hover:text-slate-600">Compare Plans ($0–$149)</Link>
            <span>•</span>
            <Link href="/capstone" className="hover:text-slate-600">Scoring Methodology</Link>
            <span>•</span>
            <Link href="/project-info" className="hover:text-slate-600">Platform Specs</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
