import { createGpsDTO, Gps } from '../../domain/gps';
import { inMemoryGpsRepo } from './inMemoryGpsRepo';

describe('inMemoryGpsRepo', () => {
  let repo: inMemoryGpsRepo;
  let gps: Gps[] = [];

  beforeEach(async () => {
    gps = [];
    repo = new inMemoryGpsRepo(gps);
  })

  it('should save a gps', async () => {
    const gpsData = new createGpsDTO('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T10:00:00Z', '43.6728315', '32.3326411');
    const savedGps = await repo.save(gpsData);

    expect(savedGps).toHaveProperty('id');
    expect(savedGps.user_id).toBe(gpsData.user_id);
    expect(savedGps.timestamp).toBe(gpsData.timestamp);
    expect(savedGps.latitude).toBe(gpsData.latitude);
    expect(savedGps.longitude).toBe(gpsData.longitude);
    expect(gps.length).toBe(1);
  });

  it('should get all gps by duplicating variable', async () => {
    gps = [
      new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T10:00:00Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2'),
      new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-02-01T10:00:00Z', '21.6328315', '42.3426411', 'd15b94ae-7c70-4faf-83ae-f8b7b268b9cd')
    ];
    repo = new inMemoryGpsRepo(gps);
    const allGps = await repo.findAllByUserId('ae5a7d56-5ade-42b7-a2c5-284512da3a60');

    expect(allGps).toEqual(gps);
    expect(allGps).not.toBe(gps); // Ensure it's a copy
  });

  it('should update gps by id', async () => {
    const existingGps = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T10:00:00Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    gps.push(existingGps);

    const updatedData = new createGpsDTO(existingGps.user_id, '2024-03-01T15:00:00Z', '57.113445', '76.876798');
    const updatedGps = await repo.update(existingGps.id!, updatedData);

    expect(updatedGps).not.toBeNull();
    expect(updatedGps!.id).toBe(existingGps.id);
    expect(updatedGps!.timestamp).toBe('2024-03-01T15:00:00Z');
    expect(updatedGps!.latitude).toBe('57.113445');
    expect(updatedGps!.longitude).toBe('76.876798');
  });

  it('should delete a gps by id', async () => {
    const gpsToDelete = new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T10:00:00Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    gps.push(gpsToDelete);
    const result = await repo.delete(gpsToDelete.id!);

    expect(result).toBe(true);
    expect(gps.length).toBe(0);
  });

  it('should return false when deleting a non-existing gps', async () => {
    const result = await repo.delete('non-existing-id');
    expect(result).toBe(false);
  });
})