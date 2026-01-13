import { createHealthRecordDTO, HealthRecord } from '../../domain/healthRecord';
import { inMemoryHealthRecordRepo } from './inMemoryHealthRecordRepo';

describe('inMemoryHealthRecordRepo', () => {
  let repo: inMemoryHealthRecordRepo;
  let records: HealthRecord[] = [];

  beforeEach(async () => {
    records = [];
    repo = new inMemoryHealthRecordRepo(records);
  });

  it('should save a health record', async () => {
    const recordData = new createHealthRecordDTO('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-01T10:00:00Z', 72);
    const savedRecord = await repo.save(recordData);

    expect(savedRecord).toHaveProperty('id');
    expect(savedRecord.user_id).toBe(recordData.user_id);
    expect(savedRecord.timestamp).toBe(recordData.timestamp);
    expect(savedRecord.heartbeat).toBe(recordData.heartbeat);
    expect(records.length).toBe(1);
  });

  it('should get all health records by user id by duplicating variable', async () => {
    const otherUserRecord = new HealthRecord('2f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-02T10:00:00Z', 80, '2319a6b5-1f08-49e3-a415-4338755ac661');
    records = [new HealthRecord('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-01T10:00:00Z', 72, '1319a6b5-1f08-49e3-a415-4338755ac661'), otherUserRecord];
    repo = new inMemoryHealthRecordRepo(records);
    const allRecords = await repo.findAllByUserId('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab');

    expect(allRecords).toEqual([records[0]]);
    expect(allRecords).not.toBe(records);
  });
});
