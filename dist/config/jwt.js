"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenCookieOptions = exports.jwtConfig = void 0;
const env_1 = require("./env");
exports.jwtConfig = {
    access: {
        secret: env_1.config.jwt.accessSecret,
        expiresIn: env_1.config.jwt.accessExpiresIn,
    },
    refresh: {
        secret: env_1.config.jwt.refreshSecret,
        expiresIn: env_1.config.jwt.refreshExpiresIn,
    },
};
// Cookie options for refresh token
exports.refreshTokenCookieOptions = {
    httpOnly: true,
    secure: env_1.config.nodeEnv === 'production', // only over HTTPS in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};
//# sourceMappingURL=jwt.js.map