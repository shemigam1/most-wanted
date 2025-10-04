import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { neon, Pool } from "@neondatabase/serverless";
import "../config";

import * as schema from "./schema";

// export const db = process.env.VERCEL
//   ? drizzleNeon({
//       client: neon(process.env.DATABASE_URL!),
//       schema,
//       casing: "snake_case",
//     })
//   : drizzlePostgres(
//       new Pool({
//         connectionString: process.env.DATABASE_URL!,
//       }),
//       {
//         schema,
//         casing: "snake_case",
//       }
//     );

const DATABASE_URL =
  "postgresql://neondb_owner:npg_udkNYfx5H9gQ@ep-empty-salad-adppt9cs-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
export const db = drizzlePostgres(
  new Pool({
    connectionString: process.env.DATABASE_URL!,
  }),
  {
    schema,
    casing: "snake_case",
  }
);
