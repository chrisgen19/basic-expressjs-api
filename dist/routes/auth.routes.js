"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_1 = require("../middleware/validate");
const authenticate_1 = require("../middleware/authenticate");
const rateLimiters_1 = require("../middleware/rateLimiters");
const auth_schema_1 = require("../schemas/auth.schema");
const router = (0, express_1.Router)();
// Public routes (with rate limiting)
router.post('/register', rateLimiters_1.authLimiter, (0, validate_1.validate)(auth_schema_1.registerSchema), (req, res, next) => auth_controller_1.authController.register(req, res, next));
router.post('/login', rateLimiters_1.authLimiter, (0, validate_1.validate)(auth_schema_1.loginSchema), (req, res, next) => auth_controller_1.authController.login(req, res, next));
// Public route for token refresh (with validation and rate limiting)
router.post('/refresh', rateLimiters_1.refreshLimiter, (0, validate_1.validate)(auth_schema_1.refreshTokenSchema), (req, res, next) => auth_controller_1.authController.refresh(req, res, next));
// Protected route for logout
router.post('/logout', authenticate_1.authenticate, (req, res) => auth_controller_1.authController.logout(req, res));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map