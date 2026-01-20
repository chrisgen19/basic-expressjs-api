"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const validate_1 = require("../middleware/validate");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const rateLimiters_1 = require("../middleware/rateLimiters");
const user_schema_1 = require("../schemas/user.schema");
const router = (0, express_1.Router)();
// All user routes require authentication
router.use(authenticate_1.authenticate);
router.use(rateLimiters_1.apiLimiter);
// GET /users - Get all users (protected, any authenticated user)
router.get('/', (0, validate_1.validate)(user_schema_1.searchUsersSchema), (req, res, next) => user_controller_1.userController.getAllUsers(req, res, next));
// GET /users/:id - Get single user (protected, any authenticated user)
router.get('/:id', (req, res, next) => user_controller_1.userController.getUser(req, res, next));
// POST /users - Create user (protected, admin only)
router.post('/', (0, authorize_1.authorize)('admin'), (0, validate_1.validate)(user_schema_1.createUserSchema), (req, res, next) => user_controller_1.userController.createUser(req, res, next));
// PATCH /users/:id - Update user (protected, admin only)
router.patch('/:id', (0, authorize_1.authorize)('admin'), (0, validate_1.validate)(user_schema_1.updateUserSchema), (req, res, next) => user_controller_1.userController.updateUser(req, res, next));
// DELETE /users/:id - Delete user (protected, admin only)
router.delete('/:id', (0, authorize_1.authorize)('admin'), (req, res, next) => user_controller_1.userController.deleteUser(req, res, next));
exports.default = router;
//# sourceMappingURL=user.routes.js.map