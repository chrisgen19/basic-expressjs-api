"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.access.secret, {
        expiresIn: jwt_1.jwtConfig.access.expiresIn,
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.refresh.secret, {
        expiresIn: jwt_1.jwtConfig.refresh.expiresIn,
    });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.access.secret);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.refresh.secret);
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=token.js.map