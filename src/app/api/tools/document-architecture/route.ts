import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { scrapeWebsite, HeadingNode, HeadingIssue } from "@/lib/modules/seo/fetcher";
import { SsrfSecurityError } from "@/lib/security/ssrf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || targetUrl.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Missing required 'url' parameter." },
      { status: 400 }
    );
  }

  try {
    const pageData = await scrapeWebsite(targetUrl.trim());

    let headings = pageData.headings;

    // Bulletproof safeguard: If cached fetcher module didn't populate items, extract from rawHtml
    if (!headings.items || headings.items.length === 0) {
      const $ = cheerio.load(pageData.rawHtml || "");
      const items: HeadingNode[] = [];
      const issues: HeadingIssue[] = [];
      let prevLevel = 0;
      let skippedLevelsCount = 0;
      let emptyHeadingsCount = 0;
      let maxDepth = 0;

      $("h1, h2, h3, h4, h5, h6").each((idx, el) => {
        const rawTag = (el.tagName || "").toLowerCase();
        const tagName = (["h1", "h2", "h3", "h4", "h5", "h6"].includes(rawTag) ? rawTag : "h2") as HeadingNode["tag"];
        const level = parseInt(tagName.replace("h", ""), 10);
        if (level > maxDepth) maxDepth = level;

        const rawText = $(el).text();
        const text = rawText.replace(/\s+/g, " ").trim();
        const charCount = text.length;
        const isEmpty = charCount === 0;
        const isOverLength = charCount > 70;
        const isSkipped = prevLevel > 0 && level > prevLevel + 1;

        if (isEmpty) {
          emptyHeadingsCount++;
          issues.push({
            type: "empty_heading",
            severity: "warning",
            message: `Empty <${tagName.toUpperCase()}> tag found with no text content.`,
            tag: tagName,
            order: idx + 1,
          });
        }

        if (isOverLength) {
          issues.push({
            type: "long_heading",
            severity: "info",
            message: `<${tagName.toUpperCase()}> is ${charCount} chars long (recommended: < 70 chars for optimal snippet extraction).`,
            tag: tagName,
            text,
            order: idx + 1,
          });
        }

        if (isSkipped) {
          skippedLevelsCount++;
          issues.push({
            type: "skipped_level",
            severity: "warning",
            message: `Skipped heading level: jumped from <H${prevLevel}> directly to <H${level}> without intermediate <H${prevLevel + 1}>.`,
            tag: tagName,
            text,
            order: idx + 1,
          });
        }

        items.push({
          tag: tagName,
          level,
          text: isEmpty ? "(Empty Heading Tag)" : text,
          charCount,
          order: idx + 1,
          isSkipped,
          isEmpty,
          isOverLength,
        });

        prevLevel = level;
      });

      if (headings.h1Count === 0) {
        issues.unshift({
          type: "missing_h1",
          severity: "error",
          message: "Missing <H1> heading tag. Every crawlable page must have exactly one root H1 tag to establish main subject authority.",
          tag: "h1",
        });
      } else if (headings.h1Count > 1) {
        issues.unshift({
          type: "multiple_h1",
          severity: "warning",
          message: `Multiple (${headings.h1Count}) <H1> tags detected. Search engines recommend a single H1 to establish primary topic focus.`,
          tag: "h1",
        });
      }

      let calcScore = 100;
      if (headings.h1Count === 0) calcScore -= 30;
      else if (headings.h1Count > 1) calcScore -= (headings.h1Count - 1) * 10;
      if (headings.h2Count === 0) calcScore -= 20;
      calcScore -= Math.min(30, skippedLevelsCount * 8);
      calcScore -= Math.min(20, emptyHeadingsCount * 10);
      const hierarchyScore = Math.max(15, Math.min(100, calcScore));

      headings = {
        ...headings,
        items,
        issues,
        hierarchyScore,
        skippedLevelsCount,
        emptyHeadingsCount,
        maxDepth,
      };
    }

    return NextResponse.json({
      success: true,
      url: pageData.finalUrl,
      domain: pageData.domain,
      title: pageData.title,
      wordCount: pageData.wordCount,
      responseTimeMs: pageData.responseTimeMs,
      headings,
      readingTimeMinutes: Math.max(1, Math.ceil(pageData.wordCount / 200)),
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json(
        { success: false, error: "Security Exception: Internal or reserved addresses cannot be audited." },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to inspect document architecture." },
      { status: 500 }
    );
  }
}
