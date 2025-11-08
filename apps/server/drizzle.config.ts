import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv"

//load .env from root
dotenv.config({ path: "../../.env" }); 

console.log(process.env.DATABASE_URL)

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/index.ts",
  out: "./src/drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
