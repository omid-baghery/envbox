import { defineConfig } from "drizzle-kit";

// satisfies Config = defineConfig but type safe
export default defineConfig({
  schema: "./src/shared/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}); // no need for (satisfies Config)
