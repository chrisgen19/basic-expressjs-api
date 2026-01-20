import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { CreateUserInput, UpdateUserInput, SearchUsersInput } from '../schemas/user.schema';

export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateUserInput = req.body;
      const user = await userService.createUser(data);

      res.status(201).json({
        message: 'User created successfully',
        user,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        res.status(409).json({ error: 'User already exists' });
        return;
      }
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id)) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      const user = await userService.getUserById(id);

      res.status(200).json({ user });
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: SearchUsersInput = req.query as any;
      const result = await userService.getAllUsers(query);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id)) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      const data: UpdateUserInput = req.body;
      const user = await userService.updateUser(id, data);

      res.status(200).json({
        message: 'User updated successfully',
        user,
      });
    } catch (error) {
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

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id)) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      const result = await userService.deleteUser(id);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      next(error);
    }
  }
}

export const userController = new UserController();
