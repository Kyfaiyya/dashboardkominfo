import { KominfoModel } from './kominfo.model.js';

/**
 * Kominfo Controller - Request handlers for Kominfo monitoring data
 */

/** GET /api/kominfo/summary */
export async function getSummary(req, res, next) {
  try {
    const summary = await KominfoModel.getSummary();
    if (!summary) {
      return res.status(503).json({ error: 'Failed to retrieve kominfo summary' });
    }
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

/** GET /api/kominfo/menara */
export async function getMenara(req, res, next) {
  try {
    const { kecamatan, operator } = req.query;
    const data = await KominfoModel.getAllMenara({ kecamatan, operator });
    res.json({ count: data.length, data });
  } catch (err) {
    next(err);
  }
}

/** GET /api/kominfo/blankspot */
export async function getBlankspot(req, res, next) {
  try {
    const data = await KominfoModel.getAllBlankspot();
    res.json({ count: data.length, data });
  } catch (err) {
    next(err);
  }
}

/** GET /api/kominfo/aplikasi */
export async function getAplikasi(req, res, next) {
  try {
    const { jenis, status } = req.query;
    const data = await KominfoModel.getAllAplikasi({ jenis, status });
    res.json({ count: data.length, data });
  } catch (err) {
    next(err);
  }
}

/** GET /api/kominfo/wifi */
export async function getWifi(req, res, next) {
  try {
    const data = await KominfoModel.getAllWifiPublik();
    res.json({ count: data.length, data });
  } catch (err) {
    next(err);
  }
}

/** GET /api/kominfo/website-desa */
export async function getWebsiteDesa(req, res, next) {
  try {
    const { kecamatan } = req.query;
    const data = await KominfoModel.getAllWebsiteDesa({ kecamatan });
    res.json({ count: data.length, data });
  } catch (err) {
    next(err);
  }
}

/** GET /api/kominfo/website-opd */
export async function getWebsiteOpd(req, res, next) {
  try {
    const data = await KominfoModel.getAllWebsiteOpd();
    res.json({ count: data.length, data });
  } catch (err) {
    next(err);
  }
}

/** GET /api/kominfo/cctv */
export async function getCctv(req, res, next) {
  try {
    const { area } = req.query;
    const data = await KominfoModel.getAllCctv({ area });
    res.json({ count: data.length, data });
  } catch (err) {
    next(err);
  }
}

// ─── POST Creation Handlers ──────────────────────────────────────────────────

const ENTITY_TABLE_MAP = {
  menara: 'menara_telekomunikasi',
  aplikasi: 'aplikasi_website',
  cctv: 'cctv_monitoring',
  wifi: 'wifi_publik',
  blankspot: 'blankspot_area',
  'website-opd': 'website_opd',
  'website-desa': 'website_desa',
};

/** POST /api/kominfo/:entity */
export async function createItem(req, res, next) {
  try {
    const { entity } = req.params;
    const tableName = ENTITY_TABLE_MAP[entity];
    if (!tableName) {
      return res.status(400).json({ error: `Invalid entity type: ${entity}` });
    }

    const inserted = await KominfoModel.createItem(tableName, req.body);
    res.status(201).json({
      message: `Data ${entity} berhasil ditambahkan`,
      data: inserted,
    });
  } catch (err) {
    next(err);
  }
}

/** PUT /api/kominfo/:entity/:id */
export async function updateItem(req, res, next) {
  try {
    const { entity, id } = req.params;
    const tableName = ENTITY_TABLE_MAP[entity];
    if (!tableName) {
      return res.status(400).json({ error: `Invalid entity type: ${entity}` });
    }

    const updated = await KominfoModel.updateItem(tableName, id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({
      message: `Data ${entity} ID ${id} berhasil diperbarui`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/kominfo/:entity/:id */
export async function deleteItem(req, res, next) {
  try {
    const { entity, id } = req.params;
    const tableName = ENTITY_TABLE_MAP[entity];
    if (!tableName) {
      return res.status(400).json({ error: `Invalid entity type: ${entity}` });
    }

    const count = await KominfoModel.deleteItem(tableName, id);
    if (count === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: `Data ${entity} ID ${id} berhasil dihapus` });
  } catch (err) {
    next(err);
  }
}
