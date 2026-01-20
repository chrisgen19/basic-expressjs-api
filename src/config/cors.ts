import cors from 'cors';
import { config } from './env';

export const corsConfig = cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  optionsSuccessStatus: 200,
});
