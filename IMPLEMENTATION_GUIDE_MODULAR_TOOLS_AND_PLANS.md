# SeoSeite Enterprise Implementation Guide: Modular Tools, Tier Gating, MCP & AI Roadmap

**Document Version:** 1.0.0  
**Target Platform:** SeoSeite (Next.js 16 + TypeScript + Tailwind CSS + PostgreSQL)  
**Objective:** Transform SeoSeite from a monolithic all-in-one audit scan into an enterprise modular SEO ecosystem (inspired by Ahrefs) with dedicated high-intent micro-tools, plan tier gating, an AI Model Context Protocol (MCP) server, and automated monitoring.

---

## Table of Contents
1. [Architecture Overview & Vision](#1-architecture-overview--vision)
2. [Phase 1: Decomposing into Modular Micro-Tools (/tools/*)](#2-phase-1-decomposing-into-modular-micro-tools-tools)
3. [Phase 2: Plan Tier Gating & Feature Access Engine](#3-phase-2-plan-tier-gating--feature-access-engine)
4. [Phase 3: SeoSeite Native SEO MCP Server (Model Context Protocol)](#4-phase-3-seoseite-native-seo-mcp-server-model-context-protocol)
5. [Phase 4: Brand Radar AI & AEO Visibility Studio](#5-phase-4-brand-radar-ai--aeo-visibility-studio)
6. [Phase 5: Automated 24/7 Monitoring & Alert Webhooks](#6-phase-5-automated-247-monitoring--alert-webhooks)
7. [Phase 6: Database Schema Enhancements (PostgreSQL)](#7-phase-6-database-schema-enhancements-postgresql)
8. [Phase 7: Execution Schedule & Sprint Checklist](#8-phase-7-execution-schedule--sprint-checklist)

---

## 1. Architecture Overview & Vision

Currently, SeoSeite runs all 14 analysis engines in a single click on `/analyze`. 

### The Problem With a Monolithic Scan
1. **User Experience:** Users seeking a quick 404 broken link check or a PageSpeed score are overwhelmed by 14 tabs of unrelated data.
2. **SEO & Organic Acquisition:** Ahrefs drives over **10 million organic search visits per month** because they have standalone landing pages targeting specific high-intent search queries:
   * *"Free Broken Link Checker"*
   * *"Website Speed Test"*
   * *"Schema JSON-LD Validator"*
   * *"SERP Snippet Simulator"*
   * *"Website Tech Stack Detector"*
3. **Monetization & Conversion:** Offering isolated free tools provides natural upgrade friction (e.g. Free tool shows first 20 broken links → *"Upgrade to Pro to crawl 500+ links"*).

### Target System Architecture

```
                                 [ User / Search Engine ]
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
   [ Standalone Micro-Tools ]       [ Full Audit Suite ]        [ Competitive Suite ]
   • /tools/broken-links            • /analyze                  • /compare
   • /tools/speed-lab               (Complete 14-tab scan)      • /tools/content-gap
   • /tools/schema-validator
   • /tools/serp-preview
   • /tools/tech-detector
   • /tools/authority-checker
               │                            │                            │
               └────────────────────────────┼────────────────────────────┘
                                            ▼
                           [ Plan Gating & Rate Limiter ]
                           (Free / Starter / Pro / Agency)
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
      [ Core Scraping APIs ]       [ Third-Party APIs ]         [ AI & MCP Server ]
      • /api/analyze               • Google PSI REST API        • OpenRouter / Gemini
      • /api/crawler/links         • DomCop Open PageRank       • /api/mcp (Claude/Cursor)
      • /api/compare               • GSC OAuth (Mode B)         • Brand Radar AI Studio
                                            │
                                            ▼
                         [ Cloud SQL PostgreSQL Database ]
                         • website_scans
                         • users (plan tier)
                         • monitored_domains
                         • alert_webhooks
```

---

## 2. Phase 1: Decomposing into Modular Micro-Tools (/tools/*)

Create dedicated, single-purpose tool pages inside `src/app/tools/`. Each tool shares the core scraping logic but presents a focused, zero-clutter interface.

### Recommended Route Structure
* `src/app/tools/broken-links/page.tsx` → **Free Broken Link & 404 Checker**
* `src/app/tools/speed-lab/page.tsx` → **Core Web Vitals & PageSpeed Lab**
* `src/app/tools/schema-validator/page.tsx` → **Schema JSON-LD & OG Validator**
* `src/app/tools/serp-preview/page.tsx` → **Google Desktop & Mobile SERP Previewer**
* `src/app/tools/tech-detector/page.tsx` → **50+ Framework & CMS Stack Profiler**
* `src/app/tools/authority-checker/page.tsx` → **DomCop Open PageRank Lookup**

---

### Implementation Example: Broken Link Checker Tool

#### File: `src/app/tools/broken-links/page.tsx`
```tsx
import type { Metadata } from "next";
import BrokenLinksClient from "./BrokenLinksClient";

export const metadata: Metadata = {
  title: "Free Broken Link Checker - Find 404 Dead Links | SeoSeite",
  description:
    "Scan any website URL in seconds to identify internal and external 404 dead links, broken redirects, and anchor text issues.",
};

export default function BrokenLinksPage() {
  return <BrokenLinksClient />;
}
```

#### File: `src/app/tools/broken-links/BrokenLinksClient.tsx`
```tsx
"use client";

import { useState } from "react";
import { Link2, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

export default function BrokenLinksClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch("/api/crawler/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResults(data.links || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deadLinks = results?.filter((l) => l.status === 404 || l.error) || [];
  const healthyLinks = results?.filter((l) => l.status === 200) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Free Broken Link &amp; 404 Checker
        </h1>
        <p className="text-slate-600 text-sm">
          Detect broken links, dead redirects, and missing resources damaging your search rankings.
        </p>
      </div>

      <form onSubmit={handleScan} className="flex gap-2 max-w-2xl mx-auto mb-10">
        <input
          type="url"
          required
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "Crawling Links..." : "Check Dead Links"}
        </button>
      </form>

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-900">{deadLinks.length}</div>
                <div className="text-xs text-red-700">Broken 404 Links Found</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-emerald-900">{healthyLinks.length}</div>
                <div className="text-xs text-emerald-700">Healthy 200 OK Links</div>
              </div>
            </div>
          </div>

          {/* Paywall Banner if > 20 links found */}
          {results.length > 20 && (
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">Showing first 20 links scanned</div>
                <div className="text-xs text-slate-300">Upgrade to Pro to crawl up to 500 links per scan with deep redirect trees.</div>
              </div>
              <a href="/pricing" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold">
                Upgrade to Pro
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 3. Phase 2: Plan Tier Gating & Feature Access Engine

To prevent users from exploiting enterprise features on the free tier, implement a centralized plan-gating policy.

### Plan Tiers Definition
* **`free`**: 5 public scans/day, 1 verified domain, technical audit, schema validator, SERP preview.
* **`starter`**: 50 scans/day, 5 projects, Core Web Vitals lab, DomCop PageRank, CSV export.
* **`pro`**: Unlimited scans, 25 projects, Competitor Compare, Topic Gap, Deep 404 crawler, AI fixes, 3 team seats.
* **`enterprise`**: Unlimited projects, unlimited seats, White-label PDF branding, 24/7 alerts, REST API & MCP server.

### Implementation: Feature Gate Utility

#### File: `src/lib/auth/tierLimits.ts`
```typescript
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
    maxLinksCrawled: 20,
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

export function canAccessFeature(plan: PlanTier, feature: keyof PlanLimits): boolean {
  const config = PLAN_CONFIGS[plan] || PLAN_CONFIGS.free;
  return Boolean(config[feature]);
}
```

### Implementing the Upgrade Modal Component

#### File: `src/components/UpgradeGateModal.tsx`
```tsx
"use client";

import { Sparkles, X, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  requiredTier: "pro" | "enterprise";
  featureTitle: string;
  description: string;
}

export default function UpgradeGateModal({
  isOpen,
  onClose,
  requiredTier,
  featureTitle,
  description,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          {requiredTier.toUpperCase()} Feature
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{featureTitle}</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">{description}</p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs text-slate-700 space-y-2">
          <div>✓ Unlock unlimited access to this engine</div>
          <div>✓ Zero per-user seat penalties (team seats included)</div>
          <div>✓ Permanent snapshot storage in Cloud SQL</div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <Link
            href="/pricing"
            className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"
          >
            Upgrade Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 4. Phase 3: SeoSeite Native SEO MCP Server (Model Context Protocol)

Ahrefs recently made headlines by launching an **Anthropic Model Context Protocol (MCP)** server. This allows AI assistants in **Claude Desktop**, **Cursor IDE**, or custom agents to query SEO data conversationally.

Because SeoSeite already has deterministic, structured REST API routes (`/api/analyze`, `/api/compare`, `/api/crawler/links`), we can easily provide a native MCP server!

### How the SeoSeite MCP Works
An MCP server exposes **tools** that an AI client can call. When a user asks Claude:
> *"Audit https://stripe.com and tell me why their Core Web Vitals are slow,"*

Claude executes the `seoseite_audit_url` tool, receives deterministic JSON data from SeoSeite, and provides an expert diagnosis.

### Implementation: Standalone MCP Bridge Script

#### File: `src/mcp/server.ts`
```typescript
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "seoseite-seo-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. List Available Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "seoseite_audit_url",
        description:
          "Runs an instant 0-100 deterministic technical SEO health audit on any public website URL.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "The full website URL to audit (https://...)" },
          },
          required: ["url"],
        },
      },
      {
        name: "seoseite_compare_domains",
        description:
          "Compares two domains head-to-head for technical SEO, performance, and tech stack differences.",
        inputSchema: {
          type: "object",
          properties: {
            urlA: { type: "string", description: "Target primary URL" },
            urlB: { type: "string", description: "Competitor URL" },
          },
          required: ["urlA", "urlB"],
        },
      },
      {
        name: "seoseite_check_broken_links",
        description: "Crawls a website to detect internal and external 404 dead links.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "URL to crawl for dead links" },
          },
          required: ["url"],
        },
      },
    ],
  };
});

// 2. Handle Tool Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const baseUrl = process.env.SEOSEITE_API_URL || "http://localhost:3000";

  if (name === "seoseite_audit_url") {
    const url = String(args?.url);
    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }

  if (name === "seoseite_compare_domains") {
    const urlA = String(args?.urlA);
    const urlB = String(args?.urlB);
    const res = await fetch(`${baseUrl}/api/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urlA, urlB }),
    });
    const data = await res.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// 3. Connect via Standard Input/Output
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SeoSeite MCP Server listening on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
```

---

## 5. Phase 4: Brand Radar AI & AEO Visibility Studio

Ahrefs charges **$199/month** for Brand Radar AI to track how often brands are recommended in LLMs (ChatGPT, Gemini, Perplexity, Claude). 

SeoSeite can implement an **AEO Prompt Visibility Engine** using the existing OpenRouter or Google Gemini client to simulate buyer intent prompts and measure brand citations.

### Methodology
1. Take a target Brand Name and 3–5 representative Buyer Intent Prompts:
   * E.g. *"What are the top 5 email marketing tools for Shopify in 2026?"*
2. Send the prompt in parallel to Gemini, Claude, or Perplexity via OpenRouter.
3. Parse the LLM response to check:
   * Is the target brand mentioned?
   * At what position (#1, #2, #3)?
   * What sentiment/context is used?
   * Which competitor brands were cited?
4. Calculate an **AI Share of Voice (SoV)** percentage score out of 100%.

### Implementation: AEO Route Handler

#### File: `src/app/api/ai/brand-radar/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { brandName, prompts, targetDomain } = await req.json();

    if (!brandName || !prompts || !Array.isArray(prompts)) {
      return NextResponse.json({ error: "brandName and prompts array required." }, { status: 400 });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured." }, { status: 500 });
    }

    const checks = await Promise.all(
      prompts.slice(0, 5).map(async (promptText: string) => {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: promptText }],
            temperature: 0.2,
          }),
        });

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";
        const isMentioned = new RegExp(brandName, "i").test(text);

        return {
          prompt: promptText,
          isMentioned,
          snippet: isMentioned ? text.slice(0, 300) : "Brand not cited in response.",
        };
      })
    );

    const mentionedCount = checks.filter((c) => c.isMentioned).length;
    const shareOfVoice = Math.round((mentionedCount / checks.length) * 100);

    return NextResponse.json({
      brandName,
      targetDomain,
      shareOfVoice,
      totalChecks: checks.length,
      citedCount: mentionedCount,
      results: checks,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

---

## 6. Phase 5: Automated 24/7 Monitoring & Alert Webhooks

A key driver of agency retention is **Always-On Monitoring**: crawling a client's website weekly and notifying the team if their score drops or dead links appear.

### Architecture
1. **Cron Trigger:** A scheduled Google Cloud Scheduler ping or Vercel Cron hits `/api/cron/monitor` every Sunday at midnight.
2. **Worker:** Fetches all domains registered in `monitored_domains` where `status = 'active'`.
3. **Execution:** Runs `/api/analyze` for each domain.
4. **Delta Calculation:** Compares `current_score` with `previous_score`.
5. **Alert Dispatcher:** If score drops by >5 points or 404 links are found, dispatch a notification to the user's registered Discord, Slack, or Email webhook.

---

## 7. Phase 6: Database Schema Enhancements (PostgreSQL)

Execute this SQL migration in your Google Cloud SQL / Supabase PostgreSQL database to support monitored projects, limits, and webhooks:

#### File: `src/lib/db/migrations/002_plans_and_monitoring.sql`
```sql
-- 1. Update users table with tier, billing cycle, and scan quotas
ALTER TABLE users ADD COLUMN IF NOT EXISTS tier VARCHAR(32) DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_scan_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_scan_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS seats_allocated INTEGER DEFAULT 1;

-- 2. Monitored Project Watchlist (Portfolios)
CREATE TABLE IF NOT EXISTS monitored_domains (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  target_url TEXT NOT NULL,
  frequency VARCHAR(32) DEFAULT 'weekly', -- 'daily' or 'weekly'
  last_score INTEGER,
  last_crawled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_monitored_user ON monitored_domains(user_id);

-- 3. Webhook Alert Subscriptions (Slack, Discord, Email)
CREATE TABLE IF NOT EXISTS alert_webhooks (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  domain_id VARCHAR(64) REFERENCES monitored_domains(id) ON DELETE CASCADE,
  channel VARCHAR(32) NOT NULL, -- 'slack', 'discord', 'email'
  webhook_url TEXT NOT NULL,
  trigger_threshold INTEGER DEFAULT 5, -- Drop of X points triggers alert
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. AI Prompt Tracking History (Brand Radar)
CREATE TABLE IF NOT EXISTS ai_prompt_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  brand_name VARCHAR(255) NOT NULL,
  prompt_query TEXT NOT NULL,
  ai_model VARCHAR(64) NOT NULL,
  is_cited BOOLEAN NOT NULL,
  share_of_voice INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 8. Phase 7: Execution Schedule & Sprint Checklist

| Sprint | Focus Area | Deliverables | Estimated Time |
| :---: | :--- | :--- | :---: |
| **Sprint 1** | **Standalone Micro-Tools** | Build `/tools/broken-links`, `/tools/speed-lab`, `/tools/schema-validator`, `/tools/serp-preview` with focused forms and upgrade banners. | 2–3 Days |
| **Sprint 2** | **Tier Gating & Modals** | Implement `tierLimits.ts`, attach scan quotas to user sessions, and render `UpgradeGateModal.tsx` on restricted features. | 1–2 Days |
| **Sprint 3** | **SeoSeite SEO MCP Server** | Implement Model Context Protocol stdio/HTTP server allowing Claude Desktop and Cursor to run audits programmatically. | 1–2 Days |
| **Sprint 4** | **Brand Radar AI Studio** | Build `/api/ai/brand-radar` and an interactive UI tab testing brand citations across LLMs via OpenRouter. | 2 Days |
| **Sprint 5** | **Automated Cron Monitoring** | Run database migration `002_plans_and_monitoring.sql`, configure `/api/cron/monitor`, and add Slack/Discord webhook dispatchers. | 2 Days |

---

## Conclusion

By following this implementation guide:
1. **You eliminate cognitive overload** by giving users fast, isolated tools for specific jobs.
2. **You capture organic search traffic** targeting high-value queries like *"Free Broken Link Checker"* and *"PageSpeed Lab"*.
3. **You position SeoSeite as a modern, AI-native alternative** to Ahrefs, providing accessible pricing ($0 to $149/mo) with zero single-seat penalties, native MCP integration, and deterministic data.
