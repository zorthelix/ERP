import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router(); const id = param('id').isInt({ min: 1 }).toInt().withMessage('Product id must be a positive integer.');
const productRules = [body('sku').optional().trim().isLength({ min: 2, max: 64 }).withMessage('SKU must be 2–64 characters.'), body('name').optional().trim().isLength({ min: 2, max: 160 }).withMessage('Name must be 2–160 characters.'), body('description').optional({ nullable: true }).isString().isLength({ max: 1000 }).withMessage('Description must be at most 1,000 characters.'), body('unitPrice').optional().isFloat({ min: 0 }).withMessage('Unit price must be zero or greater.'), body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a whole number of zero or greater.'), body('reorderLevel').optional().isInt({ min: 0 }).withMessage('Reorder level must be a whole number of zero or greater.'), body('isActive').optional().isBoolean().withMessage('isActive must be true or false.')];
router.use(requireAuth);
router.get('/', [query('search').optional().trim().isLength({ max: 160 }), query('active').optional().isBoolean(), validate], getProducts);
router.post('/', [body('sku').trim().isLength({ min: 2, max: 64 }), body('name').trim().isLength({ min: 2, max: 160 }), body('unitPrice').isFloat({ min: 0 }), body('quantity').isInt({ min: 0 }), ...productRules, validate], createProduct);
router.put('/:id', [id, ...productRules, validate], updateProduct);
router.delete('/:id', [id, validate], deleteProduct);
export default router;

