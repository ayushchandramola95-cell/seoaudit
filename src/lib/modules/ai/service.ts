import { DiagnosticItem, SeoAuditReport } from "../seo/scorer";
import { PageSpeedReport } from "../performance/pagespeed";
import { DetectedTechnology } from "../tech/detector";
import { TrafficEstimationReport } from "../traffic/estimator";

export interface PrioritizedFix {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  difficulty: "Easy" | "Medium" | "Advanced";
  category: string;
  evidence: string;
  expectedImpact: string;
  actionableStep: string;
  codeSnippet?: string;
}

export interface AiDiagnosticReport {
  isAiGenerated: boolean;
  provider: "Google Gemini" | "Heuristic Rule Synthesizer";
  executiveSummary: string;
  keyStrengths: string[];
  criticalGaps: string[];
  prioritizedFixes: PrioritizedFix[];
  developerAdvice: string;
}

/**
 * Deterministic AI heuristic synthesis engine used when Gemini API key is not present or as fallback.
 */
function generateHeuristicAiReport(params: {
  domain: string;
  audit: SeoAuditReport;
  performance: PageSpeedReport;
  technologies: DetectedTechnology[];
  traffic: TrafficEstimationReport;
}): AiDiagnosticReport {
  const { domain, audit, performance, technologies, traffic } = params;

  const strengths: string[] = [];
  const gaps: string[] = [];
  const fixes: PrioritizedFix[] = [];

  // Evaluate strengths
  if (audit.overallScore >= 80) {
    strengths.push(`Solid technical SEO health (${audit.overallScore}/100) with clean document markup.`);
  }
  if (performance.scores.performance >= 80) {
    strengths.push(`Fast mobile performance score of ${performance.scores.performance}/100 with optimal Core Web Vitals.`);
  }
  if (technologies.length >= 3) {
    strengths.push(`Modern stack footprint with ${technologies.length} detected technologies (${technologies.slice(0, 3).map((t) => t.name).join(", ")}).`);
  }
  if (audit.categories.security.percentage >= 80) {
    strengths.push("Enforces HTTPS encryption and modern security response headers.");
  }
  if (strengths.length === 0) {
    strengths.push("Domain is publicly accessible and responsive to HTTP crawlers.");
  }

  // Evaluate critical gaps from diagnostic items
  const warningsAndErrors = audit.diagnostics.filter((d) => d.status !== "passed");
  warningsAndErrors.forEach((diag) => {
    gaps.push(`${diag.title}: ${diag.evidence}`);
  });

  if (performance.scores.performance < 65) {
    gaps.push(`Mobile Lighthouse Performance is ${performance.scores.performance}/100, which may increase bounce rates.`);
  }

  // Build prioritized actionable fixes with code suggestions
  warningsAndErrors.forEach((diag) => {
    let difficulty: "Easy" | "Medium" | "Advanced" = "Easy";
    let snippet: string | undefined;

    if (diag.id === "headings-h1-missing" || diag.id === "headings-h1-multiple") {
      snippet = `<!-- Ensure exactly one H1 per page -->\n<h1>Primary Target Keyword Headline</h1>`;
    } else if (diag.id === "meta-title-present" || diag.id === "meta-title-length") {
      snippet = `<title>${domain} — Concise Descriptive Page Title (30-60 chars)</title>`;
    } else if (diag.id === "meta-desc-present" || diag.id === "meta-desc-length") {
      snippet = `<meta name="description" content="Clear, compelling 120-160 character summary of what users discover on ${domain}.">`;
    } else if (diag.id === "quality-img-alt") {
      snippet = `<!-- Add descriptive alt text to images -->\n<img src="/banner.webp" alt="Descriptive overview graphic of the platform" />`;
    } else if (diag.id === "sec-hsts-missing") {
      difficulty = "Medium";
      snippet = `# Add to Nginx / Cloudflare / Apache config:\nStrict-Transport-Security "max-age=31536000; includeSubDomains" always;`;
    } else if (diag.id === "index-structured-data") {
      difficulty = "Medium";
      snippet = `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "${domain}",\n  "url": "https://${domain}"\n}\n</script>`;
    }

    fixes.push({
      id: diag.id,
      title: diag.title,
      priority: diag.status === "error" ? "High" : "Medium",
      difficulty,
      category: diag.category.toUpperCase(),
      evidence: diag.evidence,
      expectedImpact: diag.impact,
      actionableStep: diag.recommendation || "Review and update this element according to web standards.",
      codeSnippet: snippet,
    });
  });

  // Sort fixes: High priority first, then Medium
  fixes.sort((a, b) => {
    if (a.priority === "High" && b.priority !== "High") return -1;
    if (a.priority !== "High" && b.priority === "High") return 1;
    return 0;
  });

  const execSummary = `${domain} scores ${audit.overallScore}/100 in Technical SEO with a Lighthouse performance rating of ${performance.scores.performance}/100. Based on discoverable public footprint signals, estimated monthly reach is in the range of ${traffic.formattedRange}. The most immediate opportunity for search ranking growth is addressing ${fixes.slice(0, 2).map((f) => f.title).join(" and ")}.`;

  return {
    isAiGenerated: false,
    provider: "Heuristic Rule Synthesizer",
    executiveSummary: execSummary,
    keyStrengths: strengths,
    criticalGaps: gaps.slice(0, 5),
    prioritizedFixes: fixes,
    developerAdvice: `Prioritize high-impact metadata fixes (title tags, unique H1, and meta descriptions) before undertaking complex structural refactors. Every fix should be verified using this live inspector.`,
  };
}

/**
 * Multi-provider AI service: Calls Google Gemini API if GEMINI_API_KEY is configured;
 * otherwise gracefully falls back to the deterministic heuristic synthesizer.
 */
export async function generateAiDiagnostics(params: {
  domain: string;
  audit: SeoAuditReport;
  performance: PageSpeedReport;
  technologies: DetectedTechnology[];
  traffic: TrafficEstimationReport;
}): Promise<AiDiagnosticReport> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return generateHeuristicAiReport(params);
  }

  const prompt = `You are a senior technical SEO and web performance engineer. 
Analyze the following deterministic website audit for "${params.domain}":
- Overall Technical SEO Score: ${params.audit.overallScore}/100 (Grade ${params.audit.grade})
- Lighthouse Performance: ${params.performance.scores.performance}/100 (LCP: ${params.performance.vitals.lcp.value}, FCP: ${params.performance.vitals.fcp.value}, CLS: ${params.performance.vitals.cls.value})
- Detected Stack: ${params.technologies.map((t) => t.name).join(", ") || "None specific"}
- Estimated Traffic: ${params.traffic.formattedRange} (Confidence: ${params.traffic.confidence})
- Failed Diagnostics: ${JSON.stringify(
      params.audit.diagnostics.filter((d) => d.status !== "passed").map((d) => ({
        title: d.title,
        status: d.status,
        evidence: d.evidence,
      }))
    )}

Respond strictly in valid JSON with this exact schema:
{
  "executiveSummary": "2-3 sentences summarizing the website's technical posture and opportunity",
  "keyStrengths": ["Strength 1", "Strength 2"],
  "criticalGaps": ["Gap 1", "Gap 2"],
  "developerAdvice": "1-2 practical tips for the engineering team"
}`;

  // Call Google Gemini API (Configurable via GEMINI_MODEL / AI_MODEL with stable fallbacks)
  try {
    const configuredModel = process.env.GEMINI_MODEL || process.env.AI_MODEL;
    const candidateModels = [
      ...(configuredModel ? [configuredModel.trim()] : []),
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-flash-latest",
    ];
    for (const modelName of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
          apiKey
        )}`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
          signal: AbortSignal.timeout(6500),
        });

        if (response.ok) {
          const result = await response.json();
          const textContent = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textContent) {
            const parsed = JSON.parse(textContent);
            const baseline = generateHeuristicAiReport(params);

            return {
              isAiGenerated: true,
              provider: "Google Gemini",
              executiveSummary: parsed.executiveSummary || baseline.executiveSummary,
              keyStrengths: parsed.keyStrengths || baseline.keyStrengths,
              criticalGaps: parsed.criticalGaps || baseline.criticalGaps,
              prioritizedFixes: baseline.prioritizedFixes, // grounded deterministic fixes
              developerAdvice: parsed.developerAdvice || baseline.developerAdvice,
            };
          }
        }
      } catch {
        // Try next candidate model
      }
    }
  } catch {
    // If Gemini fails, fall back cleanly
  }

  return generateHeuristicAiReport(params);
}
