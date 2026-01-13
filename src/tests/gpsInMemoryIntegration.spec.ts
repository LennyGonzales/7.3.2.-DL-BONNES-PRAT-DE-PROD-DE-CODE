import { inMemoryGpsRepo } from '../adapters/driven/inMemoryGpsRepo';
import { Gps } from '../domain/gps';
import { GpsService } from '../services/gpsService';

describe('GpsInMemoryIntegration', () => {
  let repo: inMemoryGpsRepo;
  let service: GpsService;

  beforeEach(() => {
    repo = new inMemoryGpsRepo();
    service = new GpsService(repo);
  });

  it('addGps et verification avec listGpsByUserId', async () => {
    const sample = [
      new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25T17:45:30.005Z', '43.6728315', '32.3326411'),
      new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-10-25T15:45:30.005Z', '21.6328315', '42.3426411'),
      new Gps('b3cdc353-1ec6-4332-bd16-262bb9aaa269', '2015-09-25T17:45:30.005Z', '56.6728315', '32.3986411'),
    ];

    for (const gps of sample) {
      await service.createGps(gps);
    }

    const result = await service.listGpsByUserId(
      'ae5a7d56-5ade-42b7-a2c5-284512da3a60'
    );

    expect(result).toHaveLength(2);
    expect(result.map(g => g.latitude)).toEqual(['43.6728315', '21.6328315']);
  });

  it('addGps et verification avec getGps', async () => {
    const sample = new Gps(
      'ae5a7d56-5ade-42b7-a2c5-284512da3a60',
      '1985-09-25T17:45:30.005Z',
      '43.6728315',
      '32.3326411'
    );

    const created = await service.createGps(sample);
    const found = await service.getGps(created.id!);

    expect(found).toBeDefined();
    expect(found!.id).toBe(created.id);
    expect(found!.latitude).toBe(sample.latitude);
    expect(found!.longitude).toBe(sample.longitude);
    expect(found!.user_id).toBe(sample.user_id);
  });

  it('updateGps modifie un gps existant et verification avec getGps', async () => {
    const sample = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25T17:45:30.005Z', '43.6728315', '32.3326411');
    const created = await service.createGps(sample);
    const updates: Partial<Omit<Gps, 'id'>> = {
      timestamp: '1985-10-25T17:45:30.005Z',
      latitude: '45.6728315',
      longitude: '76.876798',
    };

    const updatedGps = await service.updateGps(created.id!, updates);

    expect(updatedGps).toBeDefined();
    expect(updatedGps!.id).toBe(created.id);
    expect(updatedGps!.timestamp).toBe(updates.timestamp);
    expect(updatedGps!.latitude).toBe(updates.latitude);
    expect(updatedGps!.longitude).toBe(updates.longitude);

    const found = await service.getGps(created.id!);

    expect(found).toBeDefined();
    expect(found!.id).toBe(created.id);
    expect(found!.timestamp).toBe(updates.timestamp);
    expect(found!.latitude).toBe(updates.latitude);
    expect(found!.longitude).toBe(updates.longitude);
  });
});

