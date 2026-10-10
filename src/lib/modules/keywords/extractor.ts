import * as cheerio from "cheerio";

export interface KeywordItem {
  phrase: string;
  count: number;
  density: number; // percentage e.g. 2.4%
  inTitle: boolean;
  inH1: boolean;
}

export interface KeywordAnalysisReport {
  totalWords: number;
  uniqueWords: number;
  lexicalDiversity: number; // ratio 0.0 - 1.0
  readingTimeMinutes: number;
  topSingleKeywords: KeywordItem[];
  topTwoWordPhrases: KeywordItem[];
  topThreeWordPhrases: KeywordItem[];
  warnings: string[];
}

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
  "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
  "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
  "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
  "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't",
  "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
  "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this",
  "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd",
  "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's",
  "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't",
  "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves",
  "will", "just", "also", "get", "like", "use", "make", "see", "click", "read", "view", "page", "site"
]);

/**
 * Extracts and analyzes keyword frequencies, densities, and n-grams from web page HTML.
 */
export function extractKeywordAnalysis(
  rawHtml: string,
  title: string | null = "",
  h1Items: string[] = []
): KeywordAnalysisReport {
  if (!rawHtml || rawHtml.trim() === "") {
    return {
      totalWords: 0,
      uniqueWords: 0,
      lexicalDiversity: 0,
      readingTimeMinutes: 0,
      topSingleKeywords: [],
      topTwoWordPhrases: [],
      topThreeWordPhrases: [],
      warnings: ["No indexable content body discovered on target URL."],
    };
  }

  const $ = cheerio.load(rawHtml);

  // Remove non-content elements
  $("script, style, noscript, svg, iframe, canvas, select, option, header, footer, nav").remove();

  // Extract clean body text
  const bodyText = $("body").text() || $.text();
  const titleLower = (title || "").toLowerCase();
  const h1Combined = h1Items.map((h) => h.toLowerCase()).join(" ");

  // Tokenize into clean words
  const rawTokens = bodyText
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !/^\d+$/.test(w));

  const totalWords = rawTokens.length;
  if (totalWords === 0) {
    return {
      totalWords: 0,
      uniqueWords: 0,
      lexicalDiversity: 0,
      readingTimeMinutes: 0,
      topSingleKeywords: [],
      topTwoWordPhrases: [],
      topThreeWordPhrases: [],
      warnings: ["Page does not contain sufficient text for keyword analysis."],
    };
  }

  // 1-Gram (Single Word) Frequencies (filtering stop words)
  const singleFreq: Record<string, number> = {};
  const allFilteredWords: string[] = [];

  for (const word of rawTokens) {
    if (!STOP_WORDS.has(word)) {
      singleFreq[word] = (singleFreq[word] || 0) + 1;
      allFilteredWords.push(word);
    }
  }

  const uniqueWords = Object.keys(singleFreq).length;
  const lexicalDiversity = totalWords > 0 ? Number((uniqueWords / totalWords).toFixed(2)) : 0;
  const readingTimeMinutes = Math.max(1, Math.round(totalWords / 200));

  // Build Top 1-Grams
  const topSingleKeywords: KeywordItem[] = Object.entries(singleFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([phrase, count]) => {
      const density = Number(((count / totalWords) * 100).toFixed(1));
      return {
        phrase,
        count,
        density,
        inTitle: titleLower.includes(phrase),
        inH1: h1Combined.includes(phrase),
      };
    });

  // 2-Gram Phrases
  const twoGramFreq: Record<string, number> = {};
  for (let i = 0; i < rawTokens.length - 1; i++) {
    const w1 = rawTokens[i];
    const w2 = rawTokens[i + 1];
    if (!STOP_WORDS.has(w1) || !STOP_WORDS.has(w2)) {
      if (w1 !== w2) {
        const phrase = `${w1} ${w2}`;
        twoGramFreq[phrase] = (twoGramFreq[phrase] || 0) + 1;
      }
    }
  }

  const topTwoWordPhrases: KeywordItem[] = Object.entries(twoGramFreq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([phrase, count]) => {
      const density = Number(((count / totalWords) * 100).toFixed(1));
      return {
        phrase,
        count,
        density,
        inTitle: titleLower.includes(phrase),
        inH1: h1Combined.includes(phrase),
      };
    });

  // 3-Gram Phrases
  const threeGramFreq: Record<string, number> = {};
  for (let i = 0; i < rawTokens.length - 2; i++) {
    const w1 = rawTokens[i];
    const w2 = rawTokens[i + 1];
    const w3 = rawTokens[i + 2];
    if (!STOP_WORDS.has(w1) || !STOP_WORDS.has(w3)) {
      const phrase = `${w1} ${w2} ${w3}`;
      threeGramFreq[phrase] = (threeGramFreq[phrase] || 0) + 1;
    }
  }

  const topThreeWordPhrases: KeywordItem[] = Object.entries(threeGramFreq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([phrase, count]) => {
      const density = Number(((count / totalWords) * 100).toFixed(1));
      return {
        phrase,
        count,
        density,
        inTitle: titleLower.includes(phrase),
        inH1: h1Combined.includes(phrase),
      };
    });

  // Generate actionable diagnostic warnings
  const warnings: string[] = [];
  if (totalWords < 300) {
    warnings.push(`Low word count (${totalWords} words). Search engines prioritize comprehensive content with at least 300-500 words.`);
  }

  const highDensityItems = topSingleKeywords.filter((k) => k.density > 4.0);
  if (highDensityItems.length > 0) {
    warnings.push(`Potential keyword stuffing detected: "${highDensityItems.map((k) => k.phrase).join(', ')}" has a density over 4.0%. Aim for 1.5% - 3.0%.`);
  }

  if (topSingleKeywords.length > 0 && !topSingleKeywords[0].inTitle) {
    warnings.push(`Your highest-frequency keyword "${topSingleKeywords[0].phrase}" does not appear in your page title tag.`);
  }

  if (topSingleKeywords.length > 0 && !topSingleKeywords[0].inH1) {
    warnings.push(`Your highest-frequency keyword "${topSingleKeywords[0].phrase}" does not appear in your primary <h1> heading.`);
  }

  return {
    totalWords,
    uniqueWords,
    lexicalDiversity,
    readingTimeMinutes,
    topSingleKeywords,
    topTwoWordPhrases,
    topThreeWordPhrases,
    warnings,
  };
}
