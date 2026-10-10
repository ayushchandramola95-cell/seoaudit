import { Pool } from "pg";

export interface SavedScanRecord {
  id: string;
  domain: string;
  targetUrl: string;
  seoScore: number;
  grade: string;
  responseTimeMs: number;
  perfScore: number;
  techCount: number;
  trafficRange: string;
  createdAt: string;
  fullReportJson: Record<string, unknown>;
}

export interface SavedComparisonRecord {
  id: string;
  siteADomain: string;
  siteBDomain: string;
  siteAScore: number;
  siteBScore: number;
  seoDiff: number;
  createdAt: string;
  fullReportJson: Record<string, unknown>;
}

// In-memory fallback repository for local dev when Cloud SQL is not yet connected
const inMemoryScans: SavedScanRecord[] = [];
const inMemoryComparisons: SavedComparisonRecord[] = [];

let schemaInitialized = false;

async function ensureSchema(db: Pool) {
  if (schemaInitialized) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS website_scans (
        id VARCHAR(64) PRIMARY KEY,
        domain VARCHAR(255) NOT NULL,
        target_url TEXT NOT NULL,
        seo_score INTEGER NOT NULL,
        grade VARCHAR(8) NOT NULL,
        response_time_ms INTEGER NOT NULL,
        perf_score INTEGER,
        tech_count INTEGER DEFAULT 0,
        traffic_range VARCHAR(64),
        full_report_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_website_scans_domain ON website_scans(domain);
      CREATE INDEX IF NOT EXISTS idx_website_scans_created_at ON website_scans(created_at DESC);

      CREATE TABLE IF NOT EXISTS comparisons (
        id VARCHAR(64) PRIMARY KEY,
        site_a_domain VARCHAR(255) NOT NULL,
        site_b_domain VARCHAR(255) NOT NULL,
        site_a_score INTEGER NOT NULL,
        site_b_score INTEGER NOT NULL,
        seo_diff INTEGER NOT NULL,
        full_report_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_comparisons_sites ON comparisons(site_a_domain, site_b_domain);
      CREATE INDEX IF NOT EXISTS idx_comparisons_created_at ON comparisons(created_at DESC);
    `);
    schemaInitialized = true;
  } catch (err) {
    console.warn("[CloudSQL] Auto-schema initialization warning:", err);
  }
}

function getDbPool(): Pool | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  if (!pool) {
    const isLocalhost = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");
    pool = new Pool({
      connectionString: dbUrl,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    ensureSchema(pool);
  }
  return pool;
}

/**
 * Checks connection state to Google Cloud SQL and Google Cloud Run.
 */
export function getDatabaseStatus() {
  const dbUrl = process.env.DATABASE_URL;
  const isCloudSqlConfigured = Boolean(dbUrl && dbUrl.length > 0);
  const isCloudRun = Boolean(process.env.K_SERVICE); // Google Cloud Run automatically injects K_SERVICE

  return {
    isCloudRun,
    isCloudSqlConfigured,
    serviceName: process.env.K_SERVICE || "seoseite-local",
    revision: process.env.K_REVISION || "rev-local-dev",
    port: process.env.PORT || "8080",
    platform: isCloudRun ? "Google Cloud Run (Serverless Container)" : "Local Development Server",
    databaseType: isCloudSqlConfigured ? "Google Cloud SQL (Managed PostgreSQL)" : "Local In-Memory Cache (Ready for Cloud SQL)",
    cloudRunDomain: isCloudRun
      ? `https://${process.env.K_SERVICE || "seoseite"}-default.run.app`
      : "http://localhost:3000",
    totalSavedScans: inMemoryScans.length,
    totalSavedComparisons: inMemoryComparisons.length,
  };
}

/**
 * Persists an analyzed website audit report.
 */
export async function saveScanRecord(params: {
  domain: string;
  targetUrl: string;
  seoScore: number;
  grade: string;
  responseTimeMs: number;
  perfScore: number;
  techCount: number;
  trafficRange: string;
  fullReportJson: Record<string, unknown>;
}): Promise<SavedScanRecord> {
  const id = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  const record: SavedScanRecord = {
    id,
    domain: params.domain,
    targetUrl: params.targetUrl,
    seoScore: params.seoScore,
    grade: params.grade,
    responseTimeMs: params.responseTimeMs,
    perfScore: params.perfScore,
    techCount: params.techCount,
    trafficRange: params.trafficRange,
    createdAt,
    fullReportJson: params.fullReportJson,
  };

  // Always keep in-memory for instant fallback
  inMemoryScans.unshift(record);
  if (inMemoryScans.length > 50) inMemoryScans.pop();

  const db = getDbPool();
  if (db) {
    try {
      await db.query(
        `INSERT INTO website_scans 
         (id, domain, target_url, seo_score, grade, response_time_ms, perf_score, tech_count, traffic_range, full_report_json, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          id,
          params.domain,
          params.targetUrl,
          params.seoScore,
          params.grade,
          params.responseTimeMs,
          params.perfScore,
          params.techCount,
          params.trafficRange,
          JSON.stringify(params.fullReportJson),
          createdAt,
        ]
      );
    } catch (err) {
      console.warn("[CloudSQL] Failed to persist scan to PostgreSQL, using memory cache:", err);
    }
  }

  return record;
}

/**
 * Retrieves recent audits.
 */
export async function getRecentScans(limit = 15): Promise<SavedScanRecord[]> {
  const db = getDbPool();
  if (db) {
    try {
      const res = await db.query(
        `SELECT id, domain, target_url as "targetUrl", seo_score as "seoScore", grade, 
                response_time_ms as "responseTimeMs", perf_score as "perfScore", 
                tech_count as "techCount", traffic_range as "trafficRange", 
                created_at as "createdAt", full_report_json as "fullReportJson"
         FROM website_scans 
         ORDER BY created_at DESC 
         LIMIT $1`,
        [limit]
      );
      if (res.rows && res.rows.length > 0) {
        return res.rows.map((r) => ({
          ...r,
          createdAt: typeof r.createdAt === "object" ? r.createdAt.toISOString() : String(r.createdAt),
        }));
      }
    } catch (err) {
      console.warn("[CloudSQL] Failed to query PostgreSQL, falling back to memory:", err);
    }
  }

  return inMemoryScans.slice(0, limit);
}

/**
 * Persists a competitor comparison report.
 */
export async function saveComparisonRecord(params: {
  siteADomain: string;
  siteBDomain: string;
  siteAScore: number;
  siteBScore: number;
  seoDiff: number;
  fullReportJson: Record<string, unknown>;
}): Promise<SavedComparisonRecord> {
  const id = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  const record: SavedComparisonRecord = {
    id,
    siteADomain: params.siteADomain,
    siteBDomain: params.siteBDomain,
    siteAScore: params.siteAScore,
    siteBScore: params.siteBScore,
    seoDiff: params.seoDiff,
    createdAt,
    fullReportJson: params.fullReportJson,
  };

  inMemoryComparisons.unshift(record);
  if (inMemoryComparisons.length > 50) inMemoryComparisons.pop();

  const db = getDbPool();
  if (db) {
    try {
      await db.query(
        `INSERT INTO comparisons 
         (id, site_a_domain, site_b_domain, site_a_score, site_b_score, seo_diff, full_report_json, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          params.siteADomain,
          params.siteBDomain,
          params.siteAScore,
          params.siteBScore,
          params.seoDiff,
          JSON.stringify(params.fullReportJson),
          createdAt,
        ]
      );
    } catch (err) {
      console.warn("[CloudSQL] Failed to persist comparison to PostgreSQL, using memory cache:", err);
    }
  }

  return record;
}

/**
 * Retrieves recent competitor comparisons.
 */
export async function getRecentComparisons(limit = 10): Promise<SavedComparisonRecord[]> {
  const db = getDbPool();
  if (db) {
    try {
      const res = await db.query(
        `SELECT id, site_a_domain as "siteADomain", site_b_domain as "siteBDomain", 
                site_a_score as "siteAScore", site_b_score as "siteBScore", 
                seo_diff as "seoDiff", created_at as "createdAt", full_report_json as "fullReportJson"
         FROM comparisons 
         ORDER BY created_at DESC 
         LIMIT $1`,
        [limit]
      );
      if (res.rows && res.rows.length > 0) {
        return res.rows.map((r) => ({
          ...r,
          createdAt: typeof r.createdAt === "object" ? r.createdAt.toISOString() : String(r.createdAt),
        }));
      }
    } catch (err) {
      console.warn("[CloudSQL] Failed to query PostgreSQL, falling back to memory:", err);
    }
  }

  return inMemoryComparisons.slice(0, limit);
}
