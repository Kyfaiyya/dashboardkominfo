-- ============================================
-- Migration: Page & Tab Governance Engine Tables
-- ============================================

-- 1. Dashboard Page Configuration Table
CREATE TABLE IF NOT EXISTS dashboard_page_config (
    id              SERIAL PRIMARY KEY,
    page_key        VARCHAR(50) UNIQUE NOT NULL,
    title           VARCHAR(100) NOT NULL,
    category        VARCHAR(50) NOT NULL,
    icon_name       VARCHAR(50) NOT NULL,
    badge_label     VARCHAR(20),
    is_public       BOOLEAN DEFAULT TRUE,
    sort_order      INT DEFAULT 0,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_page_config_key ON dashboard_page_config (page_key);
CREATE INDEX IF NOT EXISTS idx_page_config_public ON dashboard_page_config (is_public);

-- 2. Dashboard Tab Configuration Table
CREATE TABLE IF NOT EXISTS dashboard_tab_config (
    id              SERIAL PRIMARY KEY,
    page_key        VARCHAR(50) NOT NULL,
    tab_key         VARCHAR(50) NOT NULL,
    title           VARCHAR(100) NOT NULL,
    is_public       BOOLEAN DEFAULT TRUE,
    sort_order      INT DEFAULT 0,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_page_tab UNIQUE (page_key, tab_key)
);

CREATE INDEX IF NOT EXISTS idx_tab_config_page ON dashboard_tab_config (page_key);

-- 3. Security & Governance Audit Logs Table
CREATE TABLE IF NOT EXISTS governance_audit_logs (
    id              SERIAL PRIMARY KEY,
    admin_username  VARCHAR(50) NOT NULL,
    action_type     VARCHAR(50) NOT NULL,
    target_type     VARCHAR(20) NOT NULL,
    target_key      VARCHAR(100) NOT NULL,
    old_value       TEXT,
    new_value       TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON governance_audit_logs (created_at DESC);
