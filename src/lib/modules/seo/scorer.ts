import { ScrapedPageData } from "./fetcher";

export interface DiagnosticItem {
  id: string;
  category: "metadata" | "content" | "indexability" | "security";
  title: string;
  status: "passed" | "warning" | "error";
  pointsEarned: number;
  maxPoints: number;
  evidence: string;
  impact: string;
  recommendation?: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface SeoAuditReport {
  overallScore: number; // 0 - 100
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  summary: string;
  categories: {
    metadata: CategoryScore;
    content: CategoryScore;
    indexability: CategoryScore;
    security: CategoryScore;
  };
  passedCount: number;
  warningCount: number;
  errorCount: number;
  diagnostics: DiagnosticItem[];
}

export function calculateSeoScore(page: ScrapedPageData): SeoAuditReport {
  const diagnostics: DiagnosticItem[] = [];

  // ----------------------------------------------------
  // CATEGORY 1: METADATA (Max: 25 points)
  // ----------------------------------------------------
  let metadataPoints = 0;

  // Title presence (10 pts)
  if (page.title && page.title.trim().length > 0) {
    metadataPoints += 10;
    diagnostics.push({
      id: "meta-title-present",
      category: "metadata",
      title: "Title Tag Present",
      status: "passed",
      pointsEarned: 10,
      maxPoints: 10,
      evidence: `Found: "${page.title}"`,
      impact: "Search engines and social previews use the title tag as the primary link headline in search results.",
    });
  } else {
    diagnostics.push({
      id: "meta-title-present",
      category: "metadata",
      title: "Missing Title Tag",
      status: "error",
      pointsEarned: 0,
      maxPoints: 10,
      evidence: "No <title> tag found in HTML head.",
      impact: "Severe. Search engines cannot easily determine the core topic of this page.",
      recommendation: "Add a descriptive <title> tag between 30 and 60 characters.",
    });
  }

  // Title length optimal (5 pts)
  if (page.title) {
    const len = page.title.length;
    if (len >= 30 && len <= 60) {
      metadataPoints += 5;
      diagnostics.push({
        id: "meta-title-length",
        category: "metadata",
        title: "Optimal Title Length",
        status: "passed",
        pointsEarned: 5,
        maxPoints: 5,
        evidence: `${len} characters (recommended: 30-60 characters).`,
        impact: "The title is concise enough to avoid truncation in Google search result snippets.",
      });
    } else if (len > 0) {
      metadataPoints += 2;
      diagnostics.push({
        id: "meta-title-length",
        category: "metadata",
        title: len < 30 ? "Title Tag Too Short" : "Title Tag May Be Truncated",
        status: "warning",
        pointsEarned: 2,
        maxPoints: 5,
        evidence: `${len} characters.`,
        impact: len < 30 
          ? "Short titles miss opportunities to include relevant primary keywords."
          : "Titles over 60 characters are typically truncated with '...' on desktop and mobile search screens.",
        recommendation: "Keep the title between 30 and 60 characters for optimal visibility.",
      });
    }
  }

  // Meta description presence (7 pts)
  if (page.metaDescription && page.metaDescription.trim().length > 0) {
    metadataPoints += 7;
    diagnostics.push({
      id: "meta-desc-present",
      category: "metadata",
      title: "Meta Description Present",
      status: "passed",
      pointsEarned: 7,
      maxPoints: 7,
      evidence: `Found: "${page.metaDescription.slice(0, 80)}${page.metaDescription.length > 80 ? "..." : ""}"`,
      impact: "A compelling meta description improves organic click-through rate (CTR) from search engine results.",
    });
  } else {
    diagnostics.push({
      id: "meta-desc-present",
      category: "metadata",
      title: "Missing Meta Description",
      status: "error",
      pointsEarned: 0,
      maxPoints: 7,
      evidence: "No <meta name=\"description\"> tag found.",
      impact: "Google will automatically pick arbitrary page text, which is often less persuasive than a dedicated summary.",
      recommendation: "Add a <meta name=\"description\" content=\"...\"> tag summarizing this page.",
    });
  }

  // Meta description length optimal (3 pts)
  if (page.metaDescription) {
    const len = page.metaDescription.length;
    if (len >= 120 && len <= 160) {
      metadataPoints += 3;
      diagnostics.push({
        id: "meta-desc-length",
        category: "metadata",
        title: "Optimal Meta Description Length",
        status: "passed",
        pointsEarned: 3,
        maxPoints: 3,
        evidence: `${len} characters (ideal: 120-160 characters).`,
        impact: "Fits perfectly inside modern Google desktop and mobile snippet display boundaries.",
      });
    } else {
      metadataPoints += 1;
      diagnostics.push({
        id: "meta-desc-length",
        category: "metadata",
        title: len < 120 ? "Short Meta Description" : "Long Meta Description",
        status: "warning",
        pointsEarned: 1,
        maxPoints: 3,
        evidence: `${len} characters.`,
        impact: len < 120
          ? "Shorter descriptions may not provide enough context to maximize clicks."
          : "Descriptions over 160 characters will be clipped by search engines.",
        recommendation: "Aim for 120-160 characters to optimize snippet real estate without clipping.",
      });
    }
  }

  // ----------------------------------------------------
  // CATEGORY 2: CONTENT & HIERARCHY (Max: 25 points)
  // ----------------------------------------------------
  let contentPoints = 0;

  // H1 tag analysis (10 pts)
  if (page.headings.h1Count === 1) {
    contentPoints += 10;
    diagnostics.push({
      id: "headings-h1-single",
      category: "content",
      title: "Exactly One H1 Heading Found",
      status: "passed",
      pointsEarned: 10,
      maxPoints: 10,
      evidence: `H1: "${page.headings.h1Items[0]}"`,
      impact: "Having a single clear H1 provides unambiguous structural clarity for search crawlers and screen readers.",
    });
  } else if (page.headings.h1Count > 1) {
    contentPoints += 5;
    diagnostics.push({
      id: "headings-h1-multiple",
      category: "content",
      title: "Multiple H1 Headings Detected",
      status: "warning",
      pointsEarned: 5,
      maxPoints: 10,
      evidence: `Found ${page.headings.h1Count} H1 tags.`,
      impact: "Multiple H1s can dilute the primary page topic focus. It is best practice to reserve H1 for the main headline.",
      recommendation: "Consolidate into one main H1 heading and convert secondary headers to H2.",
    });
  } else {
    diagnostics.push({
      id: "headings-h1-missing",
      category: "content",
      title: "Missing H1 Heading",
      status: "error",
      pointsEarned: 0,
      maxPoints: 10,
      evidence: "No <h1> tag located on the page.",
      impact: "High. Crawlers rely on the H1 tag to understand the central subject matter of the document.",
      recommendation: "Add a prominent <h1> tag containing your primary target keyword.",
    });
  }

  // H2 presence (7 pts)
  if (page.headings.h2Count >= 2) {
    contentPoints += 7;
    diagnostics.push({
      id: "headings-h2-presence",
      category: "content",
      title: "Well-Structured H2 Subheadings",
      status: "passed",
      pointsEarned: 7,
      maxPoints: 7,
      evidence: `Found ${page.headings.h2Count} H2 subheadings.`,
      impact: "Good content scannability for human visitors and clear semantic topical clusters for search crawlers.",
    });
  } else if (page.headings.h2Count === 1) {
    contentPoints += 4;
    diagnostics.push({
      id: "headings-h2-limited",
      category: "content",
      title: "Limited Subheading Structure",
      status: "warning",
      pointsEarned: 4,
      maxPoints: 7,
      evidence: "Found only 1 H2 subheading.",
      impact: "Pages with more structured subsections are easier to read and rank for secondary search queries.",
      recommendation: "Break content into multiple logical sections using H2 subheadings.",
    });
  } else {
    diagnostics.push({
      id: "headings-h2-missing",
      category: "content",
      title: "No H2 Subheadings Found",
      status: "warning",
      pointsEarned: 0,
      maxPoints: 7,
      evidence: "0 H2 tags found.",
      impact: "Lack of subheadings makes text dense and harder to parse.",
      recommendation: "Organize page content into logical sections with H2 tags.",
    });
  }

  // Viewport configuration (5 pts)
  if (page.viewport && page.viewport.includes("width=device-width")) {
    contentPoints += 5;
    diagnostics.push({
      id: "content-viewport",
      category: "content",
      title: "Mobile Viewport Configured",
      status: "passed",
      pointsEarned: 5,
      maxPoints: 5,
      evidence: `Viewport: "${page.viewport}"`,
      impact: "Essential for Google Mobile-First Indexing and responsive layout rendering across mobile devices.",
    });
  } else {
    diagnostics.push({
      id: "content-viewport",
      category: "content",
      title: "Missing or Incomplete Mobile Viewport",
      status: "error",
      pointsEarned: 0,
      maxPoints: 5,
      evidence: page.viewport ? `Found: "${page.viewport}"` : "No <meta name=\"viewport\"> tag.",
      impact: "Critical. Mobile devices may render the page with an awkward desktop scale, triggering mobile usability penalties.",
      recommendation: "Include <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">.",
    });
  }

  // HTML Language attribute (3 pts)
  if (page.language && page.language.trim().length > 0) {
    contentPoints += 3;
    diagnostics.push({
      id: "content-language",
      category: "content",
      title: "Language Attribute Defined",
      status: "passed",
      pointsEarned: 3,
      maxPoints: 3,
      evidence: `html lang="${page.language}"`,
      impact: "Helps search engines understand target language and enables screen readers to use appropriate pronunciation rules.",
    });
  } else {
    diagnostics.push({
      id: "content-language",
      category: "content",
      title: "Missing Language Attribute",
      status: "warning",
      pointsEarned: 0,
      maxPoints: 3,
      evidence: "<html lang=\"...\"> is missing or blank.",
      impact: "Minor accessibility and internationalization gap.",
      recommendation: "Add a valid lang attribute to the <html> root tag (e.g. lang=\"en\").",
    });
  }

  // ----------------------------------------------------
  // CATEGORY 3: INDEXABILITY & STRUCTURE (Max: 25 points)
  // ----------------------------------------------------
  let indexPoints = 0;

  // Robots meta indexability (8 pts)
  const isNoindex = page.robotsMeta?.toLowerCase().includes("noindex");
  if (!isNoindex) {
    indexPoints += 8;
    diagnostics.push({
      id: "index-robots-allowed",
      category: "indexability",
      title: "Search Indexing Permitted",
      status: "passed",
      pointsEarned: 8,
      maxPoints: 8,
      evidence: page.robotsMeta ? `robots: "${page.robotsMeta}"` : "No blocking robots meta tag detected.",
      impact: "Search engine crawlers are allowed to index this page into search result listings.",
    });
  } else {
    diagnostics.push({
      id: "index-robots-blocked",
      category: "indexability",
      title: "Indexing Explicitly Blocked (noindex)",
      status: "error",
      pointsEarned: 0,
      maxPoints: 8,
      evidence: `robots: "${page.robotsMeta}"`,
      impact: "Severe. The 'noindex' directive instructs search engines not to show this page in public search results.",
      recommendation: "Remove 'noindex' from your robots meta tag if you want this page to be discoverable in Google.",
    });
  }

  // Canonical tag (6 pts)
  if (page.canonicalUrl && page.canonicalUrl.trim().length > 0) {
    indexPoints += 6;
    diagnostics.push({
      id: "index-canonical-present",
      category: "indexability",
      title: "Canonical Link Specified",
      status: "passed",
      pointsEarned: 6,
      maxPoints: 6,
      evidence: `Canonical: "${page.canonicalUrl}"`,
      impact: "Prevents duplicate content confusion when the page is reachable via multiple parameters or protocols.",
    });
  } else {
    diagnostics.push({
      id: "index-canonical-missing",
      category: "indexability",
      title: "Missing Canonical Tag",
      status: "warning",
      pointsEarned: 0,
      maxPoints: 6,
      evidence: "No <link rel=\"canonical\" href=\"...\"> found.",
      impact: "Search engines may index duplicate variations if tracking query strings or alternate URLs are crawled.",
      recommendation: "Add a self-referencing canonical tag to reinforce the definitive page URL.",
    });
  }

  // Sitemaps or robots.txt availability (5 pts)
  if (page.hasRobotsTxt || page.hasSitemapXml) {
    indexPoints += 5;
    diagnostics.push({
      id: "index-crawl-files",
      category: "indexability",
      title: "Crawler Guidance Files Detected",
      status: "passed",
      pointsEarned: 5,
      maxPoints: 5,
      evidence: `${page.hasRobotsTxt ? "robots.txt active" : ""}${page.hasRobotsTxt && page.hasSitemapXml ? ", " : ""}${page.hasSitemapXml ? "sitemap.xml found" : ""}`,
      impact: "Guides search bots on crawl rules and helps index newly published pages faster.",
    });
  } else {
    diagnostics.push({
      id: "index-crawl-files",
      category: "indexability",
      title: "robots.txt or sitemap.xml Unreachable",
      status: "warning",
      pointsEarned: 0,
      maxPoints: 5,
      evidence: "Neither /robots.txt nor /sitemap.xml returned a 200 OK response on standard root paths.",
      impact: "Crawlers must guess indexing paths without an explicit sitemap feed.",
      recommendation: "Publish a sitemap.xml and robots.txt at your domain root.",
    });
  }

  // Structured Data (JSON-LD) (6 pts)
  if (page.structuredData.detected) {
    indexPoints += 6;
    diagnostics.push({
      id: "index-structured-data",
      category: "indexability",
      title: "Structured Data (Schema) Found",
      status: "passed",
      pointsEarned: 6,
      maxPoints: 6,
      evidence: `Found ${page.structuredData.count} JSON-LD block(s) with types: ${page.structuredData.types.join(", ")}`,
      impact: "Qualifies page for rich snippets in search results (stars, breadcrumbs, sitelinks search box).",
    });
  } else {
    diagnostics.push({
      id: "index-structured-data",
      category: "indexability",
      title: "No JSON-LD Structured Data Detected",
      status: "warning",
      pointsEarned: 0,
      maxPoints: 6,
      evidence: "No <script type=\"application/ld+json\"> tags found.",
      impact: "Missing out on Google Rich Snippets, Knowledge Graph linking, and enhanced search listings.",
      recommendation: "Add Schema.org JSON-LD (e.g. WebSite, Organization, or Article schema).",
    });
  }

  // ----------------------------------------------------
  // CATEGORY 4: SECURITY & ASSET QUALITY (Max: 25 points)
  // ----------------------------------------------------
  let securityPoints = 0;

  // HTTPS (10 pts)
  if (page.isHttps) {
    securityPoints += 10;
    diagnostics.push({
      id: "sec-https-active",
      category: "security",
      title: "HTTPS Encryption Active",
      status: "passed",
      pointsEarned: 10,
      maxPoints: 10,
      evidence: "Encrypted connection via HTTPS.",
      impact: "Google confirmed HTTPS as a lightweight ranking factor and modern browsers flag unencrypted sites.",
    });
  } else {
    diagnostics.push({
      id: "sec-https-active",
      category: "security",
      title: "Unencrypted HTTP Connection",
      status: "error",
      pointsEarned: 0,
      maxPoints: 10,
      evidence: "Connected over unencrypted http:// protocol.",
      impact: "Severe. Browsers display 'Not Secure' warnings and search engines de-prioritize non-HTTPS pages.",
      recommendation: "Install an SSL/TLS certificate (e.g. via Let's Encrypt or Cloudflare) and enforce HTTPS redirects.",
    });
  }

  // HSTS Header (5 pts)
  if (page.securityHeaders.hsts) {
    securityPoints += 5;
    diagnostics.push({
      id: "sec-hsts-present",
      category: "security",
      title: "HSTS Header Enforced",
      status: "passed",
      pointsEarned: 5,
      maxPoints: 5,
      evidence: "Strict-Transport-Security header present.",
      impact: "Protects visitors against man-in-the-middle SSL-stripping attacks by forcing HTTPS in browsers.",
    });
  } else {
    diagnostics.push({
      id: "sec-hsts-missing",
      category: "security",
      title: "Missing HSTS Header",
      status: "warning",
      pointsEarned: 0,
      maxPoints: 5,
      evidence: "Strict-Transport-Security header not returned by server.",
      impact: "First-time HTTP requests can theoretically be intercepted before redirecting to HTTPS.",
      recommendation: "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains' to server headers.",
    });
  }

  // Image Alt attributes (5 pts)
  if (page.images.totalImages === 0) {
    securityPoints += 5;
    diagnostics.push({
      id: "quality-img-alt",
      category: "security",
      title: "No Image Accessibility Issues",
      status: "passed",
      pointsEarned: 5,
      maxPoints: 5,
      evidence: "No <img> tags found on the page.",
      impact: "No images requiring alt attributes.",
    });
  } else if (page.images.missingAlt === 0) {
    securityPoints += 5;
    diagnostics.push({
      id: "quality-img-alt",
      category: "security",
      title: "All Images Have Alt Attributes",
      status: "passed",
      pointsEarned: 5,
      maxPoints: 5,
      evidence: `100% compliance (${page.images.withAlt} of ${page.images.totalImages} images have alt text).`,
      impact: "Enhances screen reader accessibility and helps image search rankings in Google Images.",
    });
  } else {
    const ratio = page.images.withAlt / page.images.totalImages;
    const earned = Math.round(ratio * 5);
    securityPoints += earned;
    diagnostics.push({
      id: "quality-img-alt",
      category: "security",
      title: "Images Missing Descriptive Alt Text",
      status: "warning",
      pointsEarned: earned,
      maxPoints: 5,
      evidence: `${page.images.missingAlt} of ${page.images.totalImages} images lack descriptive alt attributes.`,
      impact: "Impedes accessibility for visually impaired users and loses image search ranking potential.",
      recommendation: "Add descriptive, concise alt attributes to informative images and empty alt=\"\" for purely decorative graphics.",
    });
  }

  // OpenGraph social preview metadata (5 pts)
  if (page.openGraph.title || page.openGraph.image) {
    securityPoints += 5;
    diagnostics.push({
      id: "quality-opengraph",
      category: "security",
      title: "Open Graph Tags Configured",
      status: "passed",
      pointsEarned: 5,
      maxPoints: 5,
      evidence: `OG Title: "${page.openGraph.title || "Present"}", OG Image: ${page.openGraph.image ? "Present" : "None"}`,
      impact: "Ensures attractive rich link previews when shared on LinkedIn, Facebook, Slack, and X.",
    });
  } else {
    diagnostics.push({
      id: "quality-opengraph",
      category: "security",
      title: "Missing Open Graph Tags",
      status: "warning",
      pointsEarned: 0,
      maxPoints: 5,
      evidence: "No og:title or og:image tags detected.",
      impact: "Social networks will generate plain or incomplete card previews when this URL is shared.",
      recommendation: "Add <meta property=\"og:title\" ...> and <meta property=\"og:image\" ...> tags.",
    });
  }

  // ----------------------------------------------------
  // TOTALS & CATEGORY SUMMARIES
  // ----------------------------------------------------
  const overallScore = Math.min(
    100,
    Math.max(0, metadataPoints + contentPoints + indexPoints + securityPoints)
  );

  let grade: SeoAuditReport["grade"] = "F";
  if (overallScore >= 90) grade = "A+";
  else if (overallScore >= 80) grade = "A";
  else if (overallScore >= 70) grade = "B";
  else if (overallScore >= 60) grade = "C";
  else if (overallScore >= 50) grade = "D";

  const passedCount = diagnostics.filter((d) => d.status === "passed").length;
  const warningCount = diagnostics.filter((d) => d.status === "warning").length;
  const errorCount = diagnostics.filter((d) => d.status === "error").length;

  let summary = `This website achieved a score of ${overallScore}/100. `;
  if (overallScore >= 85) {
    summary += "It demonstrates strong technical SEO foundations, valid indexability, and clean document structure.";
  } else if (overallScore >= 70) {
    summary += "Good overall health with a few actionable improvements identified in metadata, headings, or structured data.";
  } else {
    summary += "Significant on-page and technical SEO gaps were detected that may limit organic search visibility.";
  }

  return {
    overallScore,
    grade,
    summary,
    categories: {
      metadata: {
        name: "Metadata & Tags",
        score: metadataPoints,
        maxScore: 25,
        percentage: Math.round((metadataPoints / 25) * 100),
      },
      content: {
        name: "Content & Structure",
        score: contentPoints,
        maxScore: 25,
        percentage: Math.round((contentPoints / 25) * 100),
      },
      indexability: {
        name: "Indexability Signals",
        score: indexPoints,
        maxScore: 25,
        percentage: Math.round((indexPoints / 25) * 100),
      },
      security: {
        name: "Security & Standards",
        score: securityPoints,
        maxScore: 25,
        percentage: Math.round((securityPoints / 25) * 100),
      },
    },
    passedCount,
    warningCount,
    errorCount,
    diagnostics,
  };
}
