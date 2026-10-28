import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { extractKeywordAnalysis } from "@/lib/modules/keywords/extractor";
import { SsrfSecurityError } from "@/lib/security/ssrf";

interface KeywordFrequency {
  term: string;
  targetCount: number;
  competitorCount: number;
  gapStatus: "missing" | "shared" | "lead";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetUrl, competitorUrl } = body;

    if (!targetUrl || typeof targetUrl !== "string" || !competitorUrl || typeof competitorUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "Both 'targetUrl' and 'competitorUrl' are required." },
        { status: 400 }
      );
    }

    const normalizeUrl = (u: string) => {
      let trimmed = u.trim();
      if (!/^https?:\/\//i.test(trimmed)) {
        trimmed = "https://" + trimmed;
      }
      return trimmed;
    };

    // Scrape both URLs in parallel
    const [targetPage, competitorPage] = await Promise.all([
      scrapeWebsite(normalizeUrl(targetUrl)),
      scrapeWebsite(normalizeUrl(competitorUrl)),
    ]);

    // Extract keyword profiles
    const targetKeywords = extractKeywordAnalysis(
      targetPage.rawHtml,
      targetPage.title,
      targetPage.headings.h1Items
    );

    const competitorKeywords = extractKeywordAnalysis(
      competitorPage.rawHtml,
      competitorPage.title,
      competitorPage.headings.h1Items
    );

    // Map keywords to counts
    const targetMap = new Map<string, number>();
    targetKeywords.topSingleKeywords.forEach((k) => targetMap.set(k.phrase.toLowerCase(), k.count));
    targetKeywords.topTwoWordPhrases.forEach((k) => targetMap.set(k.phrase.toLowerCase(), k.count));

    const compMap = new Map<string, number>();
    competitorKeywords.topSingleKeywords.forEach((k) => compMap.set(k.phrase.toLowerCase(), k.count));
    competitorKeywords.topTwoWordPhrases.forEach((k) => compMap.set(k.phrase.toLowerCase(), k.count));

    // Calculate Content Gap Matrix with TF-IDF Opportunity Scoring
    const missingOnTarget: Array<KeywordFrequency & { opportunityScore: number; inCompTitleOrH1: boolean; isTwoWord: boolean }> = [];
    const sharedKeywords: Array<KeywordFrequency & { isTwoWord: boolean }> = [];
    const targetLeads: Array<KeywordFrequency & { inTargetTitleOrH1: boolean; isTwoWord: boolean }> = [];

    const compTitleLower = (competitorPage.title || "").toLowerCase();
    const compH1Lower = competitorPage.headings.h1Items.join(" ").toLowerCase();
    const targetTitleLower = (targetPage.title || "").toLowerCase();
    const targetH1Lower = targetPage.headings.h1Items.join(" ").toLowerCase();

    // Check competitor terms
    compMap.forEach((count, term) => {
      const targetCount = targetMap.get(term) || 0;
      const inCompTitleOrH1 = compTitleLower.includes(term) || compH1Lower.includes(term);
      const isTwoWord = term.includes(" ");
      const rawOpp = Math.min(99, 45 + count * 8 + (inCompTitleOrH1 ? 22 : 0) + (isTwoWord ? 12 : 0));

      if (targetCount === 0) {
        missingOnTarget.push({
          term,
          targetCount: 0,
          competitorCount: count,
          gapStatus: "missing",
          opportunityScore: rawOpp,
          inCompTitleOrH1,
          isTwoWord,
        });
      } else {
        sharedKeywords.push({
          term,
          targetCount,
          competitorCount: count,
          gapStatus: "shared",
          isTwoWord,
        });
      }
    });

    // Check target-only terms (Defensive Moats)
    targetMap.forEach((count, term) => {
      if (!compMap.has(term)) {
        const inTargetTitleOrH1 = targetTitleLower.includes(term) || targetH1Lower.includes(term);
        const isTwoWord = term.includes(" ");
        targetLeads.push({
          term,
          targetCount: count,
          competitorCount: 0,
          gapStatus: "lead",
          inTargetTitleOrH1,
          isTwoWord,
        });
      }
    });

    // Sort by TF-IDF opportunity & prominence
    missingOnTarget.sort((a, b) => b.opportunityScore - a.opportunityScore || b.competitorCount - a.competitorCount);
    sharedKeywords.sort((a, b) => b.competitorCount + b.targetCount - (a.competitorCount + a.targetCount));
    targetLeads.sort((a, b) => b.targetCount - a.targetCount);

    // Heading topic gaps
    const targetHeadings = new Set(
      [...targetPage.headings.h1Items, ...targetPage.headings.h2Samples].map((h: string) => h.toLowerCase().trim())
    );

    const missingTopics = competitorPage.headings.h2Samples
      .filter((h: string) => !targetHeadings.has(h.toLowerCase().trim()) && h.length > 5)
      .slice(0, 10);

    // Content length disparity
    const wordDiff = competitorPage.wordCount - targetPage.wordCount;

    // AI Actionable Outline suggestions
    const suggestedOutline = missingTopics.slice(0, 6).map((topic: string, i: number) => ({
      heading: topic,
      recommendedKeywords: missingOnTarget.slice(i * 2, i * 2 + 3).map((k) => k.term),
      importance: i === 0 ? "Critical" : i < 3 ? "High" : "Medium",
    }));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      target: {
        domain: targetPage.domain,
        url: targetPage.finalUrl,
        wordCount: targetPage.wordCount,
        title: targetPage.title,
        h1Count: targetPage.headings.h1Count,
        h2Count: targetPage.headings.h2Count,
      },
      competitor: {
        domain: competitorPage.domain,
        url: competitorPage.finalUrl,
        wordCount: competitorPage.wordCount,
        title: competitorPage.title,
        h1Count: competitorPage.headings.h1Count,
        h2Count: competitorPage.headings.h2Count,
      },
      gapSummary: {
        missingKeywordsCount: missingOnTarget.length,
        sharedKeywordsCount: sharedKeywords.length,
        targetLeadsCount: targetLeads.length,
        wordDisparity: wordDiff, // positive means competitor has more words
        topicCoverageScore: Math.max(
          10,
          Math.min(95, Math.round((sharedKeywords.length / (sharedKeywords.length + missingOnTarget.length || 1)) * 100))
        ),
      },
      missingKeywords: missingOnTarget.slice(0, 50),
      sharedKeywords: sharedKeywords.slice(0, 50),
      targetLeads: targetLeads.slice(0, 50),
      missingTopics,
      suggestedOutline,
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: `SSRF Security Error: ${err.message}` }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to analyze content gap." },
      { status: 500 }
    );
  }
}
