-- Migration: Create pegawai_records and api_fetch_logs tables

CREATE TABLE IF NOT EXISTS pegawai_records (
    nip          VARCHAR(50) PRIMARY KEY,
    nama         TEXT        NOT NULL,
    jabatan      TEXT,
    unit_kerja   TEXT,
    golongan     VARCHAR(20),
    status       VARCHAR(50),
    data_json    JSONB       DEFAULT '{}',
    updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_fetch_logs (
    id           SERIAL PRIMARY KEY,
    time         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source       TEXT        NOT NULL,
    status       VARCHAR(20) NOT NULL,
    record_count INT         DEFAULT 0,
    raw_payload  JSONB       DEFAULT '{}'
);
