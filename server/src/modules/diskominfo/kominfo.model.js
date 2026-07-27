import db from '../../config/database.js';
import { logger } from '../../utils/logger.js';

/**
 * Kominfo Model - Handles queries for all Kominfo monitoring data tables
 */
export class KominfoModel {
  // ─── Menara Telekomunikasi ──────────────────────────────────────────
  static async getAllMenara(filters = {}) {
    try {
      let query = db('menara_telekomunikasi').select('*');
      if (filters.kecamatan) {
        query = query.whereRaw('LOWER(kecamatan) = ?', [filters.kecamatan.toLowerCase()]);
      }
      if (filters.operator) {
        query = query.whereRaw('LOWER(operator) LIKE ?', [`%${filters.operator.toLowerCase()}%`]);
      }
      return await query.orderBy('id', 'asc');
    } catch (err) {
      logger.error('Failed to query menara:', err.message);
      return [];
    }
  }

  // ─── Blankspot Area ─────────────────────────────────────────────────
  static async getAllBlankspot() {
    try {
      return await db('blankspot_area').select('*').orderBy('id', 'asc');
    } catch (err) {
      logger.error('Failed to query blankspot:', err.message);
      return [];
    }
  }

  // ─── Aplikasi & Website ─────────────────────────────────────────────
  static async getAllAplikasi(filters = {}) {
    try {
      let query = db('aplikasi_website').select('*');
      if (filters.jenis) {
        query = query.whereRaw('LOWER(jenis) LIKE ?', [`%${filters.jenis.toLowerCase()}%`]);
      }
      if (filters.status) {
        query = query.whereRaw('LOWER(status) = ?', [filters.status.toLowerCase()]);
      }
      return await query.orderBy('id', 'asc');
    } catch (err) {
      logger.error('Failed to query aplikasi:', err.message);
      return [];
    }
  }

  // ─── WiFi Publik ────────────────────────────────────────────────────
  static async getAllWifiPublik() {
    try {
      return await db('wifi_publik').select('*').orderBy('id', 'asc');
    } catch (err) {
      logger.error('Failed to query wifi publik:', err.message);
      return [];
    }
  }

  // ─── Website Desa ───────────────────────────────────────────────────
  static async getAllWebsiteDesa(filters = {}) {
    try {
      let query = db('website_desa').select('*');
      if (filters.kecamatan) {
        query = query.whereRaw('LOWER(kecamatan) = ?', [filters.kecamatan.toLowerCase()]);
      }
      return await query.orderBy('id', 'asc');
    } catch (err) {
      logger.error('Failed to query website desa:', err.message);
      return [];
    }
  }

  // ─── Website OPD ────────────────────────────────────────────────────
  static async getAllWebsiteOpd() {
    try {
      return await db('website_opd').select('*').orderBy('id', 'asc');
    } catch (err) {
      logger.error('Failed to query website opd:', err.message);
      return [];
    }
  }

  // ─── CCTV Monitoring ───────────────────────────────────────────────
  static async getAllCctv(filters = {}) {
    try {
      let query = db('cctv_monitoring').select('*');
      if (filters.area) {
        query = query.whereRaw('LOWER(area) LIKE ?', [`%${filters.area.toLowerCase()}%`]);
      }
      return await query.orderBy('id', 'asc');
    } catch (err) {
      logger.error('Failed to query cctv:', err.message);
      return [];
    }
  }

  // ─── Summary / Aggregate Stats ─────────────────────────────────────
  static async getSummary() {
    try {
      const [menara, blankspot, aplikasi, wifi, desa, opd, cctv] = await Promise.all([
        db('menara_telekomunikasi').count('* as count').first(),
        db('blankspot_area').count('* as count').first(),
        db('aplikasi_website').count('* as count').first(),
        db('wifi_publik').count('* as count').first(),
        db('website_desa').count('* as count').first(),
        db('website_opd').count('* as count').first(),
        db('cctv_monitoring').count('* as count').first(),
      ]);

      // Extra stats
      const [cctvTotal, aplikasiAktif, menaraBykec] = await Promise.all([
        db('cctv_monitoring').sum('jumlah_titik as total').first(),
        db('aplikasi_website').where('status', 'Aktif').count('* as count').first(),
        db('menara_telekomunikasi')
          .select('kecamatan')
          .count('* as count')
          .groupBy('kecamatan')
          .orderBy('count', 'desc'),
      ]);

      return {
        totalMenara: parseInt(menara.count) || 0,
        totalBlankspot: parseInt(blankspot.count) || 0,
        totalAplikasi: parseInt(aplikasi.count) || 0,
        totalWifiPublik: parseInt(wifi.count) || 0,
        totalWebsiteDesa: parseInt(desa.count) || 0,
        totalWebsiteOpd: parseInt(opd.count) || 0,
        totalCctvLokasi: parseInt(cctv.count) || 0,
        totalCctvTitik: parseInt(cctvTotal?.total) || 0,
        aplikasiAktif: parseInt(aplikasiAktif.count) || 0,
        menaraPerKecamatan: menaraBykec.map((r) => ({
          kecamatan: r.kecamatan,
          count: parseInt(r.count),
        })),
      };
    } catch (err) {
      logger.error('Failed to get kominfo summary:', err.message);
      return null;
    }
  }

  // ─── Generic Create / Insert ─────────────────────────────────────────
  static async createItem(tableName, data) {
    try {
      const [inserted] = await db(tableName).insert(data).returning('*');
      return inserted;
    } catch (err) {
      logger.error(`Failed to insert into ${tableName}:`, err.message);
      throw err;
    }
  }

  // ─── Generic Delete ──────────────────────────────────────────────────
  static async deleteItem(tableName, id) {
    try {
      return await db(tableName).where('id', id).del();
    } catch (err) {
      logger.error(`Failed to delete from ${tableName}:`, err.message);
      throw err;
    }
  }
}
