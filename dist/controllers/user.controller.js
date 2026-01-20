"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    async createUser(req, res, next) {
        try {
            const data = req.body;
            const user = await user_service_1.userService.createUser(data);
            res.status(201).json({
                message: 'User created successfully',
                user,
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'User already exists') {
                res.status(409).json({ error: 'User already exists' });
                return;
            }
            next(error);
        }
    }
    async getUser(req, res, next) {
        try {
            const id = req.params.id;
            if (!id || Array.isArray(id)) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            const user = await user_service_1.userService.getUserById(id);
            res.status(200).json({ user });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'User not found') {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            next(error);
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const query = req.query;
            const result = await user_service_1.userService.getAllUsers(query);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            const id = req.params.id;
            if (!id || Array.isArray(id)) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            const data = req.body;
            const user = await user_service_1.userService.updateUser(id, data);
            res.status(200).json({
                message: 'User updated successfully',
                user,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'User not found') {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                if (error.message === 'Email already in use') {
                    res.status(409).json({ error: 'Email already in use' });
                    return;
                }
            }
            next(error);
        }
    }
    async deleteUser(req, res, next) {
        try {
            const id = req.params.id;
            if (!id || Array.isArray(id)) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            const result = await user_service_1.userService.deleteUser(id);
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'User not found') {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            next(error);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map