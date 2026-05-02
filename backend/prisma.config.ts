import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

const envCandidates = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), 'backend', '.env'),
];
for (const p of envCandidates) {
  if (existsSync(p)) {
    loadEnv({ path: p });
    break;
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx ts-node --project tsconfig.json prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
