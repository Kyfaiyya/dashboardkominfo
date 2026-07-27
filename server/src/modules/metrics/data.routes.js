import { Router } from 'express';
import { getLatestData, getHistory, triggerPoll } from './data.controller.js';

const router = Router();

router.get('/data/latest', getLatestData);
router.get('/data/history/:metricType', getHistory);
router.all('/trigger', triggerPoll);

export default router;
