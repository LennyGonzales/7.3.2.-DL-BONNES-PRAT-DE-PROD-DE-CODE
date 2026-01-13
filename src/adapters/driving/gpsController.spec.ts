import { GpsController } from './gpsController';
import { Gps } from '../../domain/gps';
import { GpsPort } from '../../ports/driving/gpsPort';

describe('GpsController', () => {
  let controller: GpsController;
  let mockPort: jest.Mocked<GpsPort>;

  beforeEach(() => {
    mockPort = {
      listGpsByUserId: jest.fn(),
      getGps: jest.fn(),
      createGps: jest.fn(),
      updateGps: jest.fn(),
      deleteGps: jest.fn(),
    };

    controller = new GpsController(mockPort);
  });

  it('getAllGps retourne la liste des gps pour un user', async () => {
    const sample: Gps[] = [
      new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25T17:45:30.005Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2'),
    ];
    mockPort.listGpsByUserId.mockResolvedValue(sample);

    const req = {
      params: { user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60' },
    } as any;

    const res = {
      json: jest.fn(),
    } as any;

    await controller.getAllGps(req, res);

    expect(mockPort.listGpsByUserId).toHaveBeenCalledWith('ae5a7d56-5ade-42b7-a2c5-284512da3a60');
    expect(res.json).toHaveBeenCalledWith(sample);
  });

  it('createGps crée un gps et retourne 201', async () => {
    const created = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25T17:45:30.005Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    mockPort.createGps.mockResolvedValue(created);

    const req = {
      params: { user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60' },
      body: {
        timestamp: '1985-09-25T17:45:30.005Z',
        latitude: '43.6728315',
        longitude: '32.3326411',
      },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.createGps(req, res);

    expect(mockPort.createGps).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60',
        timestamp: '1985-09-25T17:45:30.005Z',
        latitude: '43.6728315',
        longitude: '32.3326411',
      })
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('createGps retourne 400 si champs manquants', async () => {
    const req = {
      params: { user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60' },
      body: {
        latitude: '43.6728315',
      },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.createGps(req, res);

    expect(mockPort.createGps).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'user_id, timestamp, latitude and longitude required',
    });
  });

  it('getGps retourne le gps quand il existe', async () => {
    const gps = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25T17:45:30.005Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');

    mockPort.getGps.mockResolvedValue(gps);

    const req = {
      params: { id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2' },
    } as any;

    const res = {
      json: jest.fn(),
    } as any;

    await controller.getGps(req, res);

    expect(mockPort.getGps).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    expect(res.json).toHaveBeenCalledWith(gps);
  });

  it('getGps retourne 404 si gps introuvable', async () => {
    mockPort.getGps.mockResolvedValue(null);

    const req = {
      params: { id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd4' },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.getGps(req, res);

    expect(mockPort.getGps).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd4');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });

  it('updateGps met à jour un gps existant', async () => {
    const updatedGps = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-10-25T17:45:30.005Z', '44.6728315', '33.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    mockPort.updateGps.mockResolvedValue(updatedGps);

    const req = {
      params: { id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2' },
      body: {
        timestamp: '1985-10-25T17:45:30.005Z',
        latitude: '44.6728315',
        longitude: '33.3326411',
      },
    } as any;

    const res = {
      json: jest.fn(),
    } as any;

    await controller.updateGps(req, res);

    expect(mockPort.updateGps).toHaveBeenCalledWith(
      'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2',
      {
        timestamp: '1985-10-25T17:45:30.005Z',
        latitude: '44.6728315',
        longitude: '33.3326411',
      }
    );
    expect(res.json).toHaveBeenCalledWith(updatedGps);
  });

  it('deleteGps supprime un gps existant', async () => {
    mockPort.deleteGps.mockResolvedValue(true);
    const req = {
      params: { id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2' },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;
    await controller.deleteGps(req, res);
    
    expect(mockPort.deleteGps).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteGps retourne 404 si gps introuvable', async () => {
    mockPort.deleteGps.mockResolvedValue(false);

    const req = {
      params: { id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd4' },
    } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.deleteGps(req, res);
    
    expect(mockPort.deleteGps).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd4');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });
});
