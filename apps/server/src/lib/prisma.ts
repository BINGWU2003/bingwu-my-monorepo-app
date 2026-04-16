import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/index';

const isDev = config.nodeEnv === 'development';
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL. Please set it before starting the server.');
}

const prismaOptions: ConstructorParameters<typeof PrismaClient>[0] = {
  log: [...(isDev && process.env.LOG_SQL === 'true' ? (['query'] as const) : []), 'warn', 'error'],
};

if (process.env.PRISMA_ACCELERATE_URL) {
  prismaOptions.accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
} else {
  prismaOptions.adapter = new PrismaMariaDb(databaseUrl);
}

const prisma = new PrismaClient(prismaOptions);

export default prisma;
