import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const nodeEnv = process.env.NODE_ENV || 'development';
const envDir = resolve(__dirname, '../../env');

// 仿 Vite 模式：先加载基础 .env，再用模式文件覆盖
dotenvConfig({ path: resolve(envDir, '.env') });
dotenvConfig({ path: resolve(envDir, `.env.${nodeEnv}`), override: true });

export const config = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv,
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change_me_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  cors: {
    origins: (process.env.CORS_ORIGINS ?? 'http://localhost:8848,http://localhost:3002').split(','),
  },
} as const;
