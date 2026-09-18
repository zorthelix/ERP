import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router(); const email = body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(); const password = body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters.');
router.post('/register', [body('fullName').trim().isLength({ min: 2, max: 120 }).withMessage('Full name must be 2–120 characters.'), email, password, validate], register);
router.post('/login', [email, body('password').isString().notEmpty().withMessage('Password is required.'), validate], login);
export default router;

