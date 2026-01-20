"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./env");
// CORS configuration
// Note: Browsers reject credentials: true with origin: "*"
// Either set specific origins OR disable credentials when using "*"
exports.corsConfig = (0, cors_1.default)({
    origin: env_1.config.cors.origin === '*' ? '*' : env_1.config.cors.origin.split(',').map((o) => o.trim()),
    credentials: env_1.config.cors.origin === '*' ? false : env_1.config.cors.credentials,
    optionsSuccessStatus: 200,
});
//# sourceMappingURL=cors.js.map