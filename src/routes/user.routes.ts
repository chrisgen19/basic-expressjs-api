import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate, validateQuery } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { apiLimiter } from '../middleware/rateLimiters';
import { createUserSchema, updateUserSchema, searchUsersSchema } from '../schemas/user.schema';

const router = Router();

// All user routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// GET /users - Get all users (protected, any authenticated user)
router.get('/', validateQuery(searchUsersSchema), (req, res, next) =>
  userController.getAllUsers(req, res, next)
);

// GET /users/:id - Get single user (protected, any authenticated user)
router.get('/:id', (req, res, next) => userController.getUser(req, res, next));

// POST /users - Create user (protected, admin only)
router.post('/', authorize('admin'), validate(createUserSchema), (req, res, next) =>
  userController.createUser(req, res, next)
);

// PATCH /users/:id - Update user (protected, admin only)
router.patch('/:id', authorize('admin'), validate(updateUserSchema), (req, res, next) =>
  userController.updateUser(req, res, next)
);

// DELETE /users/:id - Delete user (protected, admin only)
router.delete('/:id', authorize('admin'), (req, res, next) =>
  userController.deleteUser(req, res, next)
);

export default router;
