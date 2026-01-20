import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authLimiter, refreshLimiter } from '../middleware/rateLimiters';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/auth.schema';

const router = Router();

// Public routes (with rate limiting)
router.post('/register', authLimiter, validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', authLimiter, validate(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

// Public route for token refresh (with validation and rate limiting)
router.post('/refresh', refreshLimiter, validate(refreshTokenSchema), (req, res, next) =>
  authController.refresh(req, res, next)
);

// Protected route for logout
router.post('/logout', authenticate, (req, res) => authController.logout(req, res));

export default router;
