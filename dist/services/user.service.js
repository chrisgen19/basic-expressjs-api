"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const user_repo_1 = require("../repositories/user.repo");
const password_1 = require("../utils/password");
class UserService {
    async createUser(data) {
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
            role: data.role,
        });
        // Return user without password
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async getUserById(id) {
        const user = await user_repo_1.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        // Return user without password
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async getAllUsers(query) {
        const skip = (query.page - 1) * query.limit;
        const take = query.limit;
        const where = {};
        if (query.role) {
            where.role = query.role;
        }
        if (query.q) {
            where.OR = [
                { email: { contains: query.q, mode: 'insensitive' } },
                { name: { contains: query.q, mode: 'insensitive' } },
            ];
        }
        const { users, total } = await user_repo_1.userRepository.findAll({
            skip,
            take,
            where: Object.keys(where).length > 0 ? where : undefined,
        });
        return {
            users: users.map((user) => ({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            })),
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / query.limit),
            },
        };
    }
    async updateUser(id, data) {
        // Check if user exists
        const existingUser = await user_repo_1.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        // If email is being updated, check if it's already taken
        if (data.email && data.email !== existingUser.email) {
            const emailExists = await user_repo_1.userRepository.exists(data.email);
            if (emailExists) {
                throw new Error('Email already in use');
            }
        }
        // Update user - filter out undefined values
        const updateData = {};
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.role !== undefined)
            updateData.role = data.role;
        const user = await user_repo_1.userRepository.update(id, updateData);
        // Return user without password
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async deleteUser(id) {
        // Check if user exists
        const existingUser = await user_repo_1.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        await user_repo_1.userRepository.delete(id);
        return { message: 'User deleted successfully' };
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map