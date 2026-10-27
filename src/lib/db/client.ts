import { Pool } from "pg";

export interface SavedScanRecord {
  id: string;
  userId?: string | null;
  userEmail?: string | null;
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

let pool: Pool | null = null;
let schemaInitialized = false;

async function ensureSchema(db: Pool) {
  if (schemaInitialized) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS website_scans (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(128),
        user_email VARCHAR(255),
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
      ALTER TABLE website_scans ADD COLUMN IF NOT EXISTS user_id VARCHAR(128);
      ALTER TABLE website_scans ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);
      CREATE INDEX IF NOT EXISTS idx_website_scans_user_id ON website_scans(user_id);
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
    markDatabaseUnavailable(err);
  }
}

let dbDisabledUntil = 0;

export function markDatabaseUnavailable(reason: unknown) {
  dbDisabledUntil = Date.now() + 60000; // 60s cooldown before retrying
  const msg = reason instanceof Error ? reason.message : String(reason);
  console.warn(`[CloudSQL] Remote database unreachable (${msg}). Using fast in-memory fallback for 60s.`);
}

export function getDbPool(): Pool | null {
  if (Date.now() < dbDisabledUntil) {
    return null;
  }
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  if (!pool) {
    const isLocalhost = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");
    pool = new Pool({
      connectionString: dbUrl,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 1500, // Fast 1.5s timeout so dev requests never hang
    });
    pool.on("error", (err) => {
      markDatabaseUnavailable(err);
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
  userId?: string | null;
  userEmail?: string | null;
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
    userId: params.userId || null,
    userEmail: params.userEmail || null,
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
         (id, user_id, user_email, domain, target_url, seo_score, grade, response_time_ms, perf_score, tech_count, traffic_range, full_report_json, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          id,
          params.userId || null,
          params.userEmail || null,
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
      markDatabaseUnavailable(err);
    }
  }

  return record;
}

/**
 * Retrieves recent audits, optionally filtered by user ID or user email.
 */
export async function getRecentScans(
  limit = 15,
  userId?: string | null,
  userEmail?: string | null
): Promise<SavedScanRecord[]> {
  const db = getDbPool();
  if (db) {
    try {
      let query = `
        SELECT id, user_id as "userId", user_email as "userEmail", domain, target_url as "targetUrl", 
               seo_score as "seoScore", grade, response_time_ms as "responseTimeMs", perf_score as "perfScore", 
               tech_count as "techCount", traffic_range as "trafficRange", 
               created_at as "createdAt", full_report_json as "fullReportJson"
        FROM website_scans
      `;
      const values: unknown[] = [];

      if (userId || userEmail) {
        query += ` WHERE (user_id = $1 OR ($2::text IS NOT NULL AND LOWER(user_email) = LOWER($2)))`;
        values.push(userId || null, userEmail || null);
        values.push(limit);
        query += ` ORDER BY created_at DESC LIMIT $3`;
      } else {
        values.push(limit);
        query += ` ORDER BY created_at DESC LIMIT $1`;
      }

      const res = await db.query(query, values);
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

  let filtered = inMemoryScans;
  if (userId || userEmail) {
    filtered = inMemoryScans.filter(
      (s) =>
        (userId && s.userId === userId) ||
        (userEmail && s.userEmail?.toLowerCase() === userEmail.toLowerCase())
    );
  }

  return filtered.slice(0, limit);
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

/**
 * Retrieves a single saved scan by ID.
 */
export async function getScanById(id: string): Promise<SavedScanRecord | null> {
  const db = getDbPool();
  if (db) {
    try {
      const res = await db.query(
        `SELECT id, user_id as "userId", user_email as "userEmail", domain, target_url as "targetUrl", seo_score as "seoScore", grade, 
                response_time_ms as "responseTimeMs", perf_score as "perfScore", 
                tech_count as "techCount", traffic_range as "trafficRange", 
                created_at as "createdAt", full_report_json as "fullReportJson"
         FROM website_scans 
         WHERE id = $1
         LIMIT 1`,
        [id]
      );
      if (res.rows && res.rows.length > 0) {
        const r = res.rows[0];
        return {
          ...r,
          createdAt: typeof r.createdAt === "object" ? r.createdAt.toISOString() : String(r.createdAt),
        };
      }
    } catch (err) {
      console.warn("[CloudSQL] Failed to query scan by id:", err);
    }
  }

  const memoryMatch = inMemoryScans.find((s) => s.id === id);
  return memoryMatch || null;
}

/**
 * Retrieves a single competitor comparison by ID.
 */
export async function getComparisonById(id: string): Promise<SavedComparisonRecord | null> {
  const db = getDbPool();
  if (db) {
    try {
      const res = await db.query(
        `SELECT id, site_a_domain as "siteADomain", site_b_domain as "siteBDomain", 
                site_a_score as "siteAScore", site_b_score as "siteBScore", 
                seo_diff as "seoDiff", created_at as "createdAt", full_report_json as "fullReportJson"
         FROM comparisons 
         WHERE id = $1
         LIMIT 1`,
        [id]
      );
      if (res.rows && res.rows.length > 0) {
        const r = res.rows[0];
        return {
          ...r,
          createdAt: typeof r.createdAt === "object" ? r.createdAt.toISOString() : String(r.createdAt),
        };
      }
    } catch (err) {
      console.warn("[CloudSQL] Failed to query comparison by id:", err);
    }
  }

  const memoryMatch = inMemoryComparisons.find((c) => c.id === id);
  return memoryMatch || null;
}

export interface DomainHistoryPoint {
  id: string;
  domain: string;
  seoScore: number;
  grade: string;
  perfScore: number | null;
  responseTimeMs: number;
  createdAt: string;
}

/**
 * Retrieves chronological scan history for a specific domain (oldest -> newest) for trend sparklines.
 */
export async function getDomainScanHistory(
  domain: string,
  limit = 12
): Promise<DomainHistoryPoint[]> {
  const cleanDomain = domain
    .trim()
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .replace(/\/.*$/, "");

  const db = getDbPool();
  if (db) {
    try {
      const res = await db.query(
        `SELECT id, domain, seo_score as "seoScore", grade, perf_score as "perfScore",
                response_time_ms as "responseTimeMs", created_at as "createdAt"
         FROM website_scans
         WHERE LOWER(domain) = $1
         ORDER BY created_at DESC
         LIMIT $2`,
        [cleanDomain, limit]
      );
      if (res.rows && res.rows.length > 0) {
        return res.rows
          .map((r) => ({
            id: r.id,
            domain: r.domain,
            seoScore: Number(r.seoScore),
            grade: r.grade,
            perfScore: r.perfScore !== null && r.perfScore !== undefined ? Number(r.perfScore) : null,
            responseTimeMs: Number(r.responseTimeMs || 0),
            createdAt:
              typeof r.createdAt === "object"
                ? r.createdAt.toISOString()
                : String(r.createdAt),
          }))
          .reverse();
      }
    } catch (err) {
      markDatabaseUnavailable(err);
    }
  }

  return inMemoryScans
    .filter((s) => s.domain.toLowerCase() === cleanDomain)
    .slice(0, limit)
    .map((s) => ({
      id: s.id,
      domain: s.domain,
      seoScore: s.seoScore,
      grade: s.grade,
      perfScore: s.perfScore ?? null,
      responseTimeMs: s.responseTimeMs,
      createdAt: s.createdAt,
    }))
    .reverse();
}

