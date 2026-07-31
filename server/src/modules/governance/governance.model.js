import db from '../../config/database.js';
import { logger } from '../../utils/logger.js';

const DEFAULT_PAGES = [
  { page_key: 'BKPSDM PPU', title: 'BKPSDM PPU', category: 'PERANGKAT DAERAH (OPD)', icon_name: 'Database', badge_label: 'Live', is_public: true, sort_order: 1 },
  { page_key: 'Diskominfo PPU', title: 'Diskominfo PPU', category: 'PERANGKAT DAERAH (OPD)', icon_name: 'Globe', badge_label: 'Ready', is_public: true, sort_order: 2 },
  { page_key: 'Bapenda PPU', title: 'Bapenda PPU', category: 'PERANGKAT DAERAH (OPD)', icon_name: 'Landmark', badge_label: 'Realtime', is_public: true, sort_order: 3 },
  { page_key: 'BPS PPU', title: 'BPS PPU', category: 'DATA & STATISTIK', icon_name: 'BarChart3', badge_label: 'Live', is_public: true, sort_order: 4 },
  { page_key: 'Disdukcapil PPU', title: 'Disdukcapil PPU', category: 'PERANGKAT DAERAH (OPD)', icon_name: 'Users', badge_label: 'Ready', is_public: true, sort_order: 5 },
  { page_key: 'BKAD PPU', title: 'BKAD PPU', category: 'PERANGKAT DAERAH (OPD)', icon_name: 'CreditCard', badge_label: 'Ready', is_public: true, sort_order: 6 },
  { page_key: 'DPMPTSP PPU', title: 'DPMPTSP PPU', category: 'PERANGKAT DAERAH (OPD)', icon_name: 'FileText', badge_label: 'Beta', is_public: true, sort_order: 7 },
  { page_key: 'Katalog Dokumentasi', title: 'Katalog Dokumentasi', category: 'DOKUMENTASI', icon_name: 'Terminal', badge_label: 'v1.0', is_public: true, sort_order: 8 },
];

const DEFAULT_TABS = [
  // Diskominfo PPU
  { page_key: 'Diskominfo PPU', tab_key: 'summary', title: 'Ringkasan & Peta Geografis', is_public: true, sort_order: 1 },
  { page_key: 'Diskominfo PPU', tab_key: 'menara', title: 'Menara BTS', is_public: true, sort_order: 2 },
  { page_key: 'Diskominfo PPU', tab_key: 'aplikasi', title: 'Aplikasi & Portal', is_public: true, sort_order: 3 },
  { page_key: 'Diskominfo PPU', tab_key: 'cctv', title: 'Titik CCTV', is_public: true, sort_order: 4 },
  { page_key: 'Diskominfo PPU', tab_key: 'wifi', title: 'WiFi Publik', is_public: true, sort_order: 5 },
  { page_key: 'Diskominfo PPU', tab_key: 'blankspot', title: 'Area Blankspot', is_public: true, sort_order: 6 },
  { page_key: 'Diskominfo PPU', tab_key: 'directory', title: 'Direktori Website', is_public: true, sort_order: 7 },
];

export class GovernanceModel {
  /** Ensure default tables are seeded */
  static async seedDefaults() {
    try {
      const pageCount = await db('dashboard_page_config').count('* as count').first();
      if (parseInt(pageCount.count) === 0) {
        logger.info('Seeding default dashboard page governance configs...');
        await db('dashboard_page_config').insert(DEFAULT_PAGES);
      }

      const tabCount = await db('dashboard_tab_config').count('* as count').first();
      if (parseInt(tabCount.count) === 0) {
        logger.info('Seeding default dashboard tab governance configs...');
        await db('dashboard_tab_config').insert(DEFAULT_TABS);
      }
    } catch (err) {
      logger.error('Failed to seed governance defaults:', err.message);
    }
  }

  /** Get all page and tab configs for Client Navigation & Admin Management */
  static async getNavigationConfig() {
    await this.seedDefaults();
    try {
      const pages = await db('dashboard_page_config').select('*').orderBy('sort_order', 'asc');
      const tabs = await db('dashboard_tab_config').select('*').orderBy('sort_order', 'asc');

      return { pages, tabs };
    } catch (err) {
      logger.error('Failed to query navigation config:', err.message);
      return { pages: DEFAULT_PAGES, tabs: DEFAULT_TABS };
    }
  }

  /** Update page visibility */
  static async updatePageVisibility(pageKey, isPublic, adminUsername = 'admin') {
    try {
      const existing = await db('dashboard_page_config').where('page_key', pageKey).first();
      if (!existing) return null;

      const oldValue = existing.is_public ? 'Publik' : 'Khusus Admin';
      const newValue = isPublic ? 'Publik' : 'Khusus Admin';

      const [updated] = await db('dashboard_page_config')
        .where('page_key', pageKey)
        .update({ is_public: isPublic, updated_at: db.fn.now() })
        .returning('*');

      // Record Audit Log
      await db('governance_audit_logs').insert({
        admin_username: adminUsername,
        action_type: 'UPDATE_PAGE_VISIBILITY',
        target_type: 'PAGE',
        target_key: pageKey,
        old_value: oldValue,
        new_value: newValue,
      });

      return updated;
    } catch (err) {
      logger.error(`Failed to update page ${pageKey} visibility:`, err.message);
      throw err;
    }
  }

  /** Update tab visibility */
  static async updateTabVisibility(pageKey, tabKey, isPublic, adminUsername = 'admin') {
    try {
      const existing = await db('dashboard_tab_config')
        .where({ page_key: pageKey, tab_key: tabKey })
        .first();

      let oldValue = 'Publik';
      let newValue = isPublic ? 'Publik' : 'Khusus Admin';

      if (existing) {
        oldValue = existing.is_public ? 'Publik' : 'Khusus Admin';
        await db('dashboard_tab_config')
          .where({ page_key: pageKey, tab_key: tabKey })
          .update({ is_public: isPublic, updated_at: db.fn.now() });
      } else {
        await db('dashboard_tab_config').insert({
          page_key: pageKey,
          tab_key: tabKey,
          title: tabKey,
          is_public: isPublic,
        });
      }

      // Record Audit Log
      await db('governance_audit_logs').insert({
        admin_username: adminUsername,
        action_type: 'UPDATE_TAB_VISIBILITY',
        target_type: 'TAB',
        target_key: `${pageKey} -> ${tabKey}`,
        old_value: oldValue,
        new_value: newValue,
      });

      return { page_key: pageKey, tab_key: tabKey, is_public: isPublic };
    } catch (err) {
      logger.error(`Failed to update tab ${pageKey}/${tabKey} visibility:`, err.message);
      throw err;
    }
  }

  /** Get audit trail logs */
  static async getAuditLogs(limit = 50) {
    try {
      return await db('governance_audit_logs')
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(limit);
    } catch (err) {
      logger.error('Failed to query governance audit logs:', err.message);
      return [];
    }
  }
}
