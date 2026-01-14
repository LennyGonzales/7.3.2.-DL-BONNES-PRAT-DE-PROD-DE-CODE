import BetterSqlite3 from 'better-sqlite3';
import { Sqlite3HealthRecordRepo } from './sqlite3HealthRecordRepo';
import { createHealthRecordDTO, HealthRecord } from '../../domain/healthRecord';

jest.mock('uuid', () => ({ v4: jest.fn(() => '123456789') }));

describe('Sqlite3HealthRecordRepo', () => {
  let dbMock: jest.Mocked<BetterSqlite3.Database>;
  let repo: Sqlite3HealthRecordRepo;
  let stmtMock: any;

  const recordsSample = [
    new HealthRecord('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-01T10:00:00Z', 72, '1319a6b5-1f08-49e3-a415-4338755ac661'),
    new HealthRecord('2f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-02T10:00:00Z', 80, '2319a6b5-1f08-49e3-a415-4338755ac661'),
  ];

  beforeEach(() => {
    stmtMock = { all: jest.fn(), get: jest.fn(), run: jest.fn() };
    dbMock = { prepare: jest.fn(() => stmtMock) } as any;
    repo = new Sqlite3HealthRecordRepo(dbMock);
  });

  it('should save a health record', async () => {
    stmtMock.run.mockReturnValue({ lastInsertRowid: 1 });

    const recordData = new createHealthRecordDTO('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-01T10:00:00Z', 72);
    const saved = await repo.save(recordData);

    expect(stmtMock.run).toHaveBeenCalledWith(
      '123456789',
      recordData.user_id,
      recordData.timestamp,
      recordData.heartrate
    );

    expect(saved).toEqual({ ...recordData, id: '123456789' });
  });

  it('should get all records by user id', async () => {
    const rows = [recordsSample[0]].map(r => ({
      id: r.id,
      user_id: r.user_id,
      timestamp: r.timestamp,
      heartrate: r.heartrate
    }));

    stmtMock.all.mockReturnValue(rows);

    const result = await repo.findAllByUserId('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab');

    expect(dbMock.prepare).toHaveBeenCalledWith('SELECT * FROM health_records WHERE user_id = ? ORDER BY timestamp');
    expect(stmtMock.all).toHaveBeenCalledWith('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab');
    expect(result).toEqual(rows);
  });

  it('should update a health record by id', async () => {
    const existingRow = {
      id: 'd63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2',
      user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60',
      timestamp: '2024-01-01T10:00:00Z',
      heartrate: 72
    };
    stmtMock.get.mockReturnValue(existingRow);

    const updatedData = new createHealthRecordDTO(
      existingRow.user_id,
      '2024-03-01T15:00:00Z',
      85
    );
    const updated = await repo.update(existingRow.id, updatedData);

    expect(stmtMock.run).toHaveBeenCalledWith(
      updatedData.user_id,
      updatedData.timestamp,
      updatedData.heartrate,
      existingRow.id
    );

    expect(updated).toEqual({
      ...existingRow,
      timestamp: updatedData.timestamp,
      heartrate: updatedData.heartrate
    });
  });

  it('should delete a health record by id', async () => {
    stmtMock.run.mockReturnValue({ changes: 1 });

    const result = await repo.delete('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');

    expect(stmtMock.run).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
    expect(result).toBe(true);
  });

  it('should return false when deleting non-existing record', async () => {
    stmtMock.run.mockReturnValue({ changes: 0 });

    const result = await repo.delete('non-existing-id');

    expect(stmtMock.run).toHaveBeenCalledWith('non-existing-id');
    expect(result).toBe(false);
  });
});
