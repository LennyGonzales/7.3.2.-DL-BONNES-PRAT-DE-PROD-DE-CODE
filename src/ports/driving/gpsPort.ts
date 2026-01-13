import { Gps } from '../../domain/gps';

export interface GpsPort {
  listGpsByUserId(user_id: string): Promise<Gps[]>;
  getGps(id: string): Promise<Gps | null>;
  createGps(input: Omit<Gps, 'id'>): Promise<Gps>;
}