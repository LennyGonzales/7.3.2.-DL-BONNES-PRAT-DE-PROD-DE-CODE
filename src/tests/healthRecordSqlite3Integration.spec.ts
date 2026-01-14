import { Sqlite3HealthRecordRepo } from '../adapters/driven/sqlite3HealthRecordRepo';
import { cleanupDatabase } from '../infra/db/dbFactory';
import { createTestDb } from '../infra/db/dbTest';
import { HealthRecordService } from '../services/healthRecordService';
import { healthRecordIntegrationTests } from './healthRecordIntegrationTests';

healthRecordIntegrationTests('HealthRecordSqlite3Integration', () => {
  const db = createTestDb();
  const repo = new Sqlite3HealthRecordRepo(db);
  const service = new HealthRecordService(repo);

  return {
    service,
    cleanup: () => cleanupDatabase(db),
  };
});
