import { config as loadDotenv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'prisma/config';

const baseDir = dirname(fileURLToPath(import.meta.url));
loadDotenv({ path: resolve(baseDir, 'env/.env') });
loadDotenv({ path: resolve(baseDir, '.env') });

const isGenerateCommand = process.argv.includes('generate');
const databaseUrl =
  process.env.DATABASE_URL ??
  (isGenerateCommand ? 'mysql://placeholder:placeholder@127.0.0.1:3306/placeholder' : undefined);

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL. Set it before running Prisma migrate/deploy commands.');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});
