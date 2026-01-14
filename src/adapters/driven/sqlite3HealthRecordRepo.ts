import BetterSqlite3 from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { HealthRecordRepositoryPort } from '../../ports/driven/healthRecordRepositoryPort';
import { HealthRecord } from '../../domain/healthRecord';

export class Sqlite3HealthRecordRepo implements HealthRecordRepositoryPort {
  constructor(private readonly db: BetterSqlite3.Database) {}

  private mapRowToHealthRecord(row: any): HealthRecord {
    return {
      id: String(row.id),
      user_id: row.user_id,
      timestamp: row.timestamp,
      heartrate: row.heartrate,
    };
  }

  async findAllByUserId(user_id: string): Promise<HealthRecord[]> {
    return new Promise((resolve) => {
      const stmt = this.db.prepare(`SELECT * FROM health_records WHERE user_id = ? ORDER BY timestamp`);
      const rows = stmt.all(user_id);
      resolve(rows.map(this.mapRowToHealthRecord));
    });
  }

  async findById(id: string): Promise<HealthRecord | null> {
    return new Promise((resolve) => {
      const stmt = this.db.prepare(`SELECT * FROM health_records WHERE id = ?`);
      const row = stmt.get(id);
      resolve(row ? this.mapRowToHealthRecord(row) : null);
    });
  }

  async save(healthRecord: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
    return new Promise((resolve) => {
      const id = uuidv4();
      const stmt = this.db.prepare(`
        INSERT INTO health_records (id, user_id, timestamp, heartrate)
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(id, healthRecord.user_id, healthRecord.timestamp, healthRecord.heartrate);
      resolve({ ...healthRecord, id });
    });
  }

  async update(id: string, healthRecord: Partial<Omit<HealthRecord, 'id'>>): Promise<HealthRecord | null> {
    return new Promise((resolve) => {
      const existingStmt = this.db.prepare(`SELECT * FROM health_records WHERE id = ?`);
      const row = existingStmt.get(id);
      if (!row) return resolve(null);

      const updated = { ...row, ...healthRecord };
      const updateStmt = this.db.prepare(`
        UPDATE health_records
        SET user_id = ?, timestamp = ?, heartrate = ?
        WHERE id = ?
      `);
      updateStmt.run(updated.user_id, updated.timestamp, updated.heartrate, id);
      resolve(this.mapRowToHealthRecord(updated));
    });
  }

  async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      const stmt = this.db.prepare(`DELETE FROM health_records WHERE id = ?`);
      const info = stmt.run(id);
      resolve(info.changes > 0);
    });
  }
}