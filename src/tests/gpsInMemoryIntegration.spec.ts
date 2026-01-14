import { inMemoryGpsRepo } from '../adapters/driven/inMemoryGpsRepo';
import { GpsService } from '../services/gpsService';
import { gpsIntegrationTests } from './gpsIntegrationTests';

gpsIntegrationTests('GpsInMemoryIntegration', () => {
  const repo = new inMemoryGpsRepo();
  const service = new GpsService(repo);

  return { service };
});
