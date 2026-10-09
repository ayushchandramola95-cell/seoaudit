-- Google Cloud SQL (PostgreSQL) Initial Schema for SeoSeite SaaS
-- Run this migration against your Cloud SQL PostgreSQL database

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  plan VARCHAR(32) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS analytics_connections (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(64) NOT NULL, -- 'google_analytics' or 'search_console'
  property_id VARCHAR(128) NOT NULL,
  encrypted_access_token TEXT NOT NULL,
  encrypted_refresh_token TEXT,
  token_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
