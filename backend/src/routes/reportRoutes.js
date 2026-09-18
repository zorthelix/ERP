import { Router } from 'express';
import { query } from 'express-validator';
import { inventoryReport, salesReport } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router(); router.use(requireAuth);
router.get('/inventory', inventoryReport);
router.get('/sales', [query('from').optional().isISO8601(), query('to').optional().isISO8601(), validate], salesReport);
export default router;

