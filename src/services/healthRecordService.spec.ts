import { HealthRecordService } from './healthRecordService';
import { HealthRecord } from '../domain/healthRecord';

describe('HealthRecordService', () => {
  let mockRepo: {
    findAllByUserId: jest.Mock<Promise<HealthRecord[]>, [string]>;
    findById: jest.Mock<Promise<HealthRecord | null>, [string]>;
    save: jest.Mock<Promise<HealthRecord>, [Omit<HealthRecord, 'id'>]>;
    update: jest.Mock<Promise<HealthRecord | null>, [string, Partial<Omit<HealthRecord, 'id'>>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
  };
  let service: HealthRecordService;

  beforeEach(() => {
    mockRepo = {
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new HealthRecordService(mockRepo);
  });

  it('listHealthRecordsByUserId retourne la liste fournie par le repo', async () => {
    const sample: HealthRecord[] = [
      new HealthRecord('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-01T10:00:00Z', 72, '1319a6b5-1f08-49e3-a415-4338755ac661'),
      new HealthRecord('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-02T10:00:00Z', 75, '2319a6b5-1f08-49e3-a415-4338755ac661'),
    ];
    mockRepo.findAllByUserId.mockResolvedValue(sample);
    await expect(service.listHealthRecordsByUserId('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab')).resolves.toEqual(sample);
    expect(mockRepo.findAllByUserId).toHaveBeenCalledWith('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab');
  });

  it('getHealthRecord retourne le dossier quand il existe', async () => {
    const record = new HealthRecord('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-01T10:00:00Z', 72, '1319a6b5-1f08-49e3-a415-4338755ac661');
    mockRepo.findById.mockResolvedValue(record);
    await expect(service.getHealthRecord('1319a6b5-1f08-49e3-a415-4338755ac661')).resolves.toEqual(record);
    expect(mockRepo.findById).toHaveBeenCalledWith('1319a6b5-1f08-49e3-a415-4338755ac661');
  });

  it('getHealthRecord retourne null quand il est introuvable', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getHealthRecord('missing')).resolves.toBeNull();
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });

  it('createHealthRecord appelle save et retourne le dossier cree', async () => {
    const input = new HealthRecord('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-01T10:00:00Z', 72);
    const saved = new HealthRecord(input.user_id, input.timestamp, input.heartbeat, '3319a6b5-1f08-49e3-a415-4338755ac661');
    mockRepo.save.mockResolvedValue(saved);
    await expect(service.createHealthRecord(input)).resolves.toEqual(saved);
    expect(mockRepo.save).toHaveBeenCalledWith(input);
  });

  it('update healthrecord met à jour le healthrecord existant et retourne le healthrecord mis à jour', async () => {
    const existingHealthRecord = new HealthRecord('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T15:00:00Z', 72, 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    const updates: Partial<Omit<HealthRecord, 'id'>> = {
      timestamp: '2024-03-01T15:00:00Z',
      heartbeat: 75,
    };
    const updatedHealthRecord = new HealthRecord(
      existingHealthRecord.user_id,
      updates.timestamp!,
      updates.heartbeat!,
      existingHealthRecord.id!,
    );

    mockRepo.findById.mockResolvedValue(existingHealthRecord);
    mockRepo.update.mockResolvedValue(updatedHealthRecord);
    await expect(service.updateHealthRecord(existingHealthRecord.id!, updates)).resolves.toEqual(updatedHealthRecord);
    expect(mockRepo.findById).toHaveBeenCalledWith(existingHealthRecord.id!);
    expect(mockRepo.update).toHaveBeenCalledWith(existingHealthRecord.id!, updates);
  });

  it('updateHealthRecord retourne null si le healthrecord n\'existe pas', async () => {
    const updates: Partial<Omit<HealthRecord, 'id'>> = {
      timestamp: '2024-03-01T15:00:00Z',
      heartbeat: 75,
    };
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.updateHealthRecord('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2', updates)).resolves.toBeNull();
    expect(mockRepo.findById).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
  });

  it('deleteHealthRecord supprime le healthrecord existant et retourne true', async () => {
    const healthRecord = new HealthRecord('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T15:00:00Z', 72, 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    mockRepo.findById.mockResolvedValue(healthRecord);
    mockRepo.delete.mockResolvedValue(true);
    await expect(service.deleteHealthRecord(healthRecord.id!)).resolves.toBe(true);
    expect(mockRepo.findById).toHaveBeenCalledWith(healthRecord.id!);
    expect(mockRepo.delete).toHaveBeenCalledWith(healthRecord.id!);
  });

  it('deleteHealthRecord retourne false si le healthrecord n\'existe pas', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.deleteHealthRecord('missing-id')).resolves.toBe(false);
    expect(mockRepo.findById).toHaveBeenCalledWith('missing-id');
  });
});
