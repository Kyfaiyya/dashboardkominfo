/**
 * Seed script: Import Monitoring.xlsx data into PostgreSQL
 *
 * Usage:
 *   node scripts/seed-kominfo.js
 *
 * Prerequisites:
 *   - Database running (docker-compose up)
 *   - Migration 003 already applied (npm run migrate)
 */
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { read, utils } from 'xlsx';
import db, { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { logger } from '../src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const xlsxPath = path.join(__dirname, '..', '..', 'Monitoring.xlsx');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    logger.warn(`Sheet "${sheetName}" not found in workbook`);
    return [];
  }
  const raw = utils.sheet_to_json(sheet, { header: 1, defval: '' });
  // Remove header row and empty rows
  return raw.slice(1).filter((row) => row.some((cell) => cell !== ''));
}

function toStr(val) {
  if (val === null || val === undefined || val === '') return null;
  return String(val).trim();
}

function toNum(val) {
  if (val === null || val === undefined || val === '' || val === '-') return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

// ─── Parsers per sheet ────────────────────────────────────────────────────────

function parseMenara(rows) {
  return rows.map((r) => ({
    alamat: toStr(r[1]),
    kelurahan: toStr(r[2]),
    kecamatan: toStr(r[3]),
    pemilik_menara: toStr(r[4]),
    operator: toStr(r[5]),
    latitude: toStr(r[6]),
    longitude: toStr(r[7]),
    tinggi: toNum(r[8]),
    tahun: toStr(r[9]),
  }));
}

function parseBlankspot(rows) {
  return rows.map((r) => ({
    kecamatan: toStr(r[1]),
    desa: toStr(r[2]),
    has_bts: String(r[3]).toLowerCase() === 'ya',
    provider: toStr(r[4]),
    kualitas_sinyal: toStr(r[5]),
  }));
}

function parseAplikasi(rows) {
  return rows.map((r) => ({
    url: toStr(r[1]),
    nama: toStr(r[2]),
    jenis: toStr(r[3]),
    platform: toStr(r[4]),
    keterangan: toStr(r[5]),
    status: toStr(r[6]) || 'Aktif',
  }));
}

function parseWifiPublik(rows) {
  return rows.map((r) => ({
    lokasi: toStr(r[0]),
    keterangan: toStr(r[1]),
    layanan: toStr(r[3]),
    bandwidth_mbps: toNum(r[4]),
    periode_bulan: toNum(r[5]),
    pic_kominfo: toStr(r[6]),
    pic_lokasi: toStr(r[7]),
    koordinat: toStr(r[8]),
  }));
}

function parseWebsiteDesa(rows) {
  return rows.map((r) => ({
    nama: toStr(r[1]),
    url: toStr(r[2]),
    kecamatan: toStr(r[5]) || toStr(r[3]) || null,
  }));
}

function parseWebsiteOpd(rows) {
  return rows.map((r) => ({
    nama: toStr(r[1]),
    website: toStr(r[2]),
    instagram: toStr(r[3]),
  }));
}

function parseCctv(rows) {
  return rows.map((r) => ({
    lokasi: toStr(r[1]),
    jumlah_titik: toNum(r[2]) || 0,
    area: toStr(r[3])?.replace(/\r?\n/g, '').trim() || null,
    status: toStr(r[4]) || 'Aktif',
  }));
}

// ─── Main Seed ────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await connectDatabase();
    logger.info('📖 Reading Monitoring.xlsx...');

    const buf = readFileSync(xlsxPath);
    const workbook = read(buf);

    logger.info(`📋 Sheets found: ${workbook.SheetNames.join(', ')}`);

    // Parse all sheets
    const menara = parseMenara(readSheet(workbook, 'Menara'));
    const blankspot = parseBlankspot(readSheet(workbook, 'Blankspot'));
    const aplikasi = parseAplikasi(readSheet(workbook, 'Aplikasi'));
    const wifi = parseWifiPublik(readSheet(workbook, 'WIFI Publik'));
    const desa = parseWebsiteDesa(readSheet(workbook, 'Website Desa'));
    const opd = parseWebsiteOpd(readSheet(workbook, 'Website OPD'));
    const cctv = parseCctv(readSheet(workbook, 'CCTV'));

    // Clear existing data (idempotent re-seed)
    logger.info('🗑️  Clearing existing kominfo data...');
    await db('menara_telekomunikasi').del();
    await db('blankspot_area').del();
    await db('aplikasi_website').del();
    await db('wifi_publik').del();
    await db('website_desa').del();
    await db('website_opd').del();
    await db('cctv_monitoring').del();

    // Insert in batches
    if (menara.length > 0) {
      await db.batchInsert('menara_telekomunikasi', menara, 50);
      logger.info(`✅ menara_telekomunikasi: ${menara.length} records`);
    }

    if (blankspot.length > 0) {
      await db.batchInsert('blankspot_area', blankspot, 50);
      logger.info(`✅ blankspot_area: ${blankspot.length} records`);
    }

    if (aplikasi.length > 0) {
      await db.batchInsert('aplikasi_website', aplikasi, 50);
      logger.info(`✅ aplikasi_website: ${aplikasi.length} records`);
    }

    if (wifi.length > 0) {
      await db.batchInsert('wifi_publik', wifi, 50);
      logger.info(`✅ wifi_publik: ${wifi.length} records`);
    }

    if (desa.length > 0) {
      await db.batchInsert('website_desa', desa, 50);
      logger.info(`✅ website_desa: ${desa.length} records`);
    }

    if (opd.length > 0) {
      await db.batchInsert('website_opd', opd, 50);
      logger.info(`✅ website_opd: ${opd.length} records`);
    }

    if (cctv.length > 0) {
      await db.batchInsert('cctv_monitoring', cctv, 50);
      logger.info(`✅ cctv_monitoring: ${cctv.length} records`);
    }

    const total = menara.length + blankspot.length + aplikasi.length +
      wifi.length + desa.length + opd.length + cctv.length;
    logger.info(`\n🎉 Seed complete! Total: ${total} records inserted across 7 tables.`);
  } catch (err) {
    logger.error('❌ Seed failed:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

seed();
