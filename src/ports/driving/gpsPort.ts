import { Gps } from '../../domain/gps';

export interface GpsPort {
  listGpsByUserId(user_id: string): Promise<Gps[]>;
  getGps(id: string): Promise<Gps | null>;
  createGps(input: Omit<Gps, 'id'>): Promise<Gps>;
  updateGps(id: string, input: Partial<Omit<Gps, 'id'>>): Promise<Gps | null>;
  deleteGps(id: string): Promise<boolean>;
}