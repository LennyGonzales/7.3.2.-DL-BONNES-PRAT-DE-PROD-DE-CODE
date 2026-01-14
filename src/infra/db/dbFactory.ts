import BetterSqlite3 from 'better-sqlite3';
import { mkdirp } from 'mkdirp';
import fs from 'fs';
import path from 'path';

export function createDatabase(dbPath: string): BetterSqlite3.Database {
  const dir = path.dirname(dbPath);
  mkdirp.sync(dir);

  const db = new BetterSqlite3(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS gps (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      latitude TEXT NOT NULL,
      longitude TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS health_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      heartrate INTEGER NOT NULL
    );
  `);

  return db;
}

export function cleanupDatabase(db: BetterSqlite3.Database) {
  db.close();
  const dbPath = (db as any).filePath;
  if (dbPath && fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
}
