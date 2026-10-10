"use client";

import { useState } from "react";
import {
  Code,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  FileCode,
  Layers,
  Terminal,
  ExternalLink,
} from "lucide-react";

interface SchemaCodeGeneratorProps {
  domain: string;
  url: string;
  title: string;
  description: string;
}

export default function SchemaCodeGenerator({
  domain,
  url,
  title,
  description,
}: SchemaCodeGeneratorProps) {
  const [schemaType, setSchemaType] = useState<
    "Organization" | "WebSite" | "Article" | "LocalBusiness" | "FAQPage" | "BreadcrumbList"
  >("Organization");
  const [outputTab, setOutputTab] = useState<"jsonld" | "nextjs" | "html">("jsonld");
  const [copied, setCopied] = useState(false);

  // Form custom fields prefilled
  const [orgName, setOrgName] = useState(domain.replace(/\.[^/.]+$/, "").toUpperCase());
  const [orgUrl, setOrgUrl] = useState(url.startsWith("http") ? url : `https://${domain}`);
  const [orgLogo, setOrgLogo] = useState(`https://${domain}/logo.png`);
  const [headline, setHeadline] = useState(title || `${domain} Official Guide`);
  const [authorName, setAuthorName] = useState("Editorial Team");
  const [faqQ1, setFaqQ1] = useState(`What services does ${domain} provide?`);
  const [faqA1, setFaqA1] = useState(description || `${domain} provides enterprise services and cloud technology.`);
  const [faqQ2, setFaqQ2] = useState(`How can I contact ${domain}?`);
  const [faqA2, setFaqA2] = useState(`You can reach out through our official website contact portal.`);

  // Generate dynamic JSON-LD object
  function generateJsonLd() {
    switch (schemaType) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: orgName,
          url: orgUrl,
          logo: orgLogo,
          sameAs: [
            `https://twitter.com/${orgName.toLowerCase()}`,
            `https://linkedin.com/company/${orgName.toLowerCase()}`,
          ],
        };
      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: orgName,
          url: orgUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: `${orgUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        };
      case "Article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: headline,
          description: description,
          author: {
            "@type": "Person",
            name: authorName,
          },
          publisher: {
            "@type": "Organization",
            name: orgName,
            logo: {
              "@type": "ImageObject",
              url: orgLogo,
            },
          },
          datePublished: new Date().toISOString().split("T")[0],
          dateModified: new Date().toISOString().split("T")[0],
        };
      case "LocalBusiness":
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: orgName,
          image: orgLogo,
          url: orgUrl,
          telephone: "+1-800-555-0199",
          address: {
            "@type": "PostalAddress",
            streetAddress: "100 Technology Way",
            addressLocality: "San Francisco",
            addressRegion: "CA",
            postalCode: "94105",
            addressCountry: "US",
          },
        };
      case "FAQPage":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: faqQ1,
              acceptedAnswer: {
                "@type": "Answer",
                text: faqA1,
              },
            },
            {
              "@type": "Question",
              name: faqQ2,
              acceptedAnswer: {
                "@type": "Answer",
                text: faqA2,
              },
            },
          ],
        };
      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: orgUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: `${orgUrl}/services`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: headline,
              item: url,
            },
          ],
        };
      default:
        return {};
    }
  }

  const jsonLdObj = generateJsonLd();
  const jsonLdString = JSON.stringify(jsonLdObj, null, 2);

  // Generate Next.js App Router metadata snippet
  const nextJsMetadata = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title.replace(/"/g, '\\"') || `${orgName} — Official Site`}",
  description: "${description.replace(/"/g, '\\"') || "Enterprise platform and digital intelligence."}",
  alternates: {
    canonical: "${orgUrl}",
  },
  openGraph: {
    title: "${title.replace(/"/g, '\\"') || orgName}",
    description: "${description.replace(/"/g, '\\"') || ""}",
    url: "${orgUrl}",
    siteName: "${orgName}",
    images: [
      {
        url: "${orgLogo}",
        width: 1200,
        height: 630,
        alt: "${orgName} banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "${title.replace(/"/g, '\\"') || orgName}",
    description: "${description.replace(/"/g, '\\"') || ""}",
    images: ["${orgLogo}"],
  },
};`;

  // Standard HTML <head> tags
  const htmlHeadSnippet = `<!-- Primary Meta Tags -->
<title>${title || orgName}</title>
<meta name="title" content="${title || orgName}" />
<meta name="description" content="${description || ""}" />
<link rel="canonical" href="${orgUrl}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${orgUrl}" />
<meta property="og:title" content="${title || orgName}" />
<meta property="og:description" content="${description || ""}" />
<meta property="og:image" content="${orgLogo}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${orgUrl}" />
<meta property="twitter:title" content="${title || orgName}" />
<meta property="twitter:description" content="${description || ""}" />
<meta property="twitter:image" content="${orgLogo}" />

<!-- Structured Data (JSON-LD) -->
<script type="application/ld+json">
${jsonLdString}
</script>`;

  function getActiveCodeToCopy() {
    if (outputTab === "jsonld") {
      return `<script type="application/ld+json">\n${jsonLdString}\n</script>`;
    } else if (outputTab === "nextjs") {
      return nextJsMetadata;
    } else {
      return htmlHeadSnippet;
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(getActiveCodeToCopy());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              1-Click Schema.org & Meta Fix-It Code Studio
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate fully valid JSON-LD Rich Snippets and Next.js / HTML metadata customized for{" "}
              <span className="font-mono font-semibold text-slate-800">{domain}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Code Copied!" : "Copy Ready Snippet"}
            </button>
          </div>
        </div>

        {/* Schema Type Selector */}
        <div className="pt-4 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Select Schema.org Rich Result Template
          </label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                "Organization",
                "WebSite",
                "Article",
                "LocalBusiness",
                "FAQPage",
                "BreadcrumbList",
              ] as const
            ).map((st) => (
              <button
                key={st}
                onClick={() => setSchemaType(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  schemaType === st
                    ? "bg-purple-50 text-purple-700 border-purple-300 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Parameter Editor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100 mt-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Entity / Org Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Official Canonical URL</label>
            <input
              type="text"
              value={orgUrl}
              onChange={(e) => setOrgUrl(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Logo / Banner Image URL</label>
            <input
              type="text"
              value={orgLogo}
              onChange={(e) => setOrgLogo(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Code Tabs */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOutputTab("jsonld")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                outputTab === "jsonld"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              JSON-LD Script ({schemaType})
            </button>
            <button
              onClick={() => setOutputTab("nextjs")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                outputTab === "nextjs"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Next.js 15/16 App Router Metadata
            </button>
            <button
              onClick={() => setOutputTab("html")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                outputTab === "html"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Standard HTML &lt;head&gt;
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Valid Schema.org
            </span>
          </div>
        </div>

        {/* Code Block */}
        <div className="p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed max-h-[420px]">
          <pre>{getActiveCodeToCopy()}</pre>
        </div>
      </div>
    </div>
  );
}
