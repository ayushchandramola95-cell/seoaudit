# Project Quick Info: SeoSeite / WebIntel

## AI-Powered Website Intelligence, Traffic Estimation & Analytics Platform

**Last Updated:** October 10, 2026  
**Status:** Production Deployed & Verified (Phases 1–10 Complete)  
**Primary Target:** Production Enterprise SaaS Platform  
**Core Thesis:** "An AI-powered platform for understanding, analyzing, and comparing websites with honest, deterministic data."

---

## 1. Executive Summary

SeoSeite is a modern SaaS platform designed to inspect any public website URL and generate actionable intelligence across five key pillars:
1. **Technical & On-Page SEO Auditing** (Deterministic, rule-based scoring out of 100).
2. **Technology Stack Detection** (CMS, frameworks, CDNs, analytics, ad networks, hosting).
3. **Performance & Core Web Vitals** (Google PageSpeed Insights API integration).
4. **Statistical Traffic Estimation** (Transparent heuristic modeling with confidence ratings).
5. **AI Diagnostic & Recommendations Layer** (LLM interpretation of verified data, zero hallucinated metrics).

In addition, website owners can optionally connect first-party **Google Analytics (GA4)** and **Google Search Console (GSC)** via secure OAuth to compare public estimates against verified reality.

---

## 2. Core Architectural Principles

- **Zero Fabricated Metrics:** The platform never invents visitor counts, rankings, or backlinks. If data is unavailable, it is explicitly labeled as `Data Unavailable` with an explanation.
- **AI as Interpreter, Not Source of Truth:** Deterministic code (HTTP requests, Cheerio, PageSpeed Insights, statistical algorithms) computes numbers; AI models (Gemini) synthesize findings, explain causes, and prioritize fixes.
- **SSRF & Crawl Safety by Design:** Strict validation prevents Server-Side Request Forgery by disallowing requests to `localhost`, internal subnets (`10.x`, `172.16-31.x`, `192.168.x`), and cloud metadata APIs (`169.254.169.254`).
- **High Information Density (Flat, Modern UI):** Clean light-mode-first aesthetic with crisp typography, flat cards, clear borders, and zero intrusive 3D or glassmorphic blur effects.

---

## 3. Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) + React 19 | SSR for public SEO pages, unified API routes for scraping & orchestration. |
| **Language** | TypeScript | Strict end-to-end type safety for audit reports, metrics, and API payloads. |
| **Styling** | Tailwind CSS v4 | Flat, modern utility-first styling with clean borders and light-mode tokens. |
| **Icons** | Lucide React | Lightweight, crisp, modern SVG icon library. |
| **Parsing Engine** | Cheerio + Native Fetch | Lightweight, sub-second HTML parsing without heavy Chrome memory footprint. |
| **Performance Audit**| Google PageSpeed Insights API | Offloads Lighthouse computation to Google Cloud rather than choking local servers. |
| **AI Layer** | Google Gemini 2.5 / 1.5 Flash | Fast, cost-effective structured reasoning for technical audit interpretation. |
| **Database** | PostgreSQL / Supabase | Relational data integrity for users, scans, comparisons, and saved reports. |

---

## 4. Multi-Phase Roadmap

- [x] **Phase 1: Project Foundation & Design System**
  - Next.js 16 + React 19 + TypeScript + Tailwind CSS setup.
  - Light-mode-first, flat modern design system.
  - Project Info & Day-by-Day Worklog modules (both as markdown files & interactive web views).
  - Clean Landing Page with interactive URL input & test presets.
- [x] **Phase 2: Core Analysis Engine (Public Website Scraper & Deterministic Scorer)**
  - SSRF-safe URL filter & DNS resolver (`src/lib/security/ssrf.ts`).
  - High-speed Cheerio HTML extractor (`src/lib/modules/seo/fetcher.ts`).
  - Transparent 0-100 category-based SEO scoring engine (`src/lib/modules/seo/scorer.ts`).
  - Dynamic live report route handler (`src/app/api/analyze/route.ts`) and interactive audit dashboard at `/analyze`.
- [x] **Phase 3: Technology Detector & Core Web Vitals**
  - Fingerprint engine for 50+ frameworks, CMSs, trackers, and CDNs (`src/lib/modules/tech/detector.ts`).
  - Google PageSpeed Insights REST API client & Core Web Vitals telemetry (`src/lib/modules/performance/pagespeed.ts`).
  - Interactive Tech Stack & Core Web Vitals tabs in `/analyze`.
- [x] **Phase 4: Traffic Estimator & AI Insights Engine**
  - Heuristic traffic estimation with confidence levels (High / Medium / Low) (`src/lib/modules/traffic/estimator.ts`).
  - Gemini-powered executive summary and prioritized developer action items (`src/lib/modules/ai/service.ts`).
  - Interactive Traffic Estimator & AI Recommendations tabs in `/analyze`.
- [x] **Phase 5: Competitor Comparison Tool**
  - Multi-domain parallel scraper & API (`src/app/api/compare/route.ts`).
  - Comparative delta engine & tech stack cross-comparison (`src/lib/modules/compare/comparator.ts`).
  - Interactive side-by-side benchmark dashboard at `/compare` with AI comparative summaries and swap functionality.
- [x] **Phase 6: Google Cloud Run, Cloud SQL & Operational Dashboard**
  - Standalone Next.js multi-stage Dockerfile optimized for Google Cloud Run (port 8080, non-root container).
  - Google Cloud SQL (PostgreSQL) schema (`src/lib/db/schema.sql`) and resilient pg pool client (`src/lib/db/client.ts`).
  - Operational SaaS Dashboard at `/dashboard` with audit history, competitor benchmarks, quick launch forms, and GCP container status.
  - Step-by-step deployment guide (`DEPLOYMENT_GCP.md`) targeting default Cloud Run HTTPS domain (`*.a.run.app`).
- [x] **Phase 7: Permanent Shareable Audit Report Snapshots**
  - Unique UUID report permalinks (`/report/[id]`) retrieving historical snapshot states from PostgreSQL without re-crawling.
  - Share modal and copy-to-clipboard buttons across `/analyze`, `/compare`, and `/dashboard`.
- [x] **Phase 8: Executive Print / PDF Report Export**
  - Pure CSS `@media print` layout stripping navigation, interactive forms, and buttons.
  - Clean page-break and high-contrast typography optimization for physical printing and PDF export.
- [x] **Phase 9: API Keys Setup & Resilient Production Fallback**
  - Google AI Studio (Gemini 1.5 Flash) and Google PageSpeed Insights REST API configuration guide (`API_KEYS_GUIDE.md`).
  - Zero-downtime deterministic fallback ensures 100% operational uptime even without external API credentials.
- [x] **Phase 10: Academic Capstone Documentation & Viva Voce Guide**
  - Comprehensive final-year BCA project dissertation report (`CAPSTONE_PROJECT_REPORT.md`).
  - Mathematical formulas for 0–100 SEO scoring, Zipf's law traffic heuristics, and SSRF security defense matrix.
  - College Viva Voce Examination Preparation Guide featuring 25 core theoretical and practical defenses.
  - In-app interactive documentation view accessible at `/capstone`.

---

## 5. Security & Safe Crawling Checklist
- [x] Schemes restricted to `http:` and `https:`.
- [x] Server-side IP blacklist (private, link-local, loopback).
- [x] Maximum response size limits (e.g. 5MB) and timeout limits (8s).
- [x] Scraped content sanitized before rendering in DOM.
- [x] Google Cloud metadata service (`169.254.169.254`) blocked from SSRF attacks.
