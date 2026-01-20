"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const user_repo_1 = require("../repositories/user.repo");
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
class AuthService {
    async register(data) {
        // Check if user already exists
        const existingUser = await user_repo_1.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        // Hash password
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        // Create user
        const user = await user_repo_1.userRepository.create({
            email: data.email,
            password: hashedPassword,
            ...(data.name !== undefined && { name: data.name }),
        });
        // Generate tokens
        const accessToken = (0, token_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, token_1.generateRefreshToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }
    async login(data) {
        // Find user
        const user = await user_repo_1.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // Verify password
        const isPasswordValid = await (0, password_1.comparePassword)(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Generate tokens
        const accessToken = (0, token_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, token_1.generateRefreshToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }
    async refresh(refreshToken) {
        try {
            // Verify refresh token
            const payload = (0, token_1.verifyRefreshToken)(refreshToken);
            // Check if user still exists
            const user = await user_repo_1.userRepository.findById(payload.userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Generate new tokens
            const newAccessToken = (0, token_1.generateAccessToken)({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            const newRefreshToken = (0, token_1.generateRefreshToken)({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map