import { config as loadDotenv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, env } from 'prisma/config';

const baseDir = dirname(fileURLToPath(import.meta.url));
loadDotenv({ path: resolve(baseDir, 'env/.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
