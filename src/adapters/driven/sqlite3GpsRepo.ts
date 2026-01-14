import { Gps } from '../../domain/gps';
import { GpsRepositoryPort } from '../../ports/driven/gpsRepositoryPort';
import BetterSqlite3 from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

export class Sqlite3GpsRepo implements GpsRepositoryPort {
  constructor(private readonly db: BetterSqlite3.Database) {}

  private mapRowToGps(row: any): Gps {
    return {
      id: String(row.id),
      user_id: row.user_id,
      timestamp: row.timestamp,
      latitude: row.latitude,
      longitude: row.longitude,
    };
  }

  async findAllByUserId(user_id: string): Promise<Gps[]> {
    return new Promise((resolve) => {
      const stmt = this.db.prepare(`SELECT * FROM gps WHERE user_id = ? ORDER BY timestamp`);
      const rows = stmt.all(user_id);
      resolve(rows.map(this.mapRowToGps));
    });
  }

  async findById(id: string): Promise<Gps | null> {
    return new Promise((resolve) => {
      const stmt = this.db.prepare(`SELECT * FROM gps WHERE id = ?`);
      const row = stmt.get(id);
      resolve(row ? this.mapRowToGps(row) : null);
    });
  }

  async save(gps: Omit<Gps, 'id'>): Promise<Gps> {
    return new Promise((resolve) => {
      const id = uuidv4();
      const stmt = this.db.prepare(`
        INSERT INTO gps (id, user_id, timestamp, latitude, longitude)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(id, gps.user_id, gps.timestamp, gps.latitude, gps.longitude);
      resolve({ ...gps, id });
    });
  }

  async update(id: string, gps: Partial<Omit<Gps, 'id'>>): Promise<Gps | null> {
    return new Promise((resolve) => {
      const existingStmt = this.db.prepare(`SELECT * FROM gps WHERE id = ?`);
      const row = existingStmt.get(id);
      if (!row) return resolve(null);

      const updated = { ...row, ...gps };
      const updateStmt = this.db.prepare(`
        UPDATE gps
        SET user_id = ?, timestamp = ?, latitude = ?, longitude = ?
        WHERE id = ?
      `);
      updateStmt.run(updated.user_id, updated.timestamp, updated.latitude, updated.longitude, id);
      resolve(this.mapRowToGps(updated));
    });
  }

  async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      const stmt = this.db.prepare(`DELETE FROM gps WHERE id = ?`);
      const info = stmt.run(id);
      resolve(info.changes > 0);
    });
  }
}