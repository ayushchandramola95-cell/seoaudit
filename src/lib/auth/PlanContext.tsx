"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PlanTier, PlanLimits, getPlanLimits, canAccessFeature } from "./tierLimits";
import UpgradeGateModal from "@/components/UpgradeGateModal";

interface UpgradeModalConfig {
  requiredTier: PlanTier;
  featureTitle: string;
  description: string;
}

interface PlanContextType {
  tier: PlanTier;
  setTier: (tier: PlanTier) => void;
  scansUsed: number;
  remainingScans: number;
  recordScan: () => boolean;
  canAccess: (feature: keyof PlanLimits) => boolean;
  limits: PlanLimits;
  triggerUpgradeModal: (config: UpgradeModalConfig) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTierState] = useState<PlanTier>("free");
  const [scansUsed, setScansUsed] = useState<number>(0);
  const [modalConfig, setModalConfig] = useState<UpgradeModalConfig | null>(null);

  // Synchronize with query param or localStorage
  useEffect(() => {
    try {
      // 1. Check URL query param e.g. ?tier=pro
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const queryTier = urlParams.get("tier") as PlanTier | null;
        if (queryTier && ["free", "starter", "pro", "enterprise"].includes(queryTier)) {
          setTierState(queryTier);
          localStorage.setItem("seoseite_tier", queryTier);
          return;
        }

        // 2. Check localStorage
        const storedTier = localStorage.getItem("seoseite_tier") as PlanTier | null;
        if (storedTier && ["free", "starter", "pro", "enterprise"].includes(storedTier)) {
          setTierState(storedTier);
        }

        // 3. Check daily scan quota tracking
        const todayStr = new Date().toISOString().split("T")[0];
        const storedDate = localStorage.getItem("seoseite_quota_date");
        if (storedDate === todayStr) {
          const count = parseInt(localStorage.getItem("seoseite_quota_scans") || "0", 10);
          setScansUsed(isNaN(count) ? 0 : count);
        } else {
          localStorage.setItem("seoseite_quota_date", todayStr);
          localStorage.setItem("seoseite_quota_scans", "0");
          setScansUsed(0);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  const setTier = (newTier: PlanTier) => {
    setTierState(newTier);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("seoseite_tier", newTier);
      }
    } catch {
      // ignore
    }
  };

  const limits = getPlanLimits(tier);
  const remainingScans = Math.max(0, limits.dailyScans - scansUsed);

  const recordScan = (): boolean => {
    if (limits.dailyScans !== Infinity && scansUsed >= limits.dailyScans) {
      triggerUpgradeModal({
        requiredTier: tier === "free" ? "starter" : "pro",
        featureTitle: "Daily Scan Quota Reached",
        description: `You have completed all ${limits.dailyScans} daily scans on the ${tier.toUpperCase()} tier. Upgrade to unlock higher or unlimited scan capacity.`,
      });
      return false;
    }

    const nextCount = scansUsed + 1;
    setScansUsed(nextCount);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("seoseite_quota_scans", nextCount.toString());
      }
    } catch {
      // ignore
    }
    return true;
  };

  const canAccess = (feature: keyof PlanLimits): boolean => {
    return canAccessFeature(tier, feature);
  };

  const triggerUpgradeModal = (config: UpgradeModalConfig) => {
    setModalConfig(config);
  };

  return (
    <PlanContext.Provider
      value={{
        tier,
        setTier,
        scansUsed,
        remainingScans,
        recordScan,
        canAccess,
        limits,
        triggerUpgradeModal,
      }}
    >
      {children}
      {modalConfig && (
        <UpgradeGateModal
          isOpen={true}
          onClose={() => setModalConfig(null)}
          requiredTier={modalConfig.requiredTier}
          featureTitle={modalConfig.featureTitle}
          description={modalConfig.description}
          onSimulateUpgrade={(upgradedTier) => {
            setTier(upgradedTier);
            setModalConfig(null);
          }}
        />
      )}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
