"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    role: zod_1.z.enum(['user', 'admin']).default('user'),
});
exports.updateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').optional(),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    role: zod_1.z.enum(['user', 'admin']).optional(),
});
exports.searchUsersSchema = zod_1.z.object({
    q: zod_1.z.string().min(1, 'Search query is required').optional(),
    role: zod_1.z.enum(['user', 'admin']).optional(),
    page: zod_1.z.coerce.number().positive().default(1),
    limit: zod_1.z.coerce.number().positive().default(10),
});
//# sourceMappingURL=user.schema.js.map