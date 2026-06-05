import { drizzle } from "drizzle-orm/sqlite-proxy";
import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";

import * as schema from "./schema";

export const databaseName = "yug.db";

let expoDatabasePromise: Promise<SQLiteDatabase> | null = null;

export const db = drizzle(
  async (sql, params, method) => {
    const database = await getExpoDatabaseAsync();

    if (method === "run") {
      await database.runAsync(sql, params);
      return { rows: [] };
    }

    if (method === "get") {
      const row = await database.getFirstAsync<Record<string, unknown>>(sql, params);
      return { rows: row ? Object.values(row) : [] };
    }

    const rows = await database.getAllAsync<Record<string, unknown>>(sql, params);
    return { rows: rows.map((row) => Object.values(row)) };
  },
  { schema },
);

type BundledMigrations = {
  journal: {
    entries: {
      breakpoints: boolean;
      tag: string;
      when: number;
    }[];
  };
  migrations: Record<string, string>;
};

type MigrationRow = {
  name: string | null;
};

export async function migrateDatabase(migrations: BundledMigrations) {
  const database = await getExpoDatabaseAsync();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS __drizzle_migrations (
      id INTEGER PRIMARY KEY,
      hash text NOT NULL,
      created_at numeric,
      name text,
      applied_at TEXT
    );
  `);

  const appliedRows = await database.getAllAsync<MigrationRow>(
    "SELECT name FROM __drizzle_migrations;",
  );
  const appliedMigrationNames = new Set(appliedRows.map((row) => row.name).filter(Boolean));

  await database.withTransactionAsync(async () => {
    for (const entry of migrations.journal.entries) {
      if (appliedMigrationNames.has(entry.tag)) {
        continue;
      }

      const query = migrations.migrations[entry.tag];
      if (!query) {
        throw new Error(`Missing migration: ${entry.tag}`);
      }

      for (const statement of query.split("--> statement-breakpoint")) {
        await database.execAsync(statement);
      }

      await database.runAsync(
        `INSERT INTO __drizzle_migrations ("hash", "created_at", "name", "applied_at")
         VALUES (?, ?, ?, ?);`,
        ["", entry.when, entry.tag, new Date().toISOString()],
      );
    }
  });

  await prepareQuestionLifecycleColumns(database);
}

async function getExpoDatabaseAsync() {
  expoDatabasePromise ??= openPreparedDatabaseAsync();
  return expoDatabasePromise;
}

async function openPreparedDatabaseAsync() {
  const database = await openDatabaseAsync(databaseName);
  await prepareLegacyRawSqlDatabase(database);
  await prepareQuestionLifecycleColumns(database);
  return database;
}

type TableInfoRow = {
  name: string;
};

async function prepareLegacyRawSqlDatabase(database: SQLiteDatabase) {
  const questionColumns = await getTableColumns(database, "questions");
  if (!questionColumns.has("value_type")) {
    return;
  }

  await database.execAsync(`
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

  const entryColumns = await getTableColumns(database, "entries");
  if (!entryColumns.has("question_id")) {
    return;
  }

  await database.execAsync(`
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

async function prepareQuestionLifecycleColumns(database: SQLiteDatabase) {
  const questionColumns = await getTableColumns(database, "questions");
  if (questionColumns.size === 0) {
    return;
  }

  if (!questionColumns.has("archivedAt")) {
    await database.execAsync("ALTER TABLE questions ADD COLUMN archivedAt text;");
  }

  if (!questionColumns.has("deletedAt")) {
    await database.execAsync("ALTER TABLE questions ADD COLUMN deletedAt text;");
  }

  if (!questionColumns.has("sortOrder")) {
    await database.execAsync("ALTER TABLE questions ADD COLUMN sortOrder integer NOT NULL DEFAULT 0;");
    await database.execAsync(`
      UPDATE questions
      SET sortOrder = (
        SELECT COUNT(*)
        FROM questions AS earlier
        WHERE earlier.createdAt < questions.createdAt
          OR (earlier.createdAt = questions.createdAt AND earlier.id <= questions.id)
      ) - 1;
    `);
  }
}

async function getTableColumns(database: SQLiteDatabase, tableName: string) {
  try {
    return new Set(
      (await database.getAllAsync<TableInfoRow>(`PRAGMA table_info(${tableName})`)).map(
        (column) => column.name,
      ),
    );
  } catch {
    return new Set<string>();
  }
}
