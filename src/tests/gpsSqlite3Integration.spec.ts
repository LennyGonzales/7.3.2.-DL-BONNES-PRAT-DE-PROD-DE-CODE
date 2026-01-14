import { Sqlite3GpsRepo } from '../adapters/driven/sqlite3GpsRepo';
import { GpsService } from '../services/gpsService';
import { createTestDb } from '../infra/db/dbTest';
import { cleanupDatabase } from '../infra/db/dbFactory';
import { gpsIntegrationTests } from './gpsIntegrationTests';

gpsIntegrationTests('GpsSqlite3Integration', () => {
  const db = createTestDb();
  const repo = new Sqlite3GpsRepo(db);
  const service = new GpsService(repo);

  return {
    service,
    cleanup: () => cleanupDatabase(db),
  };
});
