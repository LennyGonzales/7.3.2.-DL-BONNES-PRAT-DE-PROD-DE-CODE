import { HealthRecordService } from './healthRecordService';
import { HealthRecord } from '../domain/healthRecord';

describe('HealthRecordService', () => {
  let mockRepo: {
    findAllByUserId: jest.Mock<Promise<HealthRecord[]>, [string]>;
    findById: jest.Mock<Promise<HealthRecord | null>, [string]>;
    save: jest.Mock<Promise<HealthRecord>, [Omit<HealthRecord, 'id'>]>;
  };
  let service: HealthRecordService;

  beforeEach(() => {
    mockRepo = {
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
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
});
