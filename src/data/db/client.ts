import * as SQLite from "expo-sqlite";

import { seedQuestionsIfEmpty } from "@/src/data/seed";

const databaseName = "yug.db";

type TableInfoRow = { name: string };

async function addColumnIfMissing(
  db: SQLite.SQLiteDatabase,
  table: string,
  column: string,
  definition: string,
) {
  const columns = await db.getAllAsync<TableInfoRow>(`PRAGMA table_info(${table})`);

  if (!columns.some((row) => row.name === column)) {
    await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

export async function openDatabase() {
  const db = await SQLite.openDatabaseAsync(databaseName);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY NOT NULL,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      color TEXT NOT NULL,
      value_type TEXT NOT NULL CHECK (value_type IN ('text', 'number', 'boolean', 'choice')),
      value_units TEXT NOT NULL DEFAULT '',
      repeat TEXT NOT NULL DEFAULT 'daily',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY NOT NULL,
      body TEXT NOT NULL,
      question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
      value TEXT,
      datetime TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

  `);

  // Keep ALTER TABLE migrations simple for Expo SQLite. SQLite has restrictions around
  // adding REFERENCES columns to existing tables, so the FK is only part of fresh schemas.
  await addColumnIfMissing(db, "entries", "question_id", "TEXT");
  await addColumnIfMissing(db, "entries", "value", "TEXT");
  await addColumnIfMissing(db, "entries", "datetime", "TEXT");

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_entries_datetime ON entries(datetime);
    CREATE INDEX IF NOT EXISTS idx_entries_question_datetime ON entries(question_id, datetime);
  `);

  await seedQuestionsIfEmpty(db);

  return db;
}
