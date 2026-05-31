import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";

import * as schema from "./schema";

export const databaseName = "yug.db";

const expo = openDatabaseSync(databaseName);
prepareLegacyRawSqlDatabase(expo);

export const db = drizzle(expo, { schema });

type TableInfoRow = {
  name: string;
};

function prepareLegacyRawSqlDatabase(database: SQLiteDatabase) {
  const questionColumns = getTableColumns(database, "questions");
  if (!questionColumns.has("value_type")) {
    return;
  }

  database.execSync(`
    ALTER TABLE questions RENAME TO questions_legacy_raw;
    CREATE TABLE questions (
      id text PRIMARY KEY,
      icon text NOT NULL,
      title text NOT NULL,
      description text DEFAULT '' NOT NULL,
      color text NOT NULL,
      valueType text NOT NULL,
      valueUnits text DEFAULT '' NOT NULL,
      repeat text DEFAULT 'daily' NOT NULL,
      createdAt text DEFAULT (current_timestamp) NOT NULL,
      updatedAt text DEFAULT (current_timestamp) NOT NULL
    );
    INSERT INTO questions (
      id, icon, title, description, color, valueType, valueUnits, repeat, createdAt, updatedAt
    )
    SELECT
      id,
      icon,
      title,
      COALESCE(description, ''),
      color,
      value_type,
      COALESCE(value_units, ''),
      COALESCE(repeat, 'daily'),
      created_at,
      updated_at
    FROM questions_legacy_raw;
    DROP TABLE questions_legacy_raw;
  `);

  const entryColumns = getTableColumns(database, "entries");
  if (!entryColumns.has("question_id")) {
    return;
  }

  database.execSync(`
    ALTER TABLE entries RENAME TO entries_legacy_raw;
    CREATE TABLE entries (
      id text PRIMARY KEY,
      questionId text NOT NULL,
      value text NOT NULL,
      datetime text DEFAULT (current_timestamp) NOT NULL,
      createdAt text DEFAULT (current_timestamp) NOT NULL,
      updatedAt text DEFAULT (current_timestamp) NOT NULL
    );
    INSERT INTO entries (id, questionId, value, datetime, createdAt, updatedAt)
    SELECT
      id,
      question_id,
      COALESCE(value, body, ''),
      COALESCE(datetime, created_at),
      created_at,
      updated_at
    FROM entries_legacy_raw
    WHERE question_id IS NOT NULL;
    DROP TABLE entries_legacy_raw;
  `);
}

function getTableColumns(database: SQLiteDatabase, tableName: string) {
  try {
    return new Set(
      database
        .getAllSync<TableInfoRow>(`PRAGMA table_info(${tableName})`)
        .map((column) => column.name),
    );
  } catch {
    return new Set<string>();
  }
}
