import { defineConfig } from 'drizzle-kit';
import { env } from '@/data/env/server';

export default defineConfig({
    out: './src/drizzle/migrations',
    schema: './src/drizzle/schema.ts',

    //** yeu cau xac nhan trong truong hop thay doi db */
    strict: true,
    verbose: true,
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DB_LINK,
        ssl: true,
    },
});
