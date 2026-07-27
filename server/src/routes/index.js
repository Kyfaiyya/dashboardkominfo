import { Router } from 'express';
import healthRoutes from '../modules/health/health.routes.js';
import dataRoutes from '../modules/metrics/data.routes.js';
import mockRoutes from '../modules/mock/mock.routes.js';
import kominfoRoutes from '../modules/diskominfo/kominfo.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/api', dataRoutes);
router.use('/api', kominfoRoutes);
router.use('/api', authRoutes);
router.use('/mock-api', mockRoutes);

export default router;
