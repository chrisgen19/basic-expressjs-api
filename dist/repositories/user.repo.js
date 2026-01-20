"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class UserRepository {
    async create(data) {
        return database_1.default.user.create({
            data: {
                email: data.email,
                password: data.password,
                ...(data.name !== undefined && { name: data.name }),
                role: data.role || 'user',
            },
        });
    }
    async findByEmail(email) {
        return database_1.default.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return database_1.default.user.findUnique({
            where: { id },
        });
    }
    async findAll(options) {
        const whereClause = options?.where || {};
        const [users, total] = await Promise.all([
            database_1.default.user.findMany({
                ...(options?.skip !== undefined && { skip: options.skip }),
                ...(options?.take !== undefined && { take: options.take }),
                where: whereClause,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    password: false, // Exclude password
                },
            }),
            database_1.default.user.count({ where: whereClause }),
        ]);
        return { users: users, total };
    }
    async update(id, data) {
        return database_1.default.user.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return database_1.default.user.delete({
            where: { id },
        });
    }
    async exists(email) {
        const count = await database_1.default.user.count({
            where: { email },
        });
        return count > 0;
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
//# sourceMappingURL=user.repo.js.map