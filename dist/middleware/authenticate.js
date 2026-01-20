"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../utils/token");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const token = authHeader.substring(7);
        const payload = (0, token_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ error: 'Token expired' });
                return;
            }
            if (error.name === 'JsonWebTokenError') {
                res.status(401).json({ error: 'Invalid token' });
                return;
            }
        }
        res.status(401).json({ error: 'Authentication failed' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.js.map