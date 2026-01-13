import { Gps } from '../domain/gps';
import { GpsService } from './gpsService';

describe('GpsService', () => {
  let mockRepo: {
    findAllByUserId: jest.Mock<Promise<Gps[]>, []>;
    findById: jest.Mock<Promise<Gps | null>, [string]>;
    save: jest.Mock<Promise<Gps>, [Omit<Gps, 'id'>]>;
    update: jest.Mock<Promise<Gps | null>, [string, Partial<Omit<Gps, 'id'>>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
  };
  let service: GpsService;

  beforeEach(() => {
    mockRepo = {
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new GpsService(mockRepo);
  });

  it('listGps retourne la liste fournie par le repo', async () => {
    const sample: Gps[] = [
      new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T15:00:00Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2'),
      new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-03-01T15:00:00Z', '21.6328315', '42.3426411', 'd15b94ae-7c70-4faf-83ae-f8b7b268b9cd'),
      new Gps('b3cdc353-1ec6-4332-bd16-262bb9aaa269', '2024-07-01T15:00:00Z', '56.6728315', '32.3986411', 'e5c1258c-e5d9-4d8d-b310-f23489facc3c')];
    mockRepo.findAllByUserId.mockResolvedValue([sample[0], sample[1]]);
    await expect(service.listGpsByUserId('ae5a7d56-5ade-42b7-a2c5-284512da3a60')).resolves.toEqual([sample[0], sample[1]]);
    expect(mockRepo.findAllByUserId).toHaveBeenCalledWith('ae5a7d56-5ade-42b7-a2c5-284512da3a60');
  });

  it('getGps retourne le gps quand il existe', async () => {
    const gps = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T15:00:00Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
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
    const input = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T15:00:00Z', '43.6728315', '32.3326411');
    const { user_id, timestamp, latitude, longitude } = input;
    const saved = new Gps(user_id, timestamp, latitude, longitude, 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    mockRepo.save.mockResolvedValue(saved);
    await expect(service.createGps(input)).resolves.toEqual(saved);
    expect(mockRepo.save).toHaveBeenCalledWith(input);
  });

  it('update gps met à jour le gps existant et retourne le gps mis à jour', async () => {
    const existingGps = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T15:00:00Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    const updates: Partial<Omit<Gps, 'id'>> = {
      timestamp: '2024-03-01T15:00:00Z',
      latitude: '44.6728315',
      longitude: '33.3326411',
    };
    const updatedGps = new Gps(
      existingGps.user_id,
      updates.timestamp!,
      updates.latitude!,
      updates.longitude!,
      existingGps.id!,
    );

    mockRepo.findById.mockResolvedValue(existingGps);
    mockRepo.update.mockResolvedValue(updatedGps);
    await expect(service.updateGps(existingGps.id!, updates)).resolves.toEqual(updatedGps);
    expect(mockRepo.findById).toHaveBeenCalledWith(existingGps.id!);
    expect(mockRepo.update).toHaveBeenCalledWith(existingGps.id!, updates);
  });

  it('updateGps retourne null si le gps n\'existe pas', async () => {
    const updates: Partial<Omit<Gps, 'id'>> = {
      timestamp: '2024-03-01T15:00:00Z',
    };
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.updateGps('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2', updates)).resolves.toBeNull();
    expect(mockRepo.findById).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
  });

  it('deleteGps supprime le gps existant et retourne true', async () => {
    const gps = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T15:00:00Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    mockRepo.findById.mockResolvedValue(gps);
    mockRepo.delete.mockResolvedValue(true);
    await expect(service.deleteGps(gps.id!)).resolves.toBe(true);
    expect(mockRepo.findById).toHaveBeenCalledWith(gps.id!);
    expect(mockRepo.delete).toHaveBeenCalledWith(gps.id!);
  });

  it('deleteGps retourne false si le gps n\'existe pas', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.deleteGps('missing-id')).resolves.toBe(false);
    expect(mockRepo.findById).toHaveBeenCalledWith('missing-id');
  });
});

