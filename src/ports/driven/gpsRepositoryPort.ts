import { Gps } from '../../domain/gps';

export interface GpsRepositoryPort {
  findAllByUserId(userId: string): Promise<Gps[]>;
  findById(id: string): Promise<Gps | null>;
  save(gps: Omit<Gps, 'id'>): Promise<Gps>;
}