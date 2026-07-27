import db from '../../config/database.js';
import config from '../../config/env.js';
import { logger } from '../../utils/logger.js';

/**
 * Pegawai Model - Handles Pegawai ASN database storage & API Audit Logging
 */
export class PegawaiModel {
  /**
   * Upsert Pegawai ASN records into PostgreSQL
   */
  static async upsertPegawaiRecords(pegawaiList = [], timestamp = new Date()) {
    if (!Array.isArray(pegawaiList) || pegawaiList.length === 0) return;

    for (const p of pegawaiList) {
      if (!p.nip) continue;
      await db('pegawai_records')
        .insert({
          nip: p.nip,
          nama: p.nama,
          jabatan: p.jabatan || '',
          unit_kerja: p.unitKerja || '',
          golongan: p.gol || '',
          status: p.status || 'Aktif',
          data_json: JSON.stringify(p),
          updated_at: timestamp,
        })
        .onConflict('nip')
        .merge({
          nama: p.nama,
          jabatan: p.jabatan || '',
          unit_kerja: p.unitKerja || '',
          golongan: p.gol || '',
          status: p.status || 'Aktif',
          data_json: JSON.stringify(p),
          updated_at: timestamp,
        });
    }
    logger.info(`✅ Upserted ${pegawaiList.length} pegawai records in database`);
  }

  /**
   * Log API fetch events into PostgreSQL audit log
   */
  static async logApiFetch(recordCount = 0, rawPayload = {}, timestamp = new Date()) {
    await db('api_fetch_logs').insert({
      time: timestamp,
      source: config.useMockApi ? 'Adapter (Mock/Config Data)' : config.externalApi.url,
      status: 'SUCCESS',
      record_count: recordCount,
      raw_payload: JSON.stringify(rawPayload),
    });
    logger.info('✅ Saved API fetch audit log in database');
  }

  /**
   * Search or query pegawai by NIP or keyword
   */
  static async findByNip(nip) {
    try {
      const record = await db('pegawai_records').where({ nip }).first();
      return record ? JSON.parse(record.data_json) : null;
    } catch (err) {
      logger.error(`Failed to fetch pegawai by NIP ${nip}:`, err.message);
      return null;
    }
  }
}
