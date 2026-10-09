# Google Cloud Run & Cloud SQL Deployment Guide

This guide provides end-to-end instructions for deploying the **SeoSeite** platform on **Google Cloud Run** with a **Google Cloud SQL (PostgreSQL)** database, using Cloud Run's default temporary HTTPS URL (`*.a.run.app`).

---

## 1. Architecture Overview

```
+-------------------------------------------------------------+
| Browser / User Client                                       |
+------------------------------+------------------------------+
                               | HTTPS (*.a.run.app)
                               v
+-------------------------------------------------------------+
| Google Cloud Run (Serverless Container)                    |
| - Port: 8080 (PORT environment variable)                   |
| - Runtime: Node 20 Alpine Standalone Next.js 16            |
| - SSRF Guard: Blocks 169.254.169.254 & GCP metadata token  |
| - Auto-scaling: 0 to N instances on demand                  |
+------------------------------+------------------------------+
                               | Cloud SQL Unix Socket / TCP
                               v
+-------------------------------------------------------------+
| Google Cloud SQL (PostgreSQL 15)                            |
| - Database: seoseite                                        |
| - Tables: website_scans, comparisons, users                 |
+-------------------------------------------------------------+
```

---

## 2. Prerequisites

1. Install Google Cloud SDK (`gcloud` CLI):
   [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
2. Log in and configure your target Google Cloud project:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_GCP_PROJECT_ID
   ```
3. Enable required Google Cloud APIs:
   ```bash
   gcloud services enable \
     run.googleapis.com \
     sqladmin.googleapis.com \
     compute.googleapis.com \
     cloudbuild.googleapis.com \
     artifactregistry.googleapis.com
   ```

---

## 3. Provisioning Google Cloud SQL (PostgreSQL)

### A. Create the PostgreSQL Instance
Run the following command to create a cost-effective Cloud SQL instance:
```bash
gcloud sql instances create seoseite-postgres \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password="YourStrongRootPassword123!"
```

### B. Create Database and Dedicated Application User
```bash
# Create the SaaS database
gcloud sql databases create seoseite --instance=seoseite-postgres

# Create dedicated application user
gcloud sql users create seouser \
  --instance=seoseite-postgres \
  --password="YourAppPassword123!"
```

### C. Retrieve the Instance Connection Name
```bash
gcloud sql instances describe seoseite-postgres --format="value(connectionName)"
```
*Output will look like:* `YOUR_GCP_PROJECT_ID:us-central1:seoseite-postgres`. Note this down as `INSTANCE_CONNECTION_NAME`.

### D. Run Database Schema Migration
You can apply [`src/lib/db/schema.sql`](file:///c:/new%20website%20creation/seoseite/src/lib/db/schema.sql) through Cloud SQL Auth Proxy or the GCP Cloud Console Query Editor:
1. Open Google Cloud Console -> **Cloud SQL** -> **seoseite-postgres** -> **Cloud SQL Studio** (or connect via `psql`).
2. Paste and run the contents of [`src/lib/db/schema.sql`](file:///c:/new%20website%20creation/seoseite/src/lib/db/schema.sql).

---

## 4. Deploying SeoSeite to Google Cloud Run

Google Cloud Run can build your multi-stage `Dockerfile` automatically via Google Cloud Build and deploy it in a single command.

Run from the project root (`c:\new website creation\seoseite`):

```bash
gcloud run deploy seoseite \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances YOUR_GCP_PROJECT_ID:us-central1:seoseite-postgres \
  --set-env-vars NODE_ENV=production,PORT=8080,DATABASE_URL="postgresql://seouser:YourAppPassword123!@/seoseite?host=/cloudsql/YOUR_GCP_PROJECT_ID:us-central1:seoseite-postgres"
```

### Optional: Add Gemini AI and PageSpeed API Keys
```bash
gcloud run services update seoseite \
  --region us-central1 \
  --update-env-vars GEMINI_API_KEY="AIzaSy...",PAGESPEED_API_KEY="AIzaSy..."
```

---

## 5. Accessing Your Live Application

Once deployment completes, Cloud Run outputs your live service URL:
```
Service [seoseite] revision [seoseite-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://seoseite-612918274-uc.a.run.app
```

- This temporary/default domain on `*.run.app` gives you **automated SSL/TLS (HTTPS)**, **Google global CDN acceleration**, and **HTTP/2**.
- You can freely use this default domain for all demonstrations, portfolio review, capstone grading, and production beta testing.

---

## 6. Built-in Security Features on Google Cloud Run

1. **SSRF Metadata Protection**:
   Cloud Run runs on GCP infrastructure where internal services often query `http://metadata.google.internal` (IP: `169.254.169.254`) to fetch IAM access tokens.
   SeoSeite's [`src/lib/security/ssrf.ts`](file:///c:/new%20website%20creation/seoseite/src/lib/security/ssrf.ts) explicitly blocks DNS resolution to `metadata.google.internal` and IPv4 ranges `169.254.0.0/16`, preventing any unauthorized token extraction.

2. **Non-Root Container**:
   The [`Dockerfile`](file:///c:/new%20website%20creation/seoseite/Dockerfile) executes under UID/GID `1001` (`nextjs:nodejs`), preventing container breakout vulnerabilities.

3. **Database Resiliency**:
   If Cloud SQL is restarting or temporarily unattached, [`src/lib/db/client.ts`](file:///c:/new%20website%20creation/seoseite/src/lib/db/client.ts) transparently falls back to memory caching without throwing 500 errors to end users.
