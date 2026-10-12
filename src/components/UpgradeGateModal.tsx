"use client";

import { Sparkles, X, ArrowRight, ShieldCheck, Check, Zap } from "lucide-react";
import Link from "next/link";
import { PlanTier, formatTierName } from "@/lib/auth/tierLimits";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  requiredTier: PlanTier;
  featureTitle: string;
  description: string;
  onSimulateUpgrade?: (tier: PlanTier) => void;
}

export default function UpgradeGateModal({
  isOpen,
  onClose,
  requiredTier,
  featureTitle,
  description,
  onSimulateUpgrade,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          {formatTierName(requiredTier).toUpperCase()} REQUIRED
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
          {featureTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs text-slate-700 space-y-2.5">
          <div className="font-bold text-slate-900 mb-1">Unlocked in {formatTierName(requiredTier)}:</div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Full unrestricted access to this engine</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Zero per-seat penalty fees (team seats included)</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Permanent snapshot archival in Google Cloud SQL</span>
          </div>
        </div>

        <div className="space-y-2">
          <Link
            href="/pricing"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-semibold text-white inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            Explore Plans &amp; Upgrade <ArrowRight className="w-4 h-4" />
          </Link>

          {onSimulateUpgrade && (
            <button
              onClick={() => {
                onSimulateUpgrade(requiredTier);
                onClose();
              }}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-medium text-slate-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              Simulate Instant Sandbox Upgrade ({formatTierName(requiredTier)})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
