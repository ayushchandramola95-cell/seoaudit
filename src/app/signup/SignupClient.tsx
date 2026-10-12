"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Globe, 
  ArrowRight, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Building2, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Users,
  Terminal,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { PlanTier, formatTierName, getPlanLimits, PLAN_CONFIGS } from "@/lib/auth/tierLimits";

interface PlanOption {
  id: PlanTier;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  badge?: string;
  description: string;
  highlights: string[];
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "free",
    name: "Free Webmaster",
    monthlyPrice: 0,
    annualPrice: 0,
    badge: "Free Forever",
    description: "Ideal for individual developers and site owners exploring technical diagnostics.",
    highlights: [
      "5 Website Audits per day",
      "Deterministic 0–100 SEO scoring",
      "Schema JSON-LD validator",
      "1 Verified telemetry domain",
      "No credit card required",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 19,
    annualPrice: 15,
    badge: "Solo SEOs",
    description: "Great for freelancers monitoring multiple client websites with weekly cron alerts.",
    highlights: [
      "50 Website Audits per day",
      "5 Monitored domains",
      "Deep 404 crawler (50 links)",
      "50+ Tech stack detection",
      "Automated webhook alerts",
    ],
  },
  {
    id: "pro",
    name: "Pro Analyst",
    monthlyPrice: 49,
    annualPrice: 39,
    badge: "Most Popular",
    description: "Built for scaling engineering teams and SEO consultants needing unlimited capacity.",
    highlights: [
      "Unlimited Website Audits",
      "25 Monitored domains",
      "Native FastMCP Claude & Cursor server",
      "Semantic Content Gap & Radar AEO",
      "3 Included team seats ($0 extra)",
    ],
  },
  {
    id: "enterprise",
    name: "Agency & Enterprise",
    monthlyPrice: 149,
    annualPrice: 119,
    badge: "Full Power",
    description: "Complete agency intelligence suite with white-label client PDF reports and REST API.",
    highlights: [
      "Unlimited audits & 5,000 links crawl",
      "Unlimited verified domains",
      "White-label client PDF export",
      "Unlimited team member seats",
      "REST API & automated webhooks",
    ],
  },
];

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planQuery = searchParams.get("plan") as PlanTier | null;

  const { signup, isAuthenticated } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(
    planQuery && ["free", "starter", "pro", "enterprise"].includes(planQuery) ? planQuery : "pro"
  );
  const [isAnnual, setIsAnnual] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [agreed, setAgreed] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sync if query param changes
  useEffect(() => {
    if (planQuery && ["free", "starter", "pro", "enterprise"].includes(planQuery)) {
      setSelectedPlan(planQuery);
    }
  }, [planQuery]);

  const activePlanDetails = PLAN_OPTIONS.find((p) => p.id === selectedPlan) || PLAN_OPTIONS[2];
  const priceDisplay = isAnnual ? activePlanDetails.annualPrice : activePlanDetails.monthlyPrice;

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "None", color: "bg-slate-200" };
    if (password.length < 6) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (password.length < 10) return { score: 2, label: "Good", color: "bg-amber-500" };
    return { score: 3, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service to proceed.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await signup({
        name,
        email,
        password,
        company,
        tier: selectedPlan,
        billingCycle: isAnnual ? "annual" : "monthly",
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard?welcome=1&plan=${selectedPlan}`);
        }, 600);
      } else {
        setError(result.error || "Failed to create account. Please check your information.");
      }
    } catch {
      setError("An unexpected error occurred during account creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 font-black text-2xl text-slate-900 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <span>SeoSeite <span className="text-blue-600">Intel</span></span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Create your account &amp; select a plan
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Get instant access to 14 deterministic SEO scoring engines, Core Web Vitals telemetry, and conversational AI coding assistant tools.
          </p>
        </div>

        {/* Plan Selector Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Step 1: Choose Your Starting Plan
            </div>

            {/* Annual Billing Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-slate-200/80 border border-slate-300/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !isAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAnnual ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* 4 Plan Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAN_OPTIONS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border shadow-xs ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2 mt-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">{plan.name}</h3>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">${price}</span>
                      <span className="text-xs text-slate-500 font-medium">/month</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-snug">{plan.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    {plan.highlights.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Form & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Registration Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
              Step 2: Enter Account Credentials
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Account created! Redirecting to your dashboard...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company / Website (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Digital"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Work Email Address *
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
                    placeholder="jane@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                  />
                </div>
                {password && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : "bg-slate-200"}`} />
                      <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : "bg-slate-200"}`} />
                      <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : "bg-slate-200"}`} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span>
                    I agree to the SeoSeite{" "}
                    <Link href="/project-info" className="text-blue-600 underline">Terms of Service</Link>{" "}
                    and Privacy Policy. You can cancel paid subscriptions at any time.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Setting up account...</span>
                ) : (
                  <>
                    <span>Start Free 14-Day Trial with {activePlanDetails.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Rail: Selected Plan Summary & Trust Badges (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    Selected Subscription
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">{activePlanDetails.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">${priceDisplay}</div>
                  <div className="text-[11px] text-slate-400">
                    {selectedPlan === "free" ? "Free Forever" : isAnnual ? "per month, billed annually" : "per month, billed monthly"}
                  </div>
                </div>
              </div>

              {/* Detailed Quota Badges */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Plan Inclusions:
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {activePlanDetails.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>14-day free trial on paid tiers. Cancel anytime.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Sub-second crawl latency, zero credit burn traps.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>FastMCP Claude Desktop &amp; Cursor IDE access.</span>
                </div>
              </div>
            </div>

            {/* Already have an account? */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-blue-600 hover:underline">
                Sign in to your account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
