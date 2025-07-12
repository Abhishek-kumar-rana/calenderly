import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from "./schema"

// initialize the neon client from databaseurl in .env file

const sql=neon(process.env.DATABASE_URL!);

//create and export the drizzle ORM instances with the neon client and schema for typesafe queries
export const db = drizzle(sql, {schema});