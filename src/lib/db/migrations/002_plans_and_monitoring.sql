-- Migration 002: Plan Tier Limits, Monitored Domains Watchlist, and Automated Webhook Alerts
-- Execute against Google Cloud SQL (PostgreSQL) or Supabase

-- 1. Extend users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS tier VARCHAR(32) DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_scan_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_scan_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS seats_allocated INTEGER DEFAULT 1;

-- 2. Monitored Domain Watchlist (Portfolios)
CREATE TABLE IF NOT EXISTS monitored_domains (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  target_url TEXT NOT NULL,
  check_frequency VARCHAR(32) DEFAULT 'weekly', -- 'daily' or 'weekly'
  last_score INTEGER,
  last_grade VARCHAR(8),
  last_checked_at TIMESTAMP WITH TIME ZONE,
  webhook_url TEXT,
  alert_on_score_drop BOOLEAN DEFAULT true,
  alert_on_404_found BOOLEAN DEFAULT true,
  status VARCHAR(32) DEFAULT 'active', -- 'active' or 'paused'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_monitored_domains_status ON monitored_domains(status);
CREATE INDEX IF NOT EXISTS idx_monitored_domains_user ON monitored_domains(user_id);

-- 3. Audit Alerts Log
CREATE TABLE IF NOT EXISTS audit_alerts (
  id VARCHAR(64) PRIMARY KEY,
  domain_id VARCHAR(64) REFERENCES monitored_domains(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  severity VARCHAR(32) NOT NULL, -- 'critical', 'warning', 'info'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  previous_score INTEGER,
  new_score INTEGER,
  webhook_status VARCHAR(32) DEFAULT 'pending', -- 'sent', 'failed', 'pending'
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_alerts_domain ON audit_alerts(domain);
CREATE INDEX IF NOT EXISTS idx_audit_alerts_created_at ON audit_alerts(created_at DESC);

-- 4. Brand Radar AI Scans Table
CREATE TABLE IF NOT EXISTS brand_radar_scans (
  id VARCHAR(64) PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  brand_name VARCHAR(255) NOT NULL,
  share_of_voice INTEGER NOT NULL,
  total_prompts INTEGER NOT NULL,
  cited_prompts INTEGER NOT NULL,
  average_rank NUMERIC(3, 1),
  provider VARCHAR(128) NOT NULL,
  raw_results_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_brand_radar_domain ON brand_radar_scans(domain);
CREATE INDEX IF NOT EXISTS idx_brand_radar_created_at ON brand_radar_scans(created_at DESC);
