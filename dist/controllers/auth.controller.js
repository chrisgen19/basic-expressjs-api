"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const jwt_1 = require("../config/jwt");
class AuthController {
    async register(req, res, next) {
        try {
            const data = req.body;
            const result = await auth_service_1.authService.register(data);
            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', result.refreshToken, jwt_1.refreshTokenCookieOptions);
            res.status(201).json({
                message: 'User registered successfully',
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const data = req.body;
            const result = await auth_service_1.authService.login(data);
            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', result.refreshToken, jwt_1.refreshTokenCookieOptions);
            res.status(200).json({
                message: 'Login successful',
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Invalid credentials') {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            // Try to get refresh token from cookie or body
            const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ error: 'Refresh token required' });
                return;
            }
            const result = await auth_service_1.authService.refresh(refreshToken);
            // Set new refresh token in HTTP-only cookie
            res.cookie('refreshToken', result.refreshToken, jwt_1.refreshTokenCookieOptions);
            res.status(200).json({
                message: 'Token refreshed successfully',
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Invalid refresh token') {
                res.status(401).json({ error: 'Invalid refresh token' });
                return;
            }
            next(error);
        }
    }
    async logout(_req, res) {
        // Clear refresh token cookie with same options used to set it
        res.clearCookie('refreshToken', {
            httpOnly: jwt_1.refreshTokenCookieOptions.httpOnly,
            secure: jwt_1.refreshTokenCookieOptions.secure,
            sameSite: jwt_1.refreshTokenCookieOptions.sameSite,
            path: '/', // Must match the path used when setting the cookie
        });
        res.status(200).json({ message: 'Logout successful' });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map