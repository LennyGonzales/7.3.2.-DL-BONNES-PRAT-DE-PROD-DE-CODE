import { inMemoryHealthRecordRepo } from '../adapters/driven/inMemoryHealthRecordRepo';
import { HealthRecordService } from '../services/healthRecordService';
import { healthRecordIntegrationTests } from './healthRecordIntegrationTests';

healthRecordIntegrationTests('HealthRecordInMemoryIntegration', () => {
  const repo = new inMemoryHealthRecordRepo();
  const service = new HealthRecordService(repo);

  return { service };
});
