import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

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

export interface DomainHistoryPoint {
  id: string;
  domain: string;
  seoScore: number;
  grade: string;
  perfScore: number | null;
  responseTimeMs: number;
  createdAt: string;
}

// In-memory fallback repository for local dev when PostgreSQL is not connected
const inMemoryScans: SavedScanRecord[] = [];
const inMemoryComparisons: SavedComparisonRecord[] = [];

let pool: Pool | null = null;
let schemaInitialized = false;
let dbDisabledUntil = 0;
let customDbUrlInMemory: string | null = null;

// Persistent path for custom in-site DB configuration
const CONFIG_DIR = path.join(process.cwd(), ".data");
const CONFIG_FILE = path.join(CONFIG_DIR, "custom-db-config.json");

/**
 * Loads custom database URL from persistent local storage or in-memory cache
 */
export function getCustomDatabaseUrl(): string | null {
  if (customDbUrlInMemory !== null) {
    return customDbUrlInMemory;
  }
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (data && typeof data.databaseUrl === "string" && data.databaseUrl.trim()) {
        customDbUrlInMemory = data.databaseUrl.trim();
        return customDbUrlInMemory;
      }
    }
  } catch {
    // Ignore read errors
  }
  return null;
}

/**
 * Saves or clears custom database URL and resets the connection pool
 */
export function setCustomDatabaseUrl(url: string | null): void {
  customDbUrlInMemory = url ? url.trim() : null;

  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    if (customDbUrlInMemory) {
      fs.writeFileSync(
        CONFIG_FILE,
        JSON.stringify(
          {
            databaseUrl: customDbUrlInMemory,
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        ),
        "utf-8"
      );
    } else if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
    }
  } catch (err) {
    console.warn("[CustomPostgres] Failed to persist custom-db-config.json:", err);
  }

  // Teardown existing pool to force reconnect with new credentials
  if (pool) {
    pool.end().catch(() => {});
    pool = null;
  }
  schemaInitialized = false;
  dbDisabledUntil = 0;
}

/**
 * Returns the effective database URL (custom configured in-site first, then env DATABASE_URL)
 */
export function getEffectiveDatabaseUrl(): string | null {
  const custom = getCustomDatabaseUrl();
  if (custom && custom.length > 0) return custom;
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl.trim().length > 0) return envUrl.trim();
  return null;
}

/**
 * Helper to mask sensitive passwords in PostgreSQL connection URIs
 */
export function maskDbUrl(url: string | null): string {
  if (!url) return "None (In-Memory Fallback Active)";
  try {
    // Standard URL regex or postgresql://user:pass@host:port/db
    return url.replace(/(:[^:@/]+)@/, ":••••••••@");
  } catch {
    return "postgresql://••••••••";
  }
}

/**
 * Ensures required database tables and indexes exist
 */
export async function ensureSchema(db: Pool): Promise<boolean> {
  if (schemaInitialized) return true;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(128) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        plan VARCHAR(32) DEFAULT 'free',
        api_key VARCHAR(128),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

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

      CREATE TABLE IF NOT EXISTS workspace_projects (
        id VARCHAR(64) PRIMARY KEY,
        domain VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        tag VARCHAR(128),
        source VARCHAR(64) DEFAULT 'custom',
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_workspace_projects_domain ON workspace_projects(domain);

      CREATE TABLE IF NOT EXISTS monitored_domains (
        id VARCHAR(64) PRIMARY KEY,
        domain VARCHAR(255) NOT NULL UNIQUE,
        frequency VARCHAR(32) DEFAULT 'daily',
        alert_email VARCHAR(255),
        last_score INTEGER,
        last_checked_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analytics_connections (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(128),
        provider VARCHAR(64) NOT NULL,
        property_id VARCHAR(128) NOT NULL,
        domain VARCHAR(255),
        access_token TEXT,
        refresh_token TEXT,
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    schemaInitialized = true;
    return true;
  } catch (err) {
    markDatabaseUnavailable(err);
    return false;
  }
}

export function markDatabaseUnavailable(reason: unknown) {
  dbDisabledUntil = Date.now() + 30000; // 30s cooldown before retrying
  const msg = reason instanceof Error ? reason.message : String(reason);
  console.warn(`[PostgreSQL] Database connection failure (${msg}). Using fast in-memory fallback for 30s.`);
}

export function getDbPool(): Pool | null {
  if (Date.now() < dbDisabledUntil) {
    return null;
  }
  const dbUrl = getEffectiveDatabaseUrl();
  if (!dbUrl) return null;

  if (!pool) {
    const isLocalhost = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");
    try {
      pool = new Pool({
        connectionString: dbUrl,
        ssl: isLocalhost ? false : { rejectUnauthorized: false },
        max: 8,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2500, // Fast 2.5s timeout so dev requests never hang
      });
      pool.on("error", (err) => {
        markDatabaseUnavailable(err);
      });
      ensureSchema(pool).catch(() => {});
    } catch (err) {
      markDatabaseUnavailable(err);
      return null;
    }
  }
  return pool;
}

/**
 * Tests a PostgreSQL connection URL and returns latency and server version
 */
export async function testPostgresConnection(targetUrl?: string) {
  const dbUrl = targetUrl?.trim() || getEffectiveDatabaseUrl();
  if (!dbUrl) {
    return {
      ok: false,
      error: "No PostgreSQL connection URL provided or configured.",
    };
  }

  const isLocalhost = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");
  const testPool = new Pool({
    connectionString: dbUrl,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 3000,
    max: 1,
  });

  const start = Date.now();
  try {
    const client = await testPool.connect();
    try {
      const res = await client.query("SELECT version(), current_database(), current_user, NOW()");
      const latencyMs = Date.now() - start;
      const row = res.rows[0];

      // Parse host and port from URL
      let host = "unknown";
      let port = 5432;
      try {
        const parsed = new URL(dbUrl);
        host = parsed.hostname;
        port = parsed.port ? parseInt(parsed.port, 10) : 5432;
      } catch {
        // Ignore parse error
      }

      return {
        ok: true,
        latencyMs,
        version: row?.version?.split(" on ")[0] || "PostgreSQL",
        fullVersion: row?.version || "PostgreSQL",
        database: row?.current_database || "default",
        user: row?.current_user || "postgres",
        host,
        port,
        sslActive: !isLocalhost,
        maskedUrl: maskDbUrl(dbUrl),
        timestamp: new Date().toISOString(),
      };
    } finally {
      client.release();
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      error: msg,
      latencyMs: Date.now() - start,
      maskedUrl: maskDbUrl(dbUrl),
    };
  } finally {
    await testPool.end().catch(() => {});
  }
}

/**
 * Checks connection state to Google Cloud SQL / Custom PostgreSQL and Cloud Run.
 */
export function getDatabaseStatus() {
  const custom = getCustomDatabaseUrl();
  const envUrl = process.env.DATABASE_URL;
  const isCustom = Boolean(custom && custom.length > 0);
  const isConfigured = Boolean((custom && custom.length > 0) || (envUrl && envUrl.length > 0));
  const isCloudRun = Boolean(process.env.K_SERVICE);

  const activeMode: "custom_postgres" | "env_postgres" | "in_memory" = isCustom
    ? "custom_postgres"
    : envUrl
    ? "env_postgres"
    : "in_memory";

  return {
    isCloudRun,
    isCloudSqlConfigured: isConfigured,
    mode: activeMode,
    isCustomPostgres: isCustom,
    maskedUrl: maskDbUrl(getEffectiveDatabaseUrl()),
    serviceName: process.env.K_SERVICE || "seoseite-local",
    revision: process.env.K_REVISION || "rev-local-dev",
    port: process.env.PORT || "8080",
    platform: isCloudRun ? "Google Cloud Run (Serverless Container)" : "Local Development Server",
    databaseType: isCustom
      ? "Custom In-Site PostgreSQL (Dedicated Instance)"
      : envUrl
      ? "Google Cloud SQL (Managed PostgreSQL via DATABASE_URL)"
      : "Local In-Memory Cache (Ready for Custom PostgreSQL)",
    cloudRunDomain: isCloudRun
      ? `https://${process.env.K_SERVICE || "seoseite"}-default.run.app`
      : "http://localhost:3000",
    totalSavedScans: inMemoryScans.length,
    totalSavedComparisons: inMemoryComparisons.length,
  };
}

/**
 * Detailed telemetry including table row counts from live PostgreSQL
 */
export async function getDatabaseTelemetry() {
  const status = getDatabaseStatus();
  const db = getDbPool();

  let liveStats = {
    connected: false,
    latencyMs: 0,
    tableCounts: {
      website_scans: inMemoryScans.length,
      comparisons: inMemoryComparisons.length,
      workspace_projects: 4,
      monitored_domains: 0,
      users: 0,
    },
    tables: [] as string[],
    databaseVersion: "In-Memory Storage",
    currentDatabase: "local_memory",
  };

  if (db) {
    const start = Date.now();
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout")), 1500)
      );

      const pingQuery = db.query("SELECT version(), current_database(), current_user");
      const pingRes = (await Promise.race([pingQuery, timeoutPromise])) as {
        rows: Array<{ version?: string; current_database?: string; current_user?: string }>;
      };
      const latencyMs = Date.now() - start;

      const scansCount = await db.query("SELECT count(*)::int as c FROM website_scans").catch(() => ({ rows: [{ c: 0 }] }));
      const compsCount = await db.query("SELECT count(*)::int as c FROM comparisons").catch(() => ({ rows: [{ c: 0 }] }));
      const projCount = await db.query("SELECT count(*)::int as c FROM workspace_projects").catch(() => ({ rows: [{ c: 0 }] }));
      const usersCount = await db.query("SELECT count(*)::int as c FROM users").catch(() => ({ rows: [{ c: 0 }] }));

      liveStats = {
        connected: true,
        latencyMs,
        tableCounts: {
          website_scans: scansCount.rows[0]?.c ?? inMemoryScans.length,
          comparisons: compsCount.rows[0]?.c ?? inMemoryComparisons.length,
          workspace_projects: projCount.rows[0]?.c ?? 4,
          monitored_domains: 0,
          users: usersCount.rows[0]?.c ?? 1,
        },
        tables: ["website_scans", "comparisons", "workspace_projects", "monitored_domains", "users", "analytics_connections"],
        databaseVersion: pingRes.rows[0]?.version?.split(" on ")[0] || "PostgreSQL",
        currentDatabase: pingRes.rows[0]?.current_database || "seoseite",
      };
    } catch (err) {
      markDatabaseUnavailable(err);
    }
  }

  return {
    ...status,
    ...liveStats,
    poolStats: {
      totalCount: pool?.totalCount || 0,
      idleCount: pool?.idleCount || 0,
      waitingCount: pool?.waitingCount || 0,
    },
  };
}

/**
 * Copies in-memory scans and comparisons into PostgreSQL
 */
export async function syncMemoryToPostgres(): Promise<{ syncedScans: number; syncedComparisons: number }> {
  const db = getDbPool();
  if (!db) {
    throw new Error("Cannot sync: PostgreSQL connection is not active.");
  }
  await ensureSchema(db);

  let syncedScans = 0;
  let syncedComparisons = 0;

  for (const scan of inMemoryScans) {
    try {
      await db.query(
        `INSERT INTO website_scans 
         (id, user_id, user_email, domain, target_url, seo_score, grade, response_time_ms, perf_score, tech_count, traffic_range, full_report_json, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO NOTHING`,
        [
          scan.id,
          scan.userId || null,
          scan.userEmail || null,
          scan.domain,
          scan.targetUrl,
          scan.seoScore,
          scan.grade,
          scan.responseTimeMs,
          scan.perfScore,
          scan.techCount,
          scan.trafficRange,
          JSON.stringify(scan.fullReportJson),
          scan.createdAt,
        ]
      );
      syncedScans++;
    } catch {
      // Skip duplicate or error
    }
  }

  for (const comp of inMemoryComparisons) {
    try {
      await db.query(
        `INSERT INTO comparisons 
         (id, site_a_domain, site_b_domain, site_a_score, site_b_score, seo_diff, full_report_json, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [
          comp.id,
          comp.siteADomain,
          comp.siteBDomain,
          comp.siteAScore,
          comp.siteBScore,
          comp.seoDiff,
          JSON.stringify(comp.fullReportJson),
          comp.createdAt,
        ]
      );
      syncedComparisons++;
    } catch {
      // Skip duplicate or error
    }
  }

  return { syncedScans, syncedComparisons };
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
      console.warn("[PostgreSQL] Failed to query scans, falling back to memory:", err);
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
      console.warn("[PostgreSQL] Failed to persist comparison to database, using memory cache:", err);
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
      console.warn("[PostgreSQL] Failed to query comparisons, falling back to memory:", err);
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
      console.warn("[PostgreSQL] Failed to query scan by id:", err);
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
      console.warn("[PostgreSQL] Failed to query comparison by id:", err);
    }
  }

  const memoryMatch = inMemoryComparisons.find((c) => c.id === id);
  return memoryMatch || null;
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
