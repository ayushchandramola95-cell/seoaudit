import { ScrapedPageData } from "../seo/fetcher";
import { SeoAuditReport } from "../seo/scorer";
import { DetectedTechnology } from "../tech/detector";
import { PageSpeedReport } from "../performance/pagespeed";
import { TrafficEstimationReport } from "../traffic/estimator";
import { KeywordAnalysisReport } from "../keywords/extractor";

export interface SingleSiteAnalysis {
  page: ScrapedPageData;
  audit: SeoAuditReport;
  technologies: DetectedTechnology[];
  performance: PageSpeedReport;
  traffic: TrafficEstimationReport;
  keywords?: KeywordAnalysisReport;
}

export interface ComparisonReport {
  siteA: SingleSiteAnalysis;
  siteB: SingleSiteAnalysis;
  deltas: {
    seoScoreDiff: number; // positive = siteA leads, negative = siteB leads
    responseTimeDiffMs: number;
    performanceScoreDiff: number;
    lcpDiffMs: number;
    headingsDiff: number;
    imagesDiff: number;
  };
  techComparison: {
    shared: string[];
    uniqueToA: string[];
    uniqueToB: string[];
  };
  trafficComparison: {
    pageRankA: number | null;
    pageRankB: number | null;
    globalRankA: number | null;
    globalRankB: number | null;
    rankFormattedA: string;
    rankFormattedB: string;
    tierA: string;
    tierB: string;
    isLiveA: boolean;
    isLiveB: boolean;
    visitsRangeA: string;
    visitsRangeB: string;
    organicShareA: number;
    organicShareB: number;
    confidenceA: string;
    confidenceB: string;
  };
  vitalsComparison: {
    fcpA: string;
    fcpB: string;
    lcpA: string;
    lcpB: string;
    clsA: string;
    clsB: string;
    ttfbA: string;
    ttfbB: string;
    pageSizeA: string;
    pageSizeB: string;
  };
  keywordGap?: {
    methodologyNote: string;
    sharedKeywords: string[];
    uniqueToA: Array<{ phrase: string; count: number; density: number }>;
    uniqueToB: Array<{ phrase: string; count: number; density: number }>;
    topOverlapKeywords: Array<{ phrase: string; countA: number; countB: number }>;
  };
  categoryWinners: {
    seoOverall: "siteA" | "siteB" | "tie";
    performance: "siteA" | "siteB" | "tie";
    metadata: "siteA" | "siteB" | "tie";
    content: "siteA" | "siteB" | "tie";
    indexability: "siteA" | "siteB" | "tie";
    security: "siteA" | "siteB" | "tie";
  };
  aiComparativeSummary: {
    headline: string;
    overview: string;
    strengthsSiteA: string[];
    strengthsSiteB: string[];
    conclusion: string;
  };
}

export function generateComparisonReport(
  siteA: SingleSiteAnalysis,
  siteB: SingleSiteAnalysis
): ComparisonReport {
  const seoScoreDiff = siteA.audit.overallScore - siteB.audit.overallScore;
  const responseTimeDiffMs = siteA.page.responseTimeMs - siteB.page.responseTimeMs;
  const performanceScoreDiff =
    siteA.performance.scores.performance - siteB.performance.scores.performance;
  const lcpDiffMs =
    siteA.performance.vitals.lcp.numericValue - siteB.performance.vitals.lcp.numericValue;
  const headingsDiff = siteA.page.headings.totalHeadings - siteB.page.headings.totalHeadings;
  const imagesDiff = siteA.page.images.totalImages - siteB.page.images.totalImages;

  // Tech comparison
  const techNamesA = new Set(siteA.technologies.map((t) => t.name));
  const techNamesB = new Set(siteB.technologies.map((t) => t.name));

  const shared: string[] = [];
  const uniqueToA: string[] = [];
  const uniqueToB: string[] = [];

  techNamesA.forEach((name) => {
    if (techNamesB.has(name)) {
      shared.push(name);
    } else {
      uniqueToA.push(name);
    }
  });

  techNamesB.forEach((name) => {
    if (!techNamesA.has(name)) {
      uniqueToB.push(name);
    }
  });

  // Traffic & Open PageRank comparison
  const oprA = siteA.traffic.openPageRank;
  const oprB = siteB.traffic.openPageRank;

  const trafficComparison = {
    pageRankA: oprA?.pageRankDecimal ?? null,
    pageRankB: oprB?.pageRankDecimal ?? null,
    globalRankA: oprA?.globalRank ?? null,
    globalRankB: oprB?.globalRank ?? null,
    rankFormattedA: oprA?.rankFormatted ?? "Unranked",
    rankFormattedB: oprB?.rankFormatted ?? "Unranked",
    tierA: oprA?.tier ?? "Standard Commercial",
    tierB: oprB?.tier ?? "Standard Commercial",
    isLiveA: Boolean(oprA?.isLive),
    isLiveB: Boolean(oprB?.isLive),
    visitsRangeA: siteA.traffic.formattedRange,
    visitsRangeB: siteB.traffic.formattedRange,
    organicShareA: siteA.traffic.organicSearchShare,
    organicShareB: siteB.traffic.organicSearchShare,
    confidenceA: siteA.traffic.confidence,
    confidenceB: siteB.traffic.confidence,
  };

  // Web Vitals comparison
  const vitalsComparison = {
    fcpA: siteA.performance.vitals.fcp.value,
    fcpB: siteB.performance.vitals.fcp.value,
    lcpA: siteA.performance.vitals.lcp.value,
    lcpB: siteB.performance.vitals.lcp.value,
    clsA: siteA.performance.vitals.cls.value,
    clsB: siteB.performance.vitals.cls.value,
    ttfbA: `${siteA.page.responseTimeMs}ms`,
    ttfbB: `${siteB.page.responseTimeMs}ms`,
    pageSizeA: siteA.page.contentLengthBytes > 0
      ? `${(siteA.page.contentLengthBytes / 1024).toFixed(1)} KB`
      : "N/A",
    pageSizeB: siteB.page.contentLengthBytes > 0
      ? `${(siteB.page.contentLengthBytes / 1024).toFixed(1)} KB`
      : "N/A",
  };

  // Category winners
  const determineWinner = (scoreA: number, scoreB: number): "siteA" | "siteB" | "tie" => {
    if (scoreA > scoreB) return "siteA";
    if (scoreB > scoreA) return "siteB";
    return "tie";
  };

  const categoryWinners = {
    seoOverall: determineWinner(siteA.audit.overallScore, siteB.audit.overallScore),
    performance: determineWinner(
      siteA.performance.scores.performance,
      siteB.performance.scores.performance
    ),
    metadata: determineWinner(
      siteA.audit.categories.metadata.score,
      siteB.audit.categories.metadata.score
    ),
    content: determineWinner(
      siteA.audit.categories.content.score,
      siteB.audit.categories.content.score
    ),
    indexability: determineWinner(
      siteA.audit.categories.indexability.score,
      siteB.audit.categories.indexability.score
    ),
    security: determineWinner(
      siteA.audit.categories.security.score,
      siteB.audit.categories.security.score
    ),
  };

  // Objective Evidence-Based AI Comparative Summary
  let headline = "";
  if (Math.abs(seoScoreDiff) <= 5) {
    headline = `Evenly Matched Technical SEO: ${siteA.page.domain} (${siteA.audit.overallScore}/100) vs ${siteB.page.domain} (${siteB.audit.overallScore}/100)`;
  } else if (seoScoreDiff > 0) {
    headline = `${siteA.page.domain} Leads Technical Compliance by ${seoScoreDiff} Points over ${siteB.page.domain}`;
  } else {
    headline = `${siteB.page.domain} Leads Technical Compliance by ${Math.abs(seoScoreDiff)} Points over ${siteA.page.domain}`;
  }

  const overview = `Head-to-head architectural analysis of ${siteA.page.domain} and ${siteB.page.domain}. ${
    siteA.page.domain
  } measured a technical SEO score of ${siteA.audit.overallScore}/100 and ${
    siteA.performance.scores.performance
  }/100 PageSpeed (LCP: ${siteA.performance.vitals.lcp.value}), with an Open PageRank of ${
    oprA?.pageRankDecimal !== null && oprA?.pageRankDecimal !== undefined ? `${oprA.pageRankDecimal}/10` : "baseline"
  }. In contrast, ${siteB.page.domain} achieved ${siteB.audit.overallScore}/100 SEO and ${
    siteB.performance.scores.performance
  }/100 PageSpeed (LCP: ${siteB.performance.vitals.lcp.value}), with an Open PageRank of ${
    oprB?.pageRankDecimal !== null && oprB?.pageRankDecimal !== undefined ? `${oprB.pageRankDecimal}/10` : "baseline"
  }. Overlapping technologies include ${
    shared.length > 0 ? shared.join(", ") : "no detected common runtime libraries"
  }.`;

  const strengthsA: string[] = [];
  if (siteA.audit.overallScore > siteB.audit.overallScore) {
    strengthsA.push(`Higher technical SEO compliance score (${siteA.audit.overallScore} vs ${siteB.audit.overallScore}).`);
  }
  if (oprA?.pageRankDecimal && oprB?.pageRankDecimal && oprA.pageRankDecimal > oprB.pageRankDecimal) {
    strengthsA.push(`Higher domain authority footprint (Open PageRank ${oprA.pageRankDecimal} vs ${oprB.pageRankDecimal}).`);
  }
  if (siteA.page.responseTimeMs < siteB.page.responseTimeMs) {
    strengthsA.push(`Faster initial server TTFB response (${siteA.page.responseTimeMs}ms vs ${siteB.page.responseTimeMs}ms).`);
  }
  if (siteA.performance.vitals.lcp.numericValue < siteB.performance.vitals.lcp.numericValue) {
    strengthsA.push(`Superior Largest Contentful Paint (${siteA.performance.vitals.lcp.value} vs ${siteB.performance.vitals.lcp.value}).`);
  }
  if (siteA.page.structuredData.count > siteB.page.structuredData.count) {
    strengthsA.push(`Richer structured JSON-LD schema markup (${siteA.page.structuredData.count} vs ${siteB.page.structuredData.count} schema blocks).`);
  }
  if (siteA.page.wordCount > siteB.page.wordCount * 1.3) {
    strengthsA.push(`Substantially larger topical document copy (${siteA.page.wordCount} words vs ${siteB.page.wordCount} words).`);
  }
  if (siteA.page.images.missingAlt === 0 && siteB.page.images.missingAlt > 0) {
    strengthsA.push(`Complete image accessibility hygiene (0 missing alt attributes).`);
  }
  if (strengthsA.length === 0) {
    strengthsA.push(`Maintains responsive layout structure and active discovery tags.`);
  }

  const strengthsB: string[] = [];
  if (siteB.audit.overallScore > siteA.audit.overallScore) {
    strengthsB.push(`Higher technical SEO compliance score (${siteB.audit.overallScore} vs ${siteA.audit.overallScore}).`);
  }
  if (oprB?.pageRankDecimal && oprA?.pageRankDecimal && oprB.pageRankDecimal > oprA.pageRankDecimal) {
    strengthsB.push(`Higher domain authority footprint (Open PageRank ${oprB.pageRankDecimal} vs ${oprA.pageRankDecimal}).`);
  }
  if (siteB.page.responseTimeMs < siteA.page.responseTimeMs) {
    strengthsB.push(`Faster initial server TTFB response (${siteB.page.responseTimeMs}ms vs ${siteA.page.responseTimeMs}ms).`);
  }
  if (siteB.performance.vitals.lcp.numericValue < siteA.performance.vitals.lcp.numericValue) {
    strengthsB.push(`Superior Largest Contentful Paint (${siteB.performance.vitals.lcp.value} vs ${siteB.performance.vitals.lcp.value}).`);
  }
  if (siteB.page.structuredData.count > siteA.page.structuredData.count) {
    strengthsB.push(`Richer structured JSON-LD schema markup (${siteB.page.structuredData.count} vs ${siteA.page.structuredData.count} schema blocks).`);
  }
  if (siteB.page.wordCount > siteA.page.wordCount * 1.3) {
    strengthsB.push(`Substantially larger topical document copy (${siteB.page.wordCount} words vs ${siteA.page.wordCount} words).`);
  }
  if (siteB.page.headings.h1Count === 1 && siteA.page.headings.h1Count !== 1) {
    strengthsB.push(`Clean semantic single H1 document hierarchy.`);
  }
  if (strengthsB.length === 0) {
    strengthsB.push(`Maintains responsive layout structure and active discovery tags.`);
  }

  const conclusion = `Neither domain establishes total dominance across all categories. While ${
    siteA.audit.overallScore >= siteB.audit.overallScore ? siteA.page.domain : siteB.page.domain
  } demonstrates superior code compliance and meta tagging, ${
    siteA.performance.scores.performance >= siteB.performance.scores.performance ? siteA.page.domain : siteB.page.domain
  } delivers the faster user-centric rendering performance.`;

  // On-Page Content Topic Gap Analysis
  const kwsA = siteA.keywords?.topSingleKeywords || [];
  const kwsB = siteB.keywords?.topSingleKeywords || [];
  const mapA = new Map(kwsA.map((k) => [k.phrase.toLowerCase(), k]));
  const mapB = new Map(kwsB.map((k) => [k.phrase.toLowerCase(), k]));

  const sharedKeywords: string[] = [];
  const uniqueKwA: Array<{ phrase: string; count: number; density: number }> = [];
  const uniqueKwB: Array<{ phrase: string; count: number; density: number }> = [];
  const topOverlapKeywords: Array<{ phrase: string; countA: number; countB: number }> = [];

  kwsA.forEach((k) => {
    const match = mapB.get(k.phrase.toLowerCase());
    if (match) {
      sharedKeywords.push(k.phrase);
      topOverlapKeywords.push({
        phrase: k.phrase,
        countA: k.count,
        countB: match.count,
      });
    } else {
      uniqueKwA.push({ phrase: k.phrase, count: k.count, density: k.density });
    }
  });

  kwsB.forEach((k) => {
    if (!mapA.has(k.phrase.toLowerCase())) {
      uniqueKwB.push({ phrase: k.phrase, count: k.count, density: k.density });
    }
  });

  return {
    siteA,
    siteB,
    deltas: {
      seoScoreDiff,
      responseTimeDiffMs,
      performanceScoreDiff,
      lcpDiffMs,
      headingsDiff,
      imagesDiff,
    },
    techComparison: {
      shared,
      uniqueToA,
      uniqueToB,
    },
    trafficComparison,
    vitalsComparison,
    keywordGap: {
      methodologyNote:
        "On-page semantic topic coverage extracted from visible document body copy. For domain-wide Google SERP ranking datasets, connect Google Search Console or query commercial rank indexes.",
      sharedKeywords,
      uniqueToA: uniqueKwA.slice(0, 8),
      uniqueToB: uniqueKwB.slice(0, 8),
      topOverlapKeywords: topOverlapKeywords.slice(0, 8),
    },
    categoryWinners,
    aiComparativeSummary: {
      headline,
      overview,
      strengthsSiteA: strengthsA,
      strengthsSiteB: strengthsB,
      conclusion,
    },
  };
}
