import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { seed } from "drizzle-seed";
import { relations } from "./relations";
import { questions } from "./schema/questions";
import { entries } from "./schema/entries";

const expo = openDatabaseSync("db.db");
export const db = drizzle(expo, { relations });

// seed(db, { questions, entries }, { count: 100 });

(async () => {
  seed(db, { questions, entries });
})();
