/**
 * Utility for RFC 4180 compliant CSV exports with instant browser download.
 */

function escapeCsvCell(cell: unknown): string {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function downloadCsv(filename: string, rows: (string | number | boolean | null | undefined)[][]): void {
  const csvContent = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" }); // BOM for Excel UTF-8 support
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportFindingsCsv(
  domain: string,
  overallScore: number,
  grade: string,
  results: Array<{
    id: string;
    category: string;
    label: string;
    status: string;
    score: number;
    maxScore: number;
    message: string;
    details?: string;
  }>
): void {
  const rows: (string | number | boolean)[][] = [
    ["SeoSeite Technical Audit Findings Report"],
    ["Domain", domain],
    ["Overall Score", `${overallScore}/100`],
    ["Letter Grade", grade],
    ["Export Date", new Date().toISOString()],
    [],
    ["Rule ID", "Category", "Check Label", "Status", "Score", "Max Score", "Finding Message", "Technical Details"],
  ];

  results.forEach((r) => {
    rows.push([
      r.id,
      r.category,
      r.label,
      r.status.toUpperCase(),
      r.score,
      r.maxScore,
      r.message,
      r.details || "",
    ]);
  });

  downloadCsv(`${domain}-audit-findings`, rows);
}

export function exportKeywordsCsv(
  domain: string,
  keywords: Array<{ phrase: string; count: number; density: number; inTitle?: boolean; inH1?: boolean }>,
  phrases: Array<{ phrase: string; count: number; density: number }>
): void {
  const rows: (string | number | boolean)[][] = [
    ["SeoSeite Keyword Density & Linguistic Analysis"],
    ["Domain", domain],
    ["Export Date", new Date().toISOString()],
    [],
    ["Keyword / Single Word", "Frequency Count", "Density (%)", "In Title?", "In H1?"],
  ];

  keywords.forEach((k) => {
    rows.push([k.phrase, k.count, `${k.density.toFixed(2)}%`, k.inTitle ? "YES" : "NO", k.inH1 ? "YES" : "NO"]);
  });

  rows.push([]);
  rows.push(["Two-Word Phrases (Bigrams)", "Frequency Count", "Density (%)"]);
  phrases.forEach((p) => {
    rows.push([p.phrase, p.count, `${p.density.toFixed(2)}%`]);
  });

  downloadCsv(`${domain}-keywords-analysis`, rows);
}

export function exportTechnologiesCsv(
  domain: string,
  technologies: Array<{ name: string; category: string; confidence: number; version?: string; website?: string }>
): void {
  const rows: (string | number | boolean)[][] = [
    ["SeoSeite Technology Stack Fingerprint"],
    ["Domain", domain],
    ["Export Date", new Date().toISOString()],
    [],
    ["Technology Name", "Category", "Confidence", "Version", "Official Website"],
  ];

  technologies.forEach((t) => {
    rows.push([t.name, t.category, `${t.confidence}%`, t.version || "N/A", t.website || ""]);
  });

  downloadCsv(`${domain}-technology-stack`, rows);
}

export function exportKeywordGapCsv(
  siteA: string,
  siteB: string,
  gap: {
    sharedKeywords: string[];
    uniqueToA: Array<{ phrase: string; count: number; density: number }>;
    uniqueToB: Array<{ phrase: string; count: number; density: number }>;
    topOverlapKeywords: Array<{ phrase: string; countA: number; countB: number }>;
  }
): void {
  const rows: (string | number | boolean)[][] = [
    ["SeoSeite Competitor Keyword Content Gap Matrix"],
    ["Domain A", siteA],
    ["Domain B", siteB],
    ["Export Date", new Date().toISOString()],
    [],
    ["Shared Keyword Overlap", `Count on ${siteA}`, `Count on ${siteB}`],
  ];

  gap.topOverlapKeywords.forEach((o) => {
    rows.push([o.phrase, o.countA, o.countB]);
  });

  rows.push([]);
  rows.push([`Exclusive Keywords to ${siteA} (Opportunity for ${siteB})`, "Count", "Density (%)"]);
  gap.uniqueToA.forEach((u) => {
    rows.push([u.phrase, u.count, `${u.density.toFixed(2)}%`]);
  });

  rows.push([]);
  rows.push([`Exclusive Keywords to ${siteB} (Opportunity for ${siteA})`, "Count", "Density (%)"]);
  gap.uniqueToB.forEach((u) => {
    rows.push([u.phrase, u.count, `${u.density.toFixed(2)}%`]);
  });

  downloadCsv(`${siteA}-vs-${siteB}-keyword-gap`, rows);
}
