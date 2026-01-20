import cors from 'cors';
import { config } from './env';

// CORS configuration
// Note: Browsers reject credentials: true with origin: "*"
// Either set specific origins OR disable credentials when using "*"
export const corsConfig = cors({
  origin: config.cors.origin === '*' ? '*' : config.cors.origin.split(',').map((o) => o.trim()),
  credentials: config.cors.origin === '*' ? false : config.cors.credentials,
  optionsSuccessStatus: 200,
});
