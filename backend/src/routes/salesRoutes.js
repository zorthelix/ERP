import { Router } from 'express';
import { body, query } from 'express-validator';
import { createSale, getSales } from '../controllers/salesController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router(); router.use(requireAuth);
router.post('/', [body('items').isArray({ min: 1 }).withMessage('At least one sale item is required.'), body('items.*.productId').isInt({ min: 1 }).withMessage('Each item needs a valid product id.'), body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item quantity must be at least one.'), body('taxRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax rate must be between 0 and 100.'), body('paymentMethod').optional().isIn(['cash', 'card', 'transfer', 'other']).withMessage('Payment method is invalid.'), body('notes').optional({ nullable: true }).isString().isLength({ max: 1000 }).withMessage('Notes must be at most 1,000 characters.'), validate], createSale);
router.get('/', [query('limit').optional().isInt({ min: 1, max: 200 }).toInt(), validate], getSales);
export default router;

