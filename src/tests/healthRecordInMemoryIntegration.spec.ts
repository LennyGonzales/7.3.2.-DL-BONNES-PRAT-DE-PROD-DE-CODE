import { inMemoryHealthRecordRepo } from '../adapters/driven/inMemoryHealthRecordRepo';
import { HealthRecord } from '../domain/healthRecord';
import { HealthRecordService } from '../services/healthRecordService';

describe('HealthRecordInMemoryIntegration', () => {
  let repo: inMemoryHealthRecordRepo;
  let service: HealthRecordService;

  beforeEach(() => {
    repo = new inMemoryHealthRecordRepo();
    service = new HealthRecordService(repo);
  });

  it('addHealthRecord et verification avec listHealthRecordByUserId', async () => {
    const sample = [
      new HealthRecord('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-01T10:00:00Z', 72),
      new HealthRecord('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-02T10:00:00Z', 75),
    ];

    for (const record of sample) {
      await service.createHealthRecord(record);
    }

    const result = await service.listHealthRecordsByUserId(
      '3f8fc01f-3847-4a1e-a5f9-aa4699a15eab'
    );

    expect(result).toHaveLength(2);
    expect(result.map(r => r.heartbeat)).toEqual([72, 75]);
  });

  it('addHealthRecord et verification avec getHealthRecord', async () => {
    const sample = new HealthRecord(
      '3f8fc01f-3847-4a1e-a5f9-aa4699a15eab',
      '2024-01-01T10:00:00Z',
      72
    );

    const created = await service.createHealthRecord(sample);
    const found = await service.getHealthRecord(created.id!);

    expect(found).toBeDefined();
    expect(found!.id).toBe(created.id);
    expect(found!.timestamp).toBe(sample.timestamp);
    expect(found!.heartbeat).toBe(sample.heartbeat);
    expect(found!.user_id).toBe(sample.user_id);
  });
});

