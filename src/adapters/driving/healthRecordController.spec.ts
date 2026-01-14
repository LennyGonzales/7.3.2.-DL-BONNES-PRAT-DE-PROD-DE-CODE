import { HealthRecordController } from './healthRecordController';
import { HealthRecordPort } from '../../ports/driving/healthRecordPort';
import { HealthRecord } from '../../domain/healthRecord';

describe('HealthRecordController', () => {
  let controller: HealthRecordController;
  let mockPort: jest.Mocked<HealthRecordPort>;

  beforeEach(() => {
    mockPort = {
      listHealthRecordsByUserId: jest.fn(),
      getHealthRecord: jest.fn(),
      createHealthRecord: jest.fn(),
      updateHealthRecord: jest.fn(),
      deleteHealthRecord: jest.fn(),
    };

    controller = new HealthRecordController(mockPort);
  });

  it('getAllHealthRecords retourne la liste des health records pour un user', async () => {
    const sample: HealthRecord[] = [
      new HealthRecord('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25T17:45:30.005Z', 72, 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2'),
    ];
    mockPort.listHealthRecordsByUserId.mockResolvedValue(sample);

    const req = {
      query: { user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60' },
    } as any;

    const res = {
      json: jest.fn(),
    } as any;

    await controller.getAllHealthRecords(req, res);

    expect(mockPort.listHealthRecordsByUserId).toHaveBeenCalledWith('ae5a7d56-5ade-42b7-a2c5-284512da3a60');
    expect(res.json).toHaveBeenCalledWith(sample);
  });

  it('createHealthRecord crée un health record et retourne 201', async () => {
    const created = new HealthRecord('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25T17:45:30.005Z', 72, 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    mockPort.listHealthRecordsByUserId.mockResolvedValue([]);
    mockPort.createHealthRecord.mockResolvedValue(created);

    const req = {
      query: { user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60' },
      body: {
        timestamp: '1985-09-25T17:45:30.005Z',
        heartrate: 72,
      },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.createHealthRecord(req, res);

    expect(mockPort.createHealthRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60',
        timestamp: '1985-09-25T17:45:30.005Z',
        heartrate: 72,
      })
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('createHealthRecord retourne 400 si champs manquants', async () => {
    const req = {
      query: { user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60' },
      body: {
        heartrate: 72,
      },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.createHealthRecord(req, res);
    expect(mockPort.createHealthRecord).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'user_id, timestamp and heartrate required',
    });
  });

  it('getHealthRecord retourne le health record quand il existe', async () => {
    const healthRecord = new HealthRecord('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25T17:45:30.005Z', 72, 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');

    mockPort.getHealthRecord.mockResolvedValue(healthRecord);

    const req = {
      params: { id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2' },
    } as any;

    const res = {
      json: jest.fn(),
    } as any;

    await controller.getHealthRecord(req, res);

    expect(mockPort.getHealthRecord).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    expect(res.json).toHaveBeenCalledWith(healthRecord);
  });

  it('getHealthRecord retourne 404 si health record introuvable', async () => {
    mockPort.getHealthRecord.mockResolvedValue(null);

    const req = {
      params: { id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd4' },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.getHealthRecord(req, res);

    expect(mockPort.getHealthRecord).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd4');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });

  it('updateHealthRecord met à jour un health record existant', async () => {
    const updatedHealthRecord = new HealthRecord('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-10-25T17:45:30.005Z', 72, 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    mockPort.updateHealthRecord.mockResolvedValue(updatedHealthRecord);

    const req = {
      params: { id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2' },
      body: {
        timestamp: '1985-10-25T17:45:30.005Z',
        heartrate: 72,
      },
    } as any;

    const res = {
      json: jest.fn(),
    } as any;

    await controller.updateHealthRecord(req, res);

    expect(mockPort.updateHealthRecord).toHaveBeenCalledWith(
      'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2',
      {
        timestamp: '1985-10-25T17:45:30.005Z',
        heartrate: 72,
      }
    );
    expect(res.json).toHaveBeenCalledWith(updatedHealthRecord);
  });

  it('deleteHealthRecord supprime un health record existant', async () => {
    mockPort.deleteHealthRecord.mockResolvedValue(true);
    const req = {
      params: { id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2' },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;
    await controller.deleteHealthRecord(req, res);

    expect(mockPort.deleteHealthRecord).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteHealthRecord retourne 404 si health record introuvable', async () => {
    mockPort.deleteHealthRecord.mockResolvedValue(false);

    const req = {
      params: { id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd4' },
    } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.deleteHealthRecord(req, res);

    expect(mockPort.deleteHealthRecord).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd4');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });
});
