import { Router } from 'express';
import {
  getSummary,
  getMenara,
  getBlankspot,
  getAplikasi,
  getWifi,
  getWebsiteDesa,
  getWebsiteOpd,
  getCctv,
  createItem,
  updateItem,
  deleteItem,
} from './kominfo.controller.js';
import { requireAdminAuth } from '../auth/auth.controller.js';

const router = Router();

router.get('/kominfo/summary', getSummary);
router.get('/kominfo/menara', getMenara);
router.get('/kominfo/blankspot', getBlankspot);
router.get('/kominfo/aplikasi', getAplikasi);
router.get('/kominfo/wifi', getWifi);
router.get('/kominfo/website-desa', getWebsiteDesa);
router.get('/kominfo/website-opd', getWebsiteOpd);
router.get('/kominfo/cctv', getCctv);

// POST Create, PUT Update & DELETE Endpoints (Protected by Admin Auth)
router.post('/kominfo/:entity', requireAdminAuth, createItem);
router.put('/kominfo/:entity/:id', requireAdminAuth, updateItem);
router.delete('/kominfo/:entity/:id', requireAdminAuth, deleteItem);

export default router;
