/**
 * SeoSeite Plan Tier Policy & Quota Engine
 * Defines feature flags, rate limits, and access rules for Free, Starter, Pro, and Enterprise tiers.
 */

export type PlanTier = "free" | "starter" | "pro" | "enterprise";

export interface PlanLimits {
  dailyScans: number;
  maxProjects: number;
  maxLinksCrawled: number;
  allowCompetitorCompare: boolean;
  allowTopicGap: boolean;
  allowAIFixes: boolean;
  allowWhiteLabelPDF: boolean;
  allowApiAccess: boolean;
  includedSeats: number;
}

export const PLAN_CONFIGS: Record<PlanTier, PlanLimits> = {
  free: {
    dailyScans: 5,
    maxProjects: 1,
    maxLinksCrawled: 25,
    allowCompetitorCompare: false,
    allowTopicGap: false,
    allowAIFixes: false,
    allowWhiteLabelPDF: false,
    allowApiAccess: false,
    includedSeats: 1,
  },
  starter: {
    dailyScans: 50,
    maxProjects: 5,
    maxLinksCrawled: 50,
    allowCompetitorCompare: false,
    allowTopicGap: false,
    allowAIFixes: false,
    allowWhiteLabelPDF: false,
    allowApiAccess: false,
    includedSeats: 1,
  },
  pro: {
    dailyScans: Infinity,
    maxProjects: 25,
    maxLinksCrawled: 500,
    allowCompetitorCompare: true,
    allowTopicGap: true,
    allowAIFixes: true,
    allowWhiteLabelPDF: false,
    allowApiAccess: false,
    includedSeats: 3,
  },
  enterprise: {
    dailyScans: Infinity,
    maxProjects: Infinity,
    maxLinksCrawled: 5000,
    allowCompetitorCompare: true,
    allowTopicGap: true,
    allowAIFixes: true,
    allowWhiteLabelPDF: true,
    allowApiAccess: true,
    includedSeats: Infinity,
  },
};

export function getPlanLimits(tier: PlanTier): PlanLimits {
  return PLAN_CONFIGS[tier] || PLAN_CONFIGS.free;
}

export function canAccessFeature(tier: PlanTier, feature: keyof PlanLimits): boolean {
  const config = getPlanLimits(tier);
  return Boolean(config[feature]);
}

export function formatTierName(tier: PlanTier): string {
  switch (tier) {
    case "free":
      return "Free Webmaster";
    case "starter":
      return "Starter";
    case "pro":
      return "Pro Analyst";
    case "enterprise":
      return "Agency & Enterprise";
    default:
      return "Free Webmaster";
  }
}
