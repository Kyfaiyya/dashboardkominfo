-- ============================================
-- Migration: Create Kominfo monitoring tables
-- Data source: Monitoring.xlsx (7 sheets)
-- ============================================

-- 1. Menara Telekomunikasi (132 records)
CREATE TABLE IF NOT EXISTS menara_telekomunikasi (
    id              SERIAL PRIMARY KEY,
    alamat          TEXT,
    kelurahan       TEXT,
    kecamatan       TEXT,
    pemilik_menara  TEXT,
    operator        TEXT,
    latitude        TEXT,
    longitude       TEXT,
    tinggi          NUMERIC,
    tahun           TEXT
);

CREATE INDEX IF NOT EXISTS idx_menara_kecamatan ON menara_telekomunikasi (kecamatan);

-- 2. Blankspot Area (9 records)
CREATE TABLE IF NOT EXISTS blankspot_area (
    id              SERIAL PRIMARY KEY,
    kecamatan       TEXT,
    desa            TEXT,
    has_bts         BOOLEAN DEFAULT FALSE,
    provider        TEXT,
    kualitas_sinyal TEXT
);

-- 3. Aplikasi & Website (125 records)
CREATE TABLE IF NOT EXISTS aplikasi_website (
    id              SERIAL PRIMARY KEY,
    url             TEXT,
    nama            TEXT,
    jenis           TEXT,
    platform        TEXT,
    keterangan      TEXT,
    status          VARCHAR(20) DEFAULT 'Aktif'
);

CREATE INDEX IF NOT EXISTS idx_aplikasi_jenis ON aplikasi_website (jenis);
CREATE INDEX IF NOT EXISTS idx_aplikasi_status ON aplikasi_website (status);

-- 4. WiFi Publik (7 records)
CREATE TABLE IF NOT EXISTS wifi_publik (
    id              SERIAL PRIMARY KEY,
    lokasi          TEXT,
    keterangan      TEXT,
    layanan         TEXT,
    bandwidth_mbps  NUMERIC,
    periode_bulan   INT,
    pic_kominfo     TEXT,
    pic_lokasi      TEXT,
    koordinat       TEXT
);

-- 5. Website Desa (30 records)
CREATE TABLE IF NOT EXISTS website_desa (
    id              SERIAL PRIMARY KEY,
    nama            TEXT,
    url             TEXT,
    kecamatan       TEXT
);

-- 6. Website OPD (35 records)
CREATE TABLE IF NOT EXISTS website_opd (
    id              SERIAL PRIMARY KEY,
    nama            TEXT,
    website         TEXT,
    instagram       TEXT
);

-- 7. CCTV Monitoring (29 records)
CREATE TABLE IF NOT EXISTS cctv_monitoring (
    id              SERIAL PRIMARY KEY,
    lokasi          TEXT,
    jumlah_titik    INT DEFAULT 0,
    area            TEXT,
    status          VARCHAR(20) DEFAULT 'Aktif'
);
