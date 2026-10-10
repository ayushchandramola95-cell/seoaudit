# SeoSeite Platform — External API Keys & Environment Configuration Guide

This guide details how to configure optional third-party API keys to enable real-time Google Gemini AI recommendations and official Google PageSpeed Insights audits on your Google Cloud Run deployment and local environment.

---

## 1. Overview of External Integrations

SeoSeite is built on an **offline-first, zero-failure resilient architecture**:
- **With API keys:** The platform calls real Google Cloud APIs (Gemini 1.5 Flash for natural language diagnostics, PageSpeed Insights v5 for live lab data).
- **Without API keys (or during API downtime/rate-limits):** The platform **gracefully and automatically falls back** to deterministic heuristic rule engines. It never throws a 500 error or crashes.

| Environment Variable | Service | Cost | Required? | Fallback Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Google Cloud SQL (PostgreSQL) | Covered by GCP credits | **Recommended for production** | Resilient in-memory storage pool |
| `GEMINI_API_KEY` | Google AI Studio (Gemini 1.5 Flash) | **100% Free** (up to 15 RPM) | *Optional* | Deterministic Heuristic Synthesizer |
| `PAGESPEED_API_KEY` | Google PageSpeed Insights API | **100% Free** (25,000 queries/day) | *Optional* | Network-measured TTFB & payload telemetry |

---

## 2. How to Get a Free Google Gemini API Key

Google provides a generous **free tier** for Gemini 1.5 Flash via Google AI Studio (no credit card required).

1. Visit **[Google AI Studio](https://aistudio.google.com/)**.
2. Sign in with your Google account.
3. Click **"Get API key"** in the left sidebar.
4. Click **"Create API key"** and choose your existing Google Cloud project (`project-055ea647-8c47-49f1-8c0`) or create a new key.
5. Copy the generated key string (e.g. `AIzaSy...`).

---

## 3. How to Get a Free Google PageSpeed Insights API Key

Google provides 25,000 free requests per day for the PageSpeed Insights API.

1. Open the **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Make sure your project is selected in the top bar.
3. In the search bar at the top, type **"PageSpeed Insights API"** and select it.
4. Click **"Enable"**.
5. Go to **APIs & Services > Credentials** > Click **"+ CREATE CREDENTIALS"** > **API key**.
6. Copy the generated API key.

---

## 4. Adding Environment Variables to Google Cloud Run

To configure these keys on your live production Cloud Run service without re-building the container:

### Method A: Via Google Cloud Console (Fastest & Visual)

1. Open **[Cloud Run](https://console.cloud.google.com/run)** in your browser.
2. Click on your service: **`seoaudit`**.
3. Click **"EDIT & DEPLOY NEW REVISION"** at the top.
4. Scroll down and open the **"Variables & Secrets"** tab (under Container configuration).
5. Under **Environment variables**, click **"ADD VARIABLE"**:
   - Name: `GEMINI_API_KEY`  
     Value: *(Paste your Gemini key)*
   - Name: `PAGESPEED_API_KEY`  
     Value: *(Paste your PageSpeed key)*
   - Name: `DATABASE_URL` (Ensure it is set to: `postgresql://postgres:Ayush1234%407890@34.29.240.199:5432/postgres`)
6. Click **"DEPLOY"** at the bottom.
7. Cloud Run will seamlessly deploy a new revision in ~30 seconds with zero downtime!

### Method B: Via `gcloud` CLI (Single Command)

Run this command in your Cloud Shell or terminal:

```bash
gcloud run services update seoaudit \
  --region=us-central1 \
  --set-env-vars="GEMINI_API_KEY=YOUR_GEMINI_KEY,PAGESPEED_API_KEY=YOUR_PAGESPEED_KEY"
```

---

## 5. Local Development Setup (`.env.local`)

For testing on your local machine (`http://localhost:3000`), create a file named `.env.local` in the project root:

```env
# Google Cloud SQL or local PostgreSQL
DATABASE_URL=postgresql://postgres:Ayush1234%407890@34.29.240.199:5432/postgres

# Google AI Studio (Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# Google PageSpeed Insights
PAGESPEED_API_KEY=your_pagespeed_api_key_here
```

Restart your dev server:
```bash
npm run dev
```

---

## 6. Verification Checklist

1. Navigate to `/analyze` and audit `github.com`.
2. Inspect the **"AI Recommendations"** tab:
   - When `GEMINI_API_KEY` is active, the provider badge will display: **`Google Gemini (AI Generated)`**.
   - When omitted, it displays: **`Heuristic Rule Synthesizer`** with instant deterministic code snippets.
3. Inspect the **"Core Web Vitals"** tab:
   - When `PAGESPEED_API_KEY` is active, real lab audits from Google's servers populate FCP, LCP, CLS, TBT, and Speed Index.
   - When omitted or rate-limited, server-measured TTFB and transfer byte telemetry are shown with a clear provider badge.
