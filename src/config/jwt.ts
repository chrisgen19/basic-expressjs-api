import { config } from './env';

export const jwtConfig = {
  access: {
    secret: config.jwt.accessSecret,
    expiresIn: config.jwt.accessExpiresIn as string | number,
  },
  refresh: {
    secret: config.jwt.refreshSecret,
    expiresIn: config.jwt.refreshExpiresIn as string | number,
  },
};

// Cookie options for refresh token
export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === 'production', // only over HTTPS in production
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};
