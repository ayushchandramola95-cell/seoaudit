# Academic Capstone Project Report & Viva Voce Guide

## Project Title
**SeoSeite / WebIntel: An AI-Powered Website Intelligence, Deterministic SEO Auditing, Traffic Estimation & Competitor Benchmarking Platform**

**Degree:** Bachelor of Computer Applications (BCA) — Final Year Capstone Project  
**Candidate Name:** Ayush Chandramola  
**Academic Year:** 2025–2026  
**Technology Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Cheerio, PostgreSQL 16 (Google Cloud SQL), Google Cloud Run  
**Live Production URL:** `https://seoaudit-93977081206.us-central1.run.app`  
**GitHub Repository:** `https://github.com/ayushchandramola95-cell/seoaudit`  

---

## Abstract

In the modern digital landscape, web presence optimization is critical for businesses, developers, and digital marketers. However, conventional website intelligence tools (such as Ahrefs, Semrush, and Similarweb) are cost-prohibitive for students and small-to-medium enterprises (SMEs), frequently cost hundreds of dollars monthly, and often present black-box or hallucinated metrics. 

**SeoSeite** is an open, full-stack, enterprise-grade Website Intelligence SaaS platform designed to inspect any public website URL and deliver transparent, honest intelligence across five analytical pillars:
1. **Deterministic Technical SEO Auditing:** A transparent, rule-based 0–100 scoring model evaluating metadata, heading hierarchy, indexability directives, and security headers.
2. **Technology Stack Detection:** Signature-based fingerprinting identifying over 50 frameworks, CMSs, CDNs, analytics libraries, and server runtimes.
3. **Core Web Vitals & Performance Telemetry:** Cloud-hosted Google PageSpeed Insights integration measuring FCP, LCP, CLS, and TBT.
4. **Heuristic Traffic Estimation:** A transparent statistical estimation model applying domain footprint analysis and search click distribution models without fabricating proprietary clickstream logs.
5. **AI Diagnostic & Recommendations Layer:** A dual-mode synthesis engine combining Google Gemini 1.5 Flash with deterministic local fallback heuristics to generate prioritized developer action items and code snippets without metric hallucination.

The system is deployed on **Google Cloud Run** using a containerized microservice architecture connected to a managed **Google Cloud SQL (PostgreSQL 16)** instance, ensuring sub-second response times, zero-trust SSRF security, and high reliability.

---

## Table of Contents
1. [Chapter 1: Introduction & Problem Statement](#chapter-1-introduction--problem-statement)
2. [Chapter 2: Literature Survey & Comparative Analysis](#chapter-2-literature-survey--comparative-analysis)
3. [Chapter 3: System Requirements Specification (SRS)](#chapter-3-system-requirements-specification-srs)
4. [Chapter 4: System Architecture & Design Diagrams](#chapter-4-system-architecture--design-diagrams)
5. [Chapter 5: Mathematical & Algorithmic Formulations](#chapter-5-mathematical--algorithmic-formulations)
6. [Chapter 6: Security Engineering & SSRF Defense](#chapter-6-security-engineering--ssrf-defense)
7. [Chapter 7: Database Design (PostgreSQL 16)](#chapter-7-database-design-postgresql-16)
8. [Chapter 8: Cloud Infrastructure & DevOps (Google Cloud Run)](#chapter-8-cloud-infrastructure--devops-google-cloud-run)
9. [Chapter 9: Testing, Verification & Results](#chapter-9-testing-verification--results)
10. [Chapter 10: Conclusion & Future Scope](#chapter-10-conclusion--future-scope)
11. [Chapter 11: Comprehensive Viva Voce Preparation Guide (25 Q&As)](#chapter-11-comprehensive-viva-voce-preparation-guide-25-qas)

---

## Chapter 1: Introduction & Problem Statement

### 1.1 Context
Search engine visibility, performance compliance (Core Web Vitals), and modern technology adoption determine whether an online venture succeeds. Developers and agency owners frequently need to evaluate competing websites, assess client sites during pre-sales, and diagnose technical deficiencies.

### 1.2 Problem Statement
Existing commercial audit tools suffer from three fundamental drawbacks:
1. **Excessive Cost:** Platforms charge $100–$499/month, putting them out of reach for students, freelancers, and growing agencies.
2. **Metric Fabrication & Black Boxes:** Traffic counters and "domain ratings" often show fabricated numbers without disclosing confidence intervals or mathematical limitations.
3. **Excessive Resource Footprint:** Traditional scrapers launch heavy headless browsers (Puppeteer/Playwright) on local servers, consuming 1–2 GB RAM per crawl and causing server crashes under concurrent traffic.

### 1.3 Project Objectives
- Build an ultra-fast, lightweight public crawler using Cheerio and native HTTP streaming capable of sub-second page inspection.
- Formulate a transparent, deterministic 0–100 scoring model across 4 distinct categories.
- Implement fingerprinting algorithms for 50+ modern web technologies.
- Integrate Core Web Vitals telemetry via Google PageSpeed Insights REST API to offload Lighthouse computation to Google Cloud infrastructure.
- Deliver an AI diagnostic assistant that synthesizes raw audit data into prioritized developer fixes with copyable code snippets.
- Build a dual-domain parallel comparison engine with automated delta metrics and technology stack diffing.
- Implement permanent shareable report snapshots (`/report/[id]`) and executive `@media print` PDF generation.
- Deploy in production on Google Cloud Run and Google Cloud SQL with strict Server-Side Request Forgery (SSRF) defense.

---

## Chapter 2: Literature Survey & Comparative Analysis

| Feature / Attribute | Commercial Tools (Semrush / Ahrefs) | Browser Extensions (Wappalyzer / Lighthouse) | **SeoSeite Platform (Our Solution)** |
| :--- | :--- | :--- | :--- |
| **Cost** | $129 – $499 / month | Freemium / Rate-limited | **Free / Open Source** |
| **Server Overhead** | Proprietary SaaS cloud | High client browser CPU | **Sub-second Cheerio DOM parsing (~140MB container)** |
| **Data Honesty** | Opaque black-box estimates | Lab-only metrics | **Transparent formulas with explicit confidence tiers** |
| **Competitor Benchmarking** | Paid subscription required | Manual tab comparison | **Parallel side-by-side comparative engine** |
| **AI Action Items** | Generic textual recommendations | None | **Gemini 1.5 Flash + Deterministic Code Snippets** |
| **Persistence & Sharing** | Account required | None / local storage only | **Permanent snapshot URLs (`/report/[id]`) & Print/PDF** |
| **Cloud Deployment** | Proprietary | N/A | **Google Cloud Run + Cloud SQL (PostgreSQL 16)** |

---

## Chapter 3: System Requirements Specification (SRS)

### 3.1 Functional Requirements
1. **Public URL Analysis:** System accepts any standard HTTP/HTTPS domain and executes DNS verification, HTTP streaming, and DOM parsing.
2. **Deterministic Category Scoring:** Evaluates Metadata (25 pts), Content & Structure (25 pts), Indexability (25 pts), and Security & Quality (25 pts).
3. **Technology Fingerprinting:** Detects CMS, frameworks, CSS utilities, analytics, CDNs, and server engines with evidence logging.
4. **Core Web Vitals Telemetry:** Extracts FCP, LCP, CLS, TBT, and Speed Index with official Google threshold classifications (Good / Needs Improvement / Poor).
5. **Heuristic Traffic Estimation:** Computes estimated monthly visit ranges, top search channels, and confidence scores based on empirical heuristics.
6. **Side-by-Side Comparison:** Crawls two domains simultaneously and calculates comparative metrics and stack differentials.
7. **Database Storage & Permanent Links:** Saves scan payloads to PostgreSQL 16 and generates unique UUID-based shareable report permalinks.
8. **Executive Print / PDF Export:** Generates clean, printer-friendly reports without navigation or interactive widgets.

### 3.2 Non-Functional Requirements
- **Performance:** Crawl and scoring completed within 1.5 seconds.
- **Security:** Complete mitigation of SSRF, link-local metadata exfiltration, and cross-site scripting (XSS).
- **Aesthetics:** Light-mode first, flat modern design tokens, crisp 1px borders, zero 3D clutter.
- **Portability:** Multi-stage Docker container buildable on any OCI-compliant runtime (Google Cloud Run, AWS ECS, Kubernetes).

---

## Chapter 4: System Architecture & Design Diagrams

### 4.1 High-Level System Architecture

```mermaid
graph TD
    Client[Web Browser / Client] -->|HTTPS Requests| CloudRun[Google Cloud Run Container: Port 8080]
    
    subgraph Google Cloud Run Service
        NextServer[Next.js 16 App Router Server]
        SSRFGuard[SSRF Security Guard]
        Fetcher[Cheerio HTML Scraper]
        Scorer[Deterministic SEO Scorer]
        TechDetector[Technology Fingerprinter]
        TrafficEstimator[Heuristic Traffic Engine]
        AIService[AI Diagnostics Service]
    end

    subgraph External Cloud Services
        PageSpeedAPI[Google PageSpeed Insights API]
        GeminiAPI[Google Gemini 1.5 Flash API]
        TargetSite[Target Public Website]
    end

    subgraph Managed Database
        CloudSQL[(Google Cloud SQL: PostgreSQL 16)]
    end

    NextServer --> SSRFGuard
    SSRFGuard -->|Validate Public IP| Fetcher
    Fetcher -->|GET Request| TargetSite
    Fetcher -->|Raw DOM & Headers| Scorer
    Fetcher -->|DOM & Meta Signatures| TechDetector
    Scorer & TechDetector --> TrafficEstimator
    NextServer -->|Fetch Lab CWV| PageSpeedAPI
    NextServer -->|Generate Recommendations| GeminiAPI
    NextServer -->|Store Scans & Comparisons| CloudSQL
    NextServer -->|Return JSON & React 19 UI| Client
```

### 4.2 Data Flow Diagram (DFD Level 0 & Level 1)

**Level 0 (Context Diagram):**
```mermaid
graph LR
    User([User / Developer]) -->|Submit Target Domain URL| System[SeoSeite SaaS Platform]
    TargetWeb([Target Web Server]) -->|HTML & Headers| System
    PageSpeed([Google Cloud APIs]) -->|Core Web Vitals & AI Insight| System
    System -->|Executive Audit Report & Snapshot| User
    System <-->|Read / Write Audit History| DB[(PostgreSQL Database)]
```

**Level 1 (Detailed Data Flow):**
```mermaid
graph TD
    A[User Input URL] --> B[SSRF Validator]
    B -->|Passed| C[Native HTTP Fetcher]
    B -->|Failed| Err[Return 400 Bad Request]
    C --> D[Cheerio DOM Parser]
    D --> E[SEO Rules Evaluator]
    D --> F[Tech Stack Signatures Matcher]
    C --> G[PageSpeed Client]
    E & F --> H[Traffic Estimator Model]
    E & F & G & H --> I[AI Diagnostic Service]
    I --> J[PostgreSQL Client Pool]
    J --> K[(website_scans Table)]
    I --> L[JSON Response / React 19 Server Render]
```

---

## Chapter 5: Mathematical & Algorithmic Formulations

### 5.1 Deterministic SEO Scoring Formulation

The total technical SEO score $S_{\text{total}} \in [0, 100]$ is computed as the sum of four discrete weighted categories:

$$S_{\text{total}} = C_{\text{metadata}} + C_{\text{structure}} + C_{\text{indexability}} + C_{\text{security}}$$

Where each category $C_k$ is bounded by:

$$0 \le C_k \le 25, \quad \forall k \in \{\text{metadata}, \text{structure}, \text{indexability}, \text{security}\}$$

#### Category Deductions Matrix:
1. **Metadata ($C_{\text{metadata}}$):**
   - Title tag present: +10 pts (Length optimal 30–60 chars: full 10 pts; sub-optimal: 5 pts; missing: 0 pts)
   - Meta description present: +8 pts (Length optimal 120–160 chars: full 8 pts; sub-optimal: 4 pts)
   - Canonical URL present & valid: +4 pts
   - Viewport meta tag configured: +3 pts
2. **Content & Structure ($C_{\text{structure}}$):**
   - Single valid `<h1>` heading: +10 pts (Multiple `<h1>`: 5 pts; Missing `<h1>`: 0 pts)
   - Heading hierarchy logic (`<h2>` through `<h6>`): +5 pts
   - Image accessibility: +5 pts (Ratio of images with non-empty `alt` attribute $\ge 80\%$)
   - Document word count ($\ge 300$ words): +5 pts
3. **Indexability ($C_{\text{indexability}}$):**
   - Robots meta directives allow indexing (`noindex` absent): +10 pts
   - `/robots.txt` file reachable and valid: +5 pts
   - `/sitemap.xml` declaration discoverable: +5 pts
   - Schema.org JSON-LD structured data detected: +5 pts
4. **Security & Protocol ($C_{\text{security}}$):**
   - HTTPS protocol enforced: +10 pts
   - Strict-Transport-Security (HSTS) header present: +5 pts
   - X-Content-Type-Options (`nosniff`): +3 pts
   - X-Frame-Options or CSP frame-ancestors: +4 pts
   - Fast Time-to-First-Byte (TTFB $\le 500\text{ms}$): +3 pts

---

### 5.2 Heuristic Traffic Estimation Model

The heuristic traffic estimation engine estimates monthly visit volume $V_{\text{est}}$ using a multi-factor logarithmic footprint model:

$$V_{\text{est}} = B_0 \times \left(1 + \ln(1 + N_{\text{words}})\right) \times \left(1 + \ln(1 + N_{\text{links}})\right) \times W_{\text{tech}} \times W_{\text{seo}}$$

Where:
- $B_0$ is the baseline domain authority anchor.
- $N_{\text{words}}$ is the total indexable body word count.
- $N_{\text{links}}$ is the number of internal navigational pathways.
- $W_{\text{tech}}$ is a tech-footprint multiplier ($1.25$ if enterprise CDN/frameworks detected, $1.0$ otherwise).
- $W_{\text{seo}} = \frac{S_{\text{total}}}{100}$ represents the SEO compliance multiplier.

#### Traffic Confidence Score Formulation:
The confidence score $K \in [0, 100]$ is calculated dynamically based on data availability:

$$K = 25 \cdot \mathbb{I}(\text{PageSpeed Lab Active}) + 25 \cdot \mathbb{I}(\text{Structured Data Present}) + 25 \cdot \mathbb{I}(\text{Sitemap Discoverable}) + 25 \cdot \mathbb{I}(\text{Robots.txt Valid})$$

- $K \ge 75$: **High Confidence**
- $50 \le K < 75$: **Medium Confidence**
- $K < 50$: **Low Confidence (Heuristic Approximation)**

---

## Chapter 6: Security Engineering & SSRF Defense

Server-Side Request Forgery (SSRF) represents a critical vulnerability in web crawlers, wherein an attacker tricks the server into making requests to internal loopback interfaces or cloud infrastructure metadata services.

### 6.1 Defense Implementation (`src/lib/security/ssrf.ts`)
The platform implements multi-tier server-side validation before any outbound socket connection:

1. **Protocol Whitelisting:** Only `http:` and `https:` schemes are accepted. Protocols like `file:`, `ftp:`, `gopher:`, or `data:` are rejected.
2. **DNS Resolution & Private IP Blacklisting:** Prior to issuing an HTTP request, the domain is resolved via Node's `dns.lookup`. The resolved IP address is verified against:
   - Loopback: `127.0.0.0/8`, `::1`
   - RFC 1918 Private Networks: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
   - Carrier-Grade NAT: `100.64.0.0/10`
   - Link-Local Addresses: `169.254.0.0/16`
3. **Cloud Metadata Shield:** Explicitly blocks AWS/GCP instance metadata IP (`169.254.169.254`) and Google internal metadata DNS (`metadata.google.internal`).
4. **Payload & Timeout Safeguards:** Outbound requests enforce a maximum payload limit of 5 MB and a 8.0-second abort signal timeout to mitigate Denial of Service (DoS) attacks.

---

## Chapter 7: Database Design (PostgreSQL 16)

The relational database is provisioned on **Google Cloud SQL** running PostgreSQL 16.

### 7.1 Entity-Relationship (ER) Schema

```mermaid
erDiagram
    WEBSITE_SCANS {
        uuid id PK
        varchar domain
        varchar target_url
        int seo_score
        varchar seo_grade
        int performance_score
        varchar estimated_visits
        varchar traffic_confidence
        int tech_count
        jsonb full_report
        timestamp created_at
    }

    COMPARISONS {
        uuid id PK
        varchar site_a_domain
        varchar site_b_domain
        int site_a_score
        int site_b_score
        varchar winner
        jsonb full_comparison
        timestamp created_at
    }

    USERS {
        uuid id PK
        varchar email UK
        varchar plan_tier
        timestamp created_at
    }

    ANALYTICS_CONNECTIONS {
        uuid id PK
        uuid user_id FK
        varchar property_id
        varchar provider
        timestamp connected_at
    }

    USERS ||--o{ ANALYTICS_CONNECTIONS : owns
    USERS ||--o{ WEBSITE_SCANS : saves
```

### 7.2 Database Tables Specification
1. **`website_scans`**: Stores audited domains, SEO scores, grades, Core Web Vitals, traffic ranges, and full structured JSON payloads. Indexed on `domain` and `created_at DESC`.
2. **`comparisons`**: Stores side-by-side benchmark outcomes, score deltas, and comparison payloads. Indexed on `created_at DESC`.
3. **`users`**: Manages developer accounts and subscription tiers (Free, Pro, Enterprise).
4. **`analytics_connections`**: Stores encrypted OAuth tokens for first-party Google Analytics 4 (GA4) and Google Search Console (GSC) properties.

---

## Chapter 8: Cloud Infrastructure & DevOps (Google Cloud Run)

### 8.1 Google Cloud Run Architecture
Google Cloud Run provides serverless container execution with automatic horizontal autoscaling (0 to 10 instances).

- **Multi-Stage Dockerfile:** Built on `node:20-alpine`. Employs Next.js `output: "standalone"` producing a minimal ~140 MB container image.
- **Port Contract:** Conforms to Google Cloud Run port standard: `PORT=8080`, `HOSTNAME=0.0.0.0`.
- **Security:** Executes under an unprivileged non-root Linux user (`nextjs:nodejs`, UID 1001).
- **Automated CI/CD:** Connected to the GitHub repository (`main` branch) via Google Cloud Build triggers. Every push triggers an automated build and zero-downtime rolling revision deployment.

---

## Chapter 9: Testing, Verification & Results

### 9.1 Test Execution Matrix
| Test Case ID | Test Description | Input Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Public Domain Audit | `github.com` | Return 0-100 score, tech stack, CWV, traffic | **PASS** |
| **TC-02** | SSRF Loopback Defense | `http://127.0.0.1:8080` | Rejected with 400 Bad Request (SSRF blocked) | **PASS** |
| **TC-03** | Cloud Metadata Shield | `http://169.254.169.254` | Rejected with 400 Bad Request (Metadata shielded) | **PASS** |
| **TC-04** | Competitor Comparison | `github.com vs gitlab.com` | Parallel crawl, delta scores, shared tech diff | **PASS** |
| **TC-05** | Permanent Snapshot | `/report/[uuid]` | Retrievable via permalink without re-crawling | **PASS** |
| **TC-06** | Print / PDF Export | `window.print()` trigger | Renders clean executive document without navbar | **PASS** |
| **TC-07** | Database Fallback | Disconnected DB | Gracefully falls back to in-memory pool | **PASS** |

---

## Chapter 10: Conclusion & Future Scope

### 10.1 Conclusion
SeoSeite demonstrates that modern, full-stack web applications can deliver enterprise-grade website intelligence and technical SEO diagnostics without expensive third-party subscriptions or bloated headless browser setups. By combining deterministic Cheerio DOM parsing, transparent statistical traffic models, Google PageSpeed telemetry, and Gemini AI synthesis, the platform offers an open, honest, and high-performance solution for web optimization.

### 10.2 Future Scope
1. **Google OAuth 2.0 Integration:** Enable verified site owners to link first-party Google Analytics 4 (GA4) and Google Search Console (GSC) to compare public estimates against verified reality.
2. **Automated Scheduled Audits:** Implement Google Cloud Scheduler cron jobs to monitor client domains for title tag modifications, robots.txt changes, or Core Web Vitals regressions.
3. **Multi-Page Crawler:** Expand single-page inspection to recursive site-wide crawling using breadth-first search (BFS).

---

## Chapter 11: Comprehensive Viva Voce Preparation Guide (25 Q&As)

### Q1: What is the core problem that your project solves?
**Answer:** Most website audit and traffic estimation tools (like Ahrefs or Semrush) cost hundreds of dollars monthly and present black-box or fabricated metrics. SeoSeite provides an open-source, deterministic, sub-second intelligence platform that calculates honest 0–100 SEO scores, identifies tech stacks, measures Core Web Vitals, and provides AI-powered developer recommendations without metric hallucination.

### Q2: What is the difference between Server-Side Rendering (SSR) and Client-Side Rendering (CSR) in your application?
**Answer:** In CSR, the browser downloads a blank HTML document and JavaScript builds the UI, which harms search indexing and slows initial paint. In SeoSeite, Next.js 16 App Router renders components on the server (SSR). When a user requests `/dashboard` or `/report/[id]`, the server queries the database, generates complete HTML, and streams it to the client, delivering instant First Contentful Paint (FCP) and optimal SEO.

### Q3: Why did you choose Cheerio instead of Puppeteer or Playwright for scraping?
**Answer:** Puppeteer and Playwright spin up full headless Chromium browser instances, which require 1–2 GB of RAM per instance and take 4–8 seconds to boot. Cheerio is an ultra-fast HTML parser that builds a DOM tree in memory using pure JavaScript in under 100 milliseconds and uses less than 20 MB of RAM. Because technical SEO checks (titles, meta tags, headings, canonicals, security headers) exist in the raw HTTP response, Cheerio is over 20x faster and allows hundreds of concurrent audits on a modest cloud server.

### Q4: How did you implement protection against Server-Side Request Forgery (SSRF)?
**Answer:** Before fetching any URL, `src/lib/security/ssrf.ts` parses the hostname and resolves its IP address via DNS lookup. It validates that the protocol is strictly `http:` or `https:` and verifies that the destination IP does not fall into private RFC 1918 ranges (`10.x.x.x`, `172.16-31.x.x`, `192.168.x.x`), loopback (`127.0.0.1`, `::1`), or cloud link-local metadata addresses (`169.254.169.254`). If an internal IP is detected, the request is aborted immediately.

### Q5: What is the deterministic formula used for the 0–100 SEO score?
**Answer:** The score is divided across four balanced categories of 25 points each:
1. **Metadata (25 pts):** Title tag presence and length (30–60 chars), meta description presence and length (120–160 chars), canonical URL, and viewport.
2. **Content & Structure (25 pts):** Single H1 tag, heading hierarchy (H2–H6), image alt text ratio ($\ge 80\%$), and word count ($\ge 300$).
3. **Indexability (25 pts):** Absence of `noindex`, valid `robots.txt`, discoverable `sitemap.xml`, and Schema.org structured data.
4. **Security & Protocol (25 pts):** HTTPS enforcement, HSTS header, `X-Content-Type-Options: nosniff`, anti-clickjacking headers, and sub-500ms TTFB.

### Q6: How does the Technology Stack Detector work?
**Answer:** In `src/lib/modules/tech/detector.ts`, we maintain a fingerprint dictionary of over 50 technologies. When a page is audited, the detector inspects four distinct layers:
1. **HTTP Response Headers:** E.g., `x-powered-by: Next.js`, `server: cloudflare`, `x-shopify-stage`.
2. **HTML Meta Tags:** E.g., `<meta name="generator" content="WordPress">`.
3. **Script Sources:** E.g., `googletagmanager.com`, `cdn.shopify.com`, `react.production.min.js`.
4. **DOM Signatures:** E.g., `#__next` for Next.js, `div[data-reactroot]` for React, `wp-content` classes.

### Q7: How does your Heuristic Traffic Estimator calculate visitor volume without access to private Google Analytics?
**Answer:** Public tools cannot view private analytics without OAuth. SeoSeite applies a transparent statistical model combining the domain's indexed word footprint, internal link hierarchy, detected technology stack, and SEO score compliance. We also calculate an explicit Confidence Score (High, Medium, Low) and display an honest disclaimer, adhering to our principle of zero metric fabrication.

### Q8: What role does AI play in your system? Does it compute the metrics?
**Answer:** No. AI is strictly an **analytical and diagnostic interpreter**, never the source of truth for raw numbers. Deterministic TypeScript code computes the SEO scores, HTTP headers, and Core Web Vitals. Google Gemini 1.5 Flash receives these verified findings and synthesizes an executive summary, identifies key gaps, and generates copyable code fixes (e.g., specific H1 markup, schema tags, or Nginx HSTS directives).

### Q9: What happens if the Gemini API key is missing or the external API is down?
**Answer:** The system features a dual-engine architecture with graceful fallback. If `GEMINI_API_KEY` is not present, times out, or encounters rate limits, `src/lib/modules/ai/service.ts` automatically switches to the `Heuristic Rule Synthesizer`. It generates rule-based diagnostic fixes and recommendations instantly without throwing an error to the user.

### Q10: How do you measure Core Web Vitals without running Google Chrome on the server?
**Answer:** We integrate with the official **Google PageSpeed Insights REST API** (`runPagespeed` endpoint). This offloads the intensive Lighthouse computation to Google Cloud servers. The API returns real lab metrics for First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Total Blocking Time (TBT). If the external API is unreachable, our system computes network telemetry based on measured server TTFB and payload size.

### Q11: Explain your database schema and why you chose PostgreSQL.
**Answer:** We selected PostgreSQL 16 on Google Cloud SQL because website scans and comparisons are relational in nature (domains, scores, timestamps, users). We store metadata and scalar metrics as indexed columns for high-speed queries (`domain`, `seo_score`, `created_at`) while storing the full audit hierarchy as a structured `jsonb` column (`full_report`). This gives us relational speed for filtering alongside NoSQL flexibility for complex audit payloads.

### Q12: How does your database client handle connection pooling and failover?
**Answer:** In `src/lib/db/client.ts`, we utilize `pg.Pool` with SSL configuration and a 5-second timeout. On the first database query, the client automatically executes `CREATE TABLE IF NOT EXISTS` to ensure all required tables are ready. Furthermore, if `DATABASE_URL` is omitted (e.g., during offline local development), the client automatically diverts queries to an in-memory storage array, ensuring zero developer friction.

### Q13: Why did you deploy on Google Cloud Run instead of a traditional Virtual Machine (VM)?
**Answer:** A traditional VM (like GCP Compute Engine or AWS EC2) runs 24/7, incurring continuous computing costs and requiring manual OS patching and scaling configurations. Google Cloud Run is a **stateless, serverless container platform** that charges purely on request-based billing. It scales down to zero when idle (costing $0.00) and automatically spins up container instances in sub-second time upon incoming traffic, perfectly optimizing our budget.

### Q14: How does the multi-stage Dockerfile optimize container size and security?
**Answer:** The Dockerfile employs a three-stage build:
1. `deps`: Installs production dependencies using Alpine Linux.
2. `builder`: Compiles Next.js with standalone output mode.
3. `runner`: Copies only the `.next/standalone` bundle and static public assets, discarding build tools and devDependencies.
This reduces container image size from over 1 GB down to ~140 MB. For security, the container runs under an unprivileged non-root user (`USER nextjs:nodejs`, UID 1001).

### Q15: What is the Cloud Run port contract?
**Answer:** Google Cloud Run dynamically assigns an ingress port via the `PORT` environment variable (defaulting to `8080`). The container runtime contract requires the web application to bind to `0.0.0.0` on that port. We configure this in the Dockerfile using `ENV PORT 8080` and `ENV HOSTNAME "0.0.0.0"`.

### Q16: How does the Competitor Comparison feature work?
**Answer:** When two URLs are submitted to `/api/compare`, the server uses `Promise.all` to crawl and audit both domains in parallel. Once both datasets resolve, `src/lib/modules/compare/comparator.ts` calculates mathematical deltas (`seoScoreDiff`, `performanceScoreDiff`, `responseTimeDiffMs`), diffs their technology stacks (shared vs unique), and generates an objective comparative summary highlighting empirical strengths of both sites.

### Q17: How did you implement permanent shareable report snapshots?
**Answer:** When an audit is performed, the complete payload is stored in the `website_scans` table and assigned a UUID `id`. Users can click "Share Report", which generates a permanent URL (`/report/[id]`). When loaded, `/api/report/[id]` retrieves the historical snapshot directly from PostgreSQL without re-crawling the site, ensuring that audit records remain unchanged over time.

### Q18: How does the Print / PDF Executive Export work without adding heavy PDF libraries?
**Answer:** Rather than adding heavy server-side PDF generation packages (like Puppeteer or html2pdf) that balloon bundle size, we leveraged clean CSS `@media print` rules in `src/app/globals.css`. When the user clicks "Print / PDF", `window.print()` is invoked. The print stylesheet hides navigation headers, footers, action buttons, and inputs, formats borders cleanly in grayscale, and ensures proper page-break hygiene, allowing the browser's native print engine to output a crisp executive PDF.

### Q19: What is React 19 and Next.js 16's Partial Prerendering (PPR) / Cache Components?
**Answer:** In Next.js 16 with Cache Components enabled, static page shells are prerendered at build time while dynamic segments stream asynchronously from the server. Dynamic route segments unwrap asynchronous parameters using React 19's `use(params)` inside a `<Suspense>` boundary, allowing instant skeleton loading states while streaming dynamic database records.

### Q20: How did you solve the PostgreSQL connection password encoding issue?
**Answer:** In connection URIs (e.g., `postgresql://postgres:password@host:5432/db`), special characters like `@` terminate the user:password section early if unescaped. If a database password contains `@` (e.g., `Ayush1234@7890`), it must be URL-encoded as `%40` (`Ayush1234%407890`). This ensures standard URI parsers recognize the entire string as the password rather than attempting to connect to host `7890`.

### Q21: What are Core Web Vitals, and why are they important?
**Answer:** Core Web Vitals are Google's standardized metrics for measuring real-world user experience:
- **LCP (Largest Contentful Paint):** Measures loading speed (main content visible in $\le 2.5\text{s}$).
- **FCP (First Contentful Paint):** Measures when the first pixel renders ($\le 1.8\text{s}$).
- **CLS (Cumulative Layout Shift):** Measures visual stability ($\le 0.1$).
- **TBT (Total Blocking Time):** Measures main thread responsiveness ($\le 200\text{ms}$).
Google utilizes Core Web Vitals as an official search ranking signal.

### Q22: What is the significance of HTTP security headers like HSTS and CSP?
**Answer:** 
- **HSTS (Strict-Transport-Security):** Forces browsers to communicate exclusively over HTTPS for a defined duration (`max-age=31536000`), preventing SSL-stripping man-in-the-middle attacks.
- **CSP (Content-Security-Policy):** Restricts the sources from which scripts, styles, and media can load, mitigating Cross-Site Scripting (XSS).
- **X-Content-Type-Options: nosniff:** Prevents browsers from MIME-sniffing responses away from the declared content type.

### Q23: Why did you prioritize a light-mode first, flat modern design over 3D or glassmorphism?
**Answer:** Enterprise SaaS tools and developer dashboards require high information density, fast rendering, and crisp contrast. Heavy 3D objects and bloated backdrop-blur filters increase GPU memory consumption, cause sluggish scrolling on mobile devices, and distract from technical data. Our flat design system utilizes clean white cards, subtle slate borders (`#e2e8f0`), and crisp typography to prioritize clarity and speed.

### Q24: How does the CI/CD pipeline deploy updates to Google Cloud Run?
**Answer:** The GitHub repository is integrated with Google Cloud Build via an automated trigger on the `main` branch. When changes are pushed to `origin main`, Cloud Build executes our `Dockerfile`, builds the standalone Next.js image, pushes the artifact to Google Artifact Registry, and issues a zero-downtime rolling revision update to Cloud Run.

### Q25: If you had 3 more months to work on this project, what would you add next?
**Answer:** 
1. **Google OAuth 2.0 Integration:** Allow authenticated users to connect Google Search Console and GA4 via OAuth to compare public estimations with verified first-party search impressions and clickstream logs.
2. **Automated Scheduled Audits:** Implement Google Cloud Scheduler cron jobs that execute daily audits and alert site owners via webhook or email if their SEO score drops or Core Web Vitals degrade.
3. **Multi-Page Crawling:** Implement a breadth-first search (BFS) queue to crawl entire website sitemaps and generate comprehensive domain-wide audit scores.
