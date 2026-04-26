import { join } from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: `file:${join(process.cwd(), "dev.db")}`,
  },
  migrations: {
    path: "prisma/migrations",
  },
});
