import { env } from '@/data/env/server';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/drizzle/schema';

const pool = new Pool({ connectionString: env.DB_LINK });

export const database = drizzle(pool, { schema });
