import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/entities/question/schema.ts", "./src/entities/entry/schema.ts"],
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo", // <--- very important
});
