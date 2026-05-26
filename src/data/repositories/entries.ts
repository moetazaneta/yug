import { openDatabase } from "@/src/data/db/client";
import { createId } from "@/src/data/id";

export type Entry = {
  id: string;
  questionId: string;
  value: string;
  datetime: string;
  createdAt: string;
  updatedAt: string;
};

type EntryRow = {
  id: string;
  question_id: string | null;
  value: string | null;
  datetime: string | null;
  created_at: string;
  updated_at: string;
};

function mapEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    questionId: row.question_id ?? "",
    value: row.value ?? "",
    datetime: row.datetime ?? row.created_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listEntries(): Promise<Entry[]> {
  const db = await openDatabase();
  const rows = await db.getAllAsync<EntryRow>(
    "SELECT * FROM entries WHERE question_id IS NOT NULL ORDER BY datetime DESC LIMIT 500",
  );

  return rows.map(mapEntry);
}

export async function listEntriesBetween(
  startIso: string,
  endIso: string,
): Promise<Entry[]> {
  const db = await openDatabase();
  const rows = await db.getAllAsync<EntryRow>(
    `SELECT * FROM entries
     WHERE question_id IS NOT NULL AND datetime >= ? AND datetime < ?
     ORDER BY datetime DESC`,
    startIso,
    endIso,
  );

  return rows.map(mapEntry);
}

export async function listEntriesToday(): Promise<Entry[]> {
  console.log("listEntriesToday");
  const db = await openDatabase();
  const rows = await db.getAllAsync<EntryRow>(
    "SELECT * FROM entries WHERE question_id IS NOT NULL AND datetime <= ? ORDER BY datetime DESC",
    new Date().toISOString(),
  );

  return rows.map(mapEntry);
}

export async function createOrUpdateEntry({
  questionId,
  value,
  datetime = new Date(),
}: {
  questionId: string;
  value: string | number | boolean;
  datetime?: Date;
}): Promise<Entry> {
  const db = await openDatabase();
  const now = new Date().toISOString();
  const entry: Entry = {
    id: createId("entry"),
    questionId,
    value: String(value),
    datetime: datetime.toISOString(),
    createdAt: now,
    updatedAt: now,
  };

  const res = await db.runAsync(
    `INSERT INTO entries (id, body, question_id, value, datetime, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    entry.id,
    entry.value,
    entry.questionId,
    entry.value,
    entry.datetime,
    entry.createdAt,
    entry.updatedAt,
  );

  console.log("res", res);

  return entry;
}

export async function createEntry({
  questionId,
  value,
  datetime = new Date(),
}: {
  questionId: string;
  value: string | number | boolean;
  datetime?: Date;
}): Promise<Entry> {
  console.log("createEntry", { questionId, value, datetime });
  const db = await openDatabase();
  const now = new Date().toISOString();
  const entry: Entry = {
    id: createId("entry"),
    questionId,
    value: String(value),
    datetime: datetime.toISOString(),
    createdAt: now,
    updatedAt: now,
  };

  const res = await db.runAsync(
    `INSERT INTO entries (id, body, question_id, value, datetime, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    entry.id,
    entry.value,
    entry.questionId,
    entry.value,
    entry.datetime,
    entry.createdAt,
    entry.updatedAt,
  );

  console.log("res", res);

  return entry;
}
