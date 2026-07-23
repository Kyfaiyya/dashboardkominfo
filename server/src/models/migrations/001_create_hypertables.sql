-- ============================================
-- TimescaleDB schema for dashboard metrics
-- ============================================

-- Enable TimescaleDB extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Main time-series table for metric readings
CREATE TABLE IF NOT EXISTS metric_readings (
    time        TIMESTAMPTZ     NOT NULL,
    metric_type TEXT            NOT NULL,
    value       DOUBLE PRECISION NOT NULL,
    unit        TEXT,
    metadata    JSONB           DEFAULT '{}'
);

-- Convert to hypertable (TimescaleDB's time-series optimized table)
-- Partitions data by time for efficient range queries
SELECT create_hypertable('metric_readings', 'time', if_not_exists => TRUE);

-- Index for fast lookups by metric type within a time range
CREATE INDEX IF NOT EXISTS idx_metric_readings_type_time
    ON metric_readings (metric_type, time DESC);

-- Optional: enable compression for data older than 7 days
-- ALTER TABLE metric_readings SET (
--   timescaledb.compress,
--   timescaledb.compress_segmentby = 'metric_type'
-- );
-- SELECT add_compression_policy('metric_readings', INTERVAL '7 days');

-- Optional: retention policy — drop data older than 90 days
-- SELECT add_retention_policy('metric_readings', INTERVAL '90 days');
