import { Router } from 'express';
import { getMockData } from './mock.controller.js';

const router = Router();

router.get('/', getMockData);

export default router;
