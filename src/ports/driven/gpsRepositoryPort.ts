import { Gps } from '../../domain/gps';

export interface GpsRepositoryPort {
  findAllByUserId(userId: string): Promise<Gps[]>;
  findById(id: string): Promise<Gps | null>;
  save(gps: Omit<Gps, 'id'>): Promise<Gps>;
  update(id: string, gps: Partial<Omit<Gps, 'id'>>): Promise<Gps | null>;
  delete(id: string): Promise<boolean>;
}