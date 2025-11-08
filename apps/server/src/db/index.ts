import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../../env";

import * as appSchema from "./schema";
import * as authSchema from "./auth-schema";

export * from "./schema";
export * from "./auth-schema";

export const schema = {
  ...appSchema,
  ...authSchema,
};

const pool = mysql.createPool({
  uri: env.DATABASE_URL,
});

export const db = drizzle(pool);
