import BetterSqlite3 from 'better-sqlite3';
import { Sqlite3GpsRepo } from './sqlite3GpsRepo';
import { createGpsDTO, Gps } from '../../domain/gps';

jest.mock('uuid', () => ({ v4: jest.fn(() => '123456789') }));

describe('sqlite3GpsRepo', () => {
  let dbMock: jest.Mocked<BetterSqlite3.Database>;
  let repo: Sqlite3GpsRepo;
  let stmtMock: any;

  const gpsSample = [
    new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T10:00:00Z', '43.6728315', '32.3326411', 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2'),
    new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-02-01T10:00:00Z', '21.6328315', '42.3426411', 'd15b94ae-7c70-4faf-83ae-f8b7b268b9cd')
  ];

  beforeEach(() => {
    stmtMock = {
      all: jest.fn(),
      get: jest.fn(),
      run: jest.fn(),
    };

    dbMock = {
      prepare: jest.fn(() => stmtMock),
    } as any;

    repo = new Sqlite3GpsRepo(dbMock);
  });

  it('should save a gps', async () => {
    stmtMock.run.mockReturnValue({ lastInsertRowid: 1 });

    const gpsData = new createGpsDTO('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '2024-01-01T10:00:00Z', '43.6728315', '32.3326411');

    const saved = await repo.save(gpsData);

    expect(stmtMock.run).toHaveBeenCalledWith(
      '123456789',
      gpsData.user_id,
      gpsData.timestamp,
      gpsData.latitude,
      gpsData.longitude
    );

    expect(saved).toEqual({ ...gpsData, id: '123456789' });
  });

  it('should get all gps by user_id', async () => {
    const rows = gpsSample.map(g => ({
      id: g.id,
      user_id: g.user_id,
      timestamp: g.timestamp,
      latitude: g.latitude,
      longitude: g.longitude
    }));

    stmtMock.all.mockReturnValue(rows);

    const result = await repo.findAllByUserId('ae5a7d56-5ade-42b7-a2c5-284512da3a60');

    expect(dbMock.prepare).toHaveBeenCalledWith(
      'SELECT * FROM gps WHERE user_id = ? ORDER BY timestamp'
    );
    expect(stmtMock.all).toHaveBeenCalledWith('ae5a7d56-5ade-42b7-a2c5-284512da3a60');
    expect(result).toEqual(rows);
  });

  it('should update gps by id', async () => {
    const existingRow = {
      id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2',
      user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60',
      timestamp: '2024-01-01T10:00:00Z',
      latitude: '43.6728315',
      longitude: '32.3326411'
    };
    stmtMock.get.mockReturnValue(existingRow);

    const updatedData = new createGpsDTO(
      existingRow.user_id,
      '2024-03-01T15:00:00Z',
      '57.113445',
      '76.876798'
    );

    const updated = await repo.update(existingRow.id, updatedData);

    expect(stmtMock.run).toHaveBeenCalledWith(
      existingRow.user_id,
      updatedData.timestamp,
      updatedData.latitude,
      updatedData.longitude,
      existingRow.id
    );

    expect(updated).toEqual({
      ...existingRow,
      timestamp: updatedData.timestamp,
      latitude: updatedData.latitude,
      longitude: updatedData.longitude
    });
  });

  it('should delete a gps by id', async () => {
    stmtMock.run.mockReturnValue({ changes: 1 });

    const result = await repo.delete('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');

    expect(stmtMock.run).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    expect(result).toBe(true);
  });

  it('should return false when deleting non-existing gps', async () => {
    stmtMock.run.mockReturnValue({ changes: 0 });

    const result = await repo.delete('non-existing-id');

    expect(stmtMock.run).toHaveBeenCalledWith('non-existing-id');
    expect(result).toBe(false);
  });
});
