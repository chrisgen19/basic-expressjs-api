import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { refreshTokenCookieOptions } from '../config/jwt';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: RegisterInput = req.body;
      const result = await authService.register(data);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

      res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

      res.status(200).json({
        message: 'Login successful',
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Try to get refresh token from cookie or body
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ error: 'Refresh token required' });
        return;
      }

      const result = await authService.refresh(refreshToken);

      // Set new refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);

      res.status(200).json({
        message: 'Token refreshed successfully',
        accessToken: result.accessToken,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid refresh token') {
        res.status(401).json({ error: 'Invalid refresh token' });
        return;
      }
      next(error);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logout successful' });
  }
}

export const authController = new AuthController();
