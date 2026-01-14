import { createHealthRecordDTO, HealthRecord } from '../../domain/healthRecord';
import { inMemoryHealthRecordRepo } from './inMemoryHealthRecordRepo';

describe('inMemoryHealthRecordRepo', () => {
  jest.mock('uuid', () => ({ v4: () => '123456789' }));
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
    expect(savedRecord.heartrate).toBe(recordData.heartrate);
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

  it('should update a health record by id', async () => {
    const existingGps = new HealthRecord('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T10:00:00Z', 72, 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    records.push(existingGps);

    const updatedData = new createHealthRecordDTO(existingGps.user_id, '2024-03-01T15:00:00Z', 85);
    const updatedGps = await repo.update(existingGps.id!, updatedData);

    expect(updatedGps).not.toBeNull();
    expect(updatedGps!.id).toBe(existingGps.id);
    expect(updatedGps!.timestamp).toBe('2024-03-01T15:00:00Z');
    expect(updatedGps!.heartrate).toBe(85);
  });

  it('should delete a health record by id', async () => {
    const gpsToDelete = new HealthRecord('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T10:00:00Z', 72, 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    records.push(gpsToDelete);
    const result = await repo.delete(gpsToDelete.id!);

    expect(result).toBe(true);
    expect(records.length).toBe(0);
  });

  it('should return false when deleting a non-existing health record', async () => {
    const result = await repo.delete('non-existing-id');
    expect(result).toBe(false);
  });
});
