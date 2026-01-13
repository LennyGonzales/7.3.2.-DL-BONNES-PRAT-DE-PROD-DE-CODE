import { Gps } from '../domain/gps';
import { GpsService } from './gpsService';

describe('GpsService', () => {
  let mockRepo: {
    findAllByUserId: jest.Mock<Promise<Gps[]>, []>;
    findById: jest.Mock<Promise<Gps | null>, [string]>;
    save: jest.Mock<Promise<Gps>, [Omit<Gps, 'id'>]>;
  };
  let service: GpsService;

  beforeEach(() => {
    mockRepo = {
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    service = new GpsService(mockRepo);
  });

  it('listGps retourne la liste fournie par le repo', async () => {
    const sample: Gps[] = [
      new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25 17:45:30.005', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2'),
      new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-10-25 15:45:30.005', '21.6328315', '42.3426411', 'd15b94ae-7c70-4faf-83ae-f8b7b268b9cd'),
      new Gps('b3cdc353-1ec6-4332-bd16-262bb9aaa269', '2015-09-25 17:45:30.005', '56.6728315', '32.3986411', 'e5c1258c-e5d9-4d8d-b310-f23489facc3c')];
    mockRepo.findAllByUserId.mockResolvedValue([sample[0], sample[1]]);
    await expect(service.listGpsByUserId('ae5a7d56-5ade-42b7-a2c5-284512da3a60')).resolves.toEqual([sample[0], sample[1]]);
    expect(mockRepo.findAllByUserId).toHaveBeenCalledWith('ae5a7d56-5ade-42b7-a2c5-284512da3a60');
  });

  it('getGps retourne le gps quand il existe', async () => {
    const gps = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25 17:45:30.005', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    mockRepo.findById.mockResolvedValue(gps);
    await expect(service.getGps('1')).resolves.toEqual(gps);
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
  });

  it('getGps retourne null quand le gps est introuvable', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getGps('missing')).resolves.toBeNull();
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });

  it('createGps appelle save et retourne le gps créé', async () => {
    const input = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25 17:45:30.005', '43.6728315', '32.3326411');
    const { user_id, timestamp, latitude, longitude } = input;
    const saved = new Gps(user_id, timestamp, latitude, longitude, 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    mockRepo.save.mockResolvedValue(saved);
    await expect(service.createGps(input)).resolves.toEqual(saved);
    expect(mockRepo.save).toHaveBeenCalledWith(input);
  });
});

