"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Globe, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  Check, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Terminal, 
  Users, 
  Building2, 
  ChevronRight, 
  HelpCircle,
  Tag,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { usePlan } from "@/lib/auth/PlanContext";
import { PlanTier, formatTierName, PLAN_CONFIGS } from "@/lib/auth/tierLimits";

interface PlanCheckoutDetails {
  id: PlanTier;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
}

const CHECKOUT_PLANS: Record<PlanTier, PlanCheckoutDetails> = {
  free: {
    id: "free",
    name: "Free Webmaster",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Standard deterministic technical diagnostics and schema validator.",
    features: [
      "5 Website Audits per day",
      "Deterministic 0–100 SEO scoring",
      "Schema JSON-LD validator",
      "1 Verified telemetry domain",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter Consultant",
    monthlyPrice: 19,
    annualPrice: 15,
    description: "Core Web Vitals, 50+ tech stack detector, and 404 crawler for freelancers.",
    features: [
      "50 Website Audits per day",
      "5 Monitored domains with history",
      "Core Web Vitals (LCP, CLS, INP, TTFB)",
      "Deep 404 dead link crawler (50 links)",
      "CSV raw data export",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro Analyst",
    monthlyPrice: 49,
    annualPrice: 39,
    description: "Deep competitor benchmarking, topic gap analysis, AI code fixes, and bulk auditing.",
    features: [
      "Unlimited Daily Website Audits",
      "25 Monitored domains with history",
      "Full Head-to-Head Compare (/compare)",
      "Semantic Content Gap Matrix (/tools/content-gap)",
      "AI Code Synthesizer & Fixes",
      "3 Included team seats ($0 extra)",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Agency & Enterprise",
    monthlyPrice: 149,
    annualPrice: 119,
    description: "White-label client reporting, verified owner telemetry, REST API access, and unlimited team seats.",
    features: [
      "Everything in Pro Analyst",
      "Unlimited Projects & Monitored Domains",
      "Unlimited Team Seats ($0 per-user fees)",
      "White-Label Client PDF Exports",
      "REST API & AI MCP Server for Claude & Cursor",
      "Automated 24/7 Slack & Discord alerts",
      "Dedicated high-speed crawl queue (<50ms)",
    ],
  },
};

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") as PlanTier | null;
  const billingParam = searchParams.get("billing") as "monthly" | "annual" | null;

  const { user, isAuthenticated, updateUser } = useAuth();
  const { setTier } = usePlan();

  const planId: PlanTier = planParam && ["starter", "pro", "enterprise"].includes(planParam) 
    ? planParam 
    : "pro";

  const [isAnnual, setIsAnnual] = useState<boolean>(billingParam !== "monthly");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "apple_pay">("card");

  // Form State
  const [cardName, setCardName] = useState(user?.name || "");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("942");
  const [postalCode, setPostalCode] = useState("94105");

  // Promo Code
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Checkout Processing
  const [processingState, setProcessingState] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [receiptId, setReceiptId] = useState<string>("");

  useEffect(() => {
    if (user?.name && !cardName) {
      setCardName(user.name);
    }
  }, [user, cardName]);

  const planDetails = CHECKOUT_PLANS[planId];
  const monthlyRate = isAnnual ? planDetails.annualPrice : planDetails.monthlyPrice;
  const baseTotal = isAnnual ? monthlyRate * 12 : monthlyRate;
  const discountAmount = Math.round(baseTotal * appliedDiscount);
  const finalTotal = Math.max(0, baseTotal - discountAmount);

  const handleApplyPromo = () => {
    const clean = promoCode.trim().toUpperCase();
    if (clean === "GROWTH20" || clean === "SEO20" || clean === "LAUNCH20") {
      setAppliedDiscount(0.2);
      setPromoMessage("20% Promo code applied successfully!");
    } else if (clean === "FOUNDER" || clean === "SPECIAL50") {
      setAppliedDiscount(0.5);
      setPromoMessage("50% Special Founder discount applied!");
    } else {
      setPromoMessage("Invalid promo code. Try 'SEO20' or 'GROWTH20'.");
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setProcessingState("Verifying payment method with secure gateway...");
    await new Promise((r) => setTimeout(r, 700));

    setProcessingState("Authorizing transaction & generating subscription token...");
    await new Promise((r) => setTimeout(r, 800));

    setProcessingState("Activating " + planDetails.name + " & assigning quotas...");
    await new Promise((r) => setTimeout(r, 600));

    // Update Auth and Plan
    updateUser({
      tier: planId,
      billingCycle: isAnnual ? "annual" : "monthly",
    });
    setTier(planId);

    const generatedReceipt = `tx_seoseite_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setReceiptId(generatedReceipt);
    setProcessingState(null);
    setIsSuccess(true);
  };

  // If user is not authenticated yet:
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-slate-900">
              Please Sign Up First
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              To purchase and activate the <span className="font-bold text-slate-800">{planDetails.name}</span>, you first need to create your verified user account so your quota and API keys can be bound to you.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              href={`/signup?plan=${planId}&billing=${isAnnual ? "annual" : "monthly"}`}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              <span>Create Account for {planDetails.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/login?redirect=/checkout?plan=${planId}`}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs block text-center transition-colors"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If payment succeeded:
  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 space-y-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              Payment Successful &amp; Activated
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome to {planDetails.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Your subscription is active immediately. Quota allocations and developer API keys are live.
            </p>
          </div>

          {/* Receipt Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 font-mono text-xs text-slate-700">
            <div className="flex justify-between pb-2 border-b border-slate-200 text-slate-500">
              <span>Receipt Ref</span>
              <span className="font-bold text-slate-900">{receiptId}</span>
            </div>
            <div className="flex justify-between">
              <span>Account</span>
              <span className="font-bold text-slate-900 truncate max-w-[200px]">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Subscription Tier</span>
              <span className="font-bold text-blue-600">{planDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Billing Interval</span>
              <span className="font-bold text-slate-900 capitalize">{isAnnual ? "Annual (Save 20%)" : "Monthly"}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
              <span>Amount Paid Today</span>
              <span>${finalTotal}.00</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <Link
              href={`/dashboard?upgraded=${planId}`}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <span>Go to Operations Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/account"
                className="py-2.5 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View Account &amp; API Keys
              </Link>
              <Link
                href="/analyze"
                className="py-2.5 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Run New Audit
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Brand & Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <Link href="/" className="inline-flex items-center gap-2.5 font-black text-xl text-slate-900 tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Globe className="w-4 h-4" />
            </div>
            <span>SeoSeite <span className="text-blue-600">Intel</span></span>
          </Link>

          {/* Checkout Steps */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-slate-400">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">
                ✓
              </div>
              <span>1. Choose Plan</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1.5 text-slate-400">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">
                ✓
              </div>
              <span>2. Sign Up</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1.5 text-blue-600">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                3
              </div>
              <span>3. Payment &amp; Activation</span>
            </div>
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Payment Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment Details
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Complete your {planDetails.name} subscription
              </h1>
              <p className="text-xs text-slate-500">
                Logged in as <span className="font-bold text-slate-800">{user?.name}</span> ({user?.email})
              </p>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === "paypal"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>PayPal</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("apple_pay")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === "apple_pay"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Google / Apple</span>
              </button>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-wider pl-10"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Security Code (CVC)
                  </label>
                  <input
                    type="text"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Billing Postal / ZIP Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 94105 or 10001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Promo Code Input */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. SEO20"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 pl-8"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] mt-1.5 font-medium ${appliedDiscount > 0 ? "text-emerald-600" : "text-amber-600"}`}>
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Security & Guarantee Note */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted &amp; PCI-DSS Level 1 Compliant</span>
                </div>
                <p>
                  You will be billed ${finalTotal}.00 today. Subscriptions renew automatically and can be canceled anytime with one click in your account settings.
                </p>
              </div>

              <button
                type="submit"
                disabled={processingState !== null}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-black text-sm sm:text-base transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {processingState ? (
                  <span>{processingState}</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ${finalTotal}.00 &amp; Activate {planDetails.name}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    Selected Order Summary
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">{planDetails.name}</h3>
                </div>
                <Link
                  href="/pricing"
                  className="text-[11px] font-bold text-blue-400 hover:text-blue-300 underline"
                >
                  Change Plan
                </Link>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Billing Interval</span>
                  <span className="font-bold text-white capitalize">
                    {isAnnual ? "Annual (Save 20%)" : "Monthly"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Base Rate</span>
                  <span className="font-bold text-white">
                    ${monthlyRate}/mo {isAnnual ? `× 12 mo ($${baseTotal})` : ""}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount ({Math.round(appliedDiscount * 100)}%)</span>
                    <span>-${discountAmount}.00</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax / VAT</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-800 text-base font-black text-white">
                  <span>Total Due Today</span>
                  <span className="text-blue-400">${finalTotal}.00</span>
                </div>
              </div>

              {/* Plan Benefits List */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Included In Your Plan:
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {planDetails.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>30-Day Money-Back Guarantee if not 100% satisfied.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant quota activation &amp; zero per-seat penalty fees.</span>
                </div>
              </div>
            </div>

            {/* Back link */}
            <div className="text-center text-xs text-slate-500">
              Need assistance? Check our{" "}
              <Link href="/project-info" className="text-blue-600 underline font-semibold">
                Platform Architecture Spec
              </Link>{" "}
              or contact support.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
