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
  keywordGap?: {
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

  // Build AI Comparative Summary
  let headline = "";
  if (Math.abs(seoScoreDiff) <= 5) {
    headline = `Evenly Matched Technical SEO: ${siteA.page.domain} (${siteA.audit.overallScore}/100) vs ${siteB.page.domain} (${siteB.audit.overallScore}/100)`;
  } else if (seoScoreDiff > 0) {
    headline = `${siteA.page.domain} Leads Technical SEO by ${seoScoreDiff} Points over ${siteB.page.domain}`;
  } else {
    headline = `${siteB.page.domain} Leads Technical SEO by ${Math.abs(seoScoreDiff)} Points over ${siteA.page.domain}`;
  }

  const overview = `Comparing ${siteA.page.domain} and ${siteB.page.domain} reveals distinct architectural approaches. ${
    siteA.page.domain
  } achieved an overall technical score of ${siteA.audit.overallScore}/100 with a ${
    siteA.performance.scores.performance
  }/100 PageSpeed rating, while ${siteB.page.domain} scored ${siteB.audit.overallScore}/100 with a ${
    siteB.performance.scores.performance
  }/100 PageSpeed rating. Shared technologies include ${
    shared.length > 0 ? shared.join(", ") : "no overlapping public libraries"
  }.`;

  const strengthsA: string[] = [];
  if (siteA.audit.overallScore > siteB.audit.overallScore) {
    strengthsA.push(`Higher technical SEO score (${siteA.audit.overallScore} vs ${siteB.audit.overallScore}).`);
  }
  if (siteA.page.responseTimeMs < siteB.page.responseTimeMs) {
    strengthsA.push(`Faster initial server response time (${siteA.page.responseTimeMs}ms vs ${siteB.page.responseTimeMs}ms).`);
  }
  if (siteA.performance.vitals.lcp.numericValue < siteB.performance.vitals.lcp.numericValue) {
    strengthsA.push(`Faster Largest Contentful Paint (${siteA.performance.vitals.lcp.value} vs ${siteB.performance.vitals.lcp.value}).`);
  }
  if (siteA.page.images.missingAlt === 0 && siteB.page.images.missingAlt > 0) {
    strengthsA.push(`Complete image alt accessibility (100% compliant).`);
  }
  if (strengthsA.length === 0) {
    strengthsA.push(`Maintains solid indexability signals and valid HTML viewport.`);
  }

  const strengthsB: string[] = [];
  if (siteB.audit.overallScore > siteA.audit.overallScore) {
    strengthsB.push(`Higher technical SEO score (${siteB.audit.overallScore} vs ${siteA.audit.overallScore}).`);
  }
  if (siteB.page.responseTimeMs < siteA.page.responseTimeMs) {
    strengthsB.push(`Faster initial server response time (${siteB.page.responseTimeMs}ms vs ${siteA.page.responseTimeMs}ms).`);
  }
  if (siteB.performance.vitals.lcp.numericValue < siteA.performance.vitals.lcp.numericValue) {
    strengthsB.push(`Faster Largest Contentful Paint (${siteB.performance.vitals.lcp.value} vs ${siteB.performance.vitals.lcp.value}).`);
  }
  if (siteB.page.headings.h1Count === 1 && siteA.page.headings.h1Count !== 1) {
    strengthsB.push(`Clean single H1 document hierarchy.`);
  }
  if (strengthsB.length === 0) {
    strengthsB.push(`Maintains responsive layout structure and public discoverability.`);
  }

  const conclusion = `Both sites demonstrate modern web development practices. ${
    seoScoreDiff >= 0 ? siteA.page.domain : siteB.page.domain
  } holds the technical advantage in document markup and metadata precision, while each domain excels in different infrastructure choices.`;

  // Keyword Content Gap Analysis
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
    keywordGap: {
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
