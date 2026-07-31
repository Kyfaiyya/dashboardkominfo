import { Router } from 'express';
import {
  getNavigationConfig,
  updatePageVisibility,
  updateTabVisibility,
  getAuditLogs,
} from './governance.controller.js';
import { requireAdminAuth } from '../auth/auth.controller.js';

const router = Router();

// Public navigation config (returns pages and tabs configs)
router.get('/governance/navigation', getNavigationConfig);

// Protected Admin Endpoints
router.put('/governance/page/:key', requireAdminAuth, updatePageVisibility);
router.put('/governance/tab/:pageKey/:tabKey', requireAdminAuth, updateTabVisibility);
router.get('/governance/logs', requireAdminAuth, getAuditLogs);

export default router;
