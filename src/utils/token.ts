import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  // expiresIn from config is a string (e.g., '15m'), which SignOptions accepts
  return jwt.sign(payload, jwtConfig.access.secret, {
    expiresIn: jwtConfig.access.expiresIn as Exclude<SignOptions['expiresIn'], undefined>,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  // expiresIn from config is a string (e.g., '7d'), which SignOptions accepts
  return jwt.sign(payload, jwtConfig.refresh.secret, {
    expiresIn: jwtConfig.refresh.expiresIn as Exclude<SignOptions['expiresIn'], undefined>,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, jwtConfig.access.secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, jwtConfig.refresh.secret) as TokenPayload;
};
