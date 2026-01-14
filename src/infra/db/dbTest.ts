import { createDatabase, cleanupDatabase } from './dbFactory';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export function createTestDb() {
  const dbPath = path.join('./data/test', `test-${uuidv4()}.db`);
  const db = createDatabase(dbPath);

  (db as any).filePath = dbPath;

  return db;
}