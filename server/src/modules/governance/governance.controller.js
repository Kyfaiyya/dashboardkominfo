import { GovernanceModel } from './governance.model.js';

/** GET /api/governance/navigation */
export async function getNavigationConfig(req, res, next) {
  try {
    const config = await GovernanceModel.getNavigationConfig();
    res.json(config);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/governance/page/:key */
export async function updatePageVisibility(req, res, next) {
  try {
    const { key } = req.params;
    const { is_public } = req.body;
    const adminUsername = req.user?.username || 'admin';

    if (typeof is_public !== 'boolean') {
      return res.status(400).json({ error: 'is_public boolean field is required' });
    }

    const updated = await GovernanceModel.updatePageVisibility(key, is_public, adminUsername);
    if (!updated) {
      return res.status(404).json({ error: `Page config '${key}' not found` });
    }

    res.json({
      message: `Status visibilitas halaman '${key}' berhasil diperbarui menjadi ${is_public ? 'Publik' : 'Khusus Admin'}`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

/** PUT /api/governance/tab/:pageKey/:tabKey */
export async function updateTabVisibility(req, res, next) {
  try {
    const { pageKey, tabKey } = req.params;
    const { is_public } = req.body;
    const adminUsername = req.user?.username || 'admin';

    if (typeof is_public !== 'boolean') {
      return res.status(400).json({ error: 'is_public boolean field is required' });
    }

    const updated = await GovernanceModel.updateTabVisibility(pageKey, tabKey, is_public, adminUsername);

    res.json({
      message: `Status visibilitas tab '${tabKey}' (${pageKey}) berhasil diperbarui menjadi ${is_public ? 'Publik' : 'Khusus Admin'}`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/governance/logs */
export async function getAuditLogs(req, res, next) {
  try {
    const logs = await GovernanceModel.getAuditLogs(100);
    res.json({ count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
}
