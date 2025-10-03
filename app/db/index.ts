import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { neon, Pool } from "@neondatabase/serverless";

import * as schema from "./schema";

const DATABASE_URL =
  "postgresql://neondb_owner:npg_udkNYfx5H9gQ@ep-empty-salad-adppt9cs-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const db = process.env.VERCEL
  ? drizzleNeon({
      client: neon(DATABASE_URL!),
      schema,
      casing: "snake_case",
    })
  : drizzlePostgres(
      new Pool({
        connectionString: DATABASE_URL!,
      }),
      {
        schema,
        casing: "snake_case",
      }
    );
