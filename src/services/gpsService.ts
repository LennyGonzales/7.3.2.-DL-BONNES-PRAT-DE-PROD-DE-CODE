import { Gps } from '../domain/gps';
import { GpsRepositoryPort } from '../ports/driven/gpsRepositoryPort';
import { GpsPort } from '../ports/driving/gpsPort';

export class GpsService implements GpsPort {
  constructor(private repo: GpsRepositoryPort) {}

  async listGpsByUserId(user_id: string): Promise<Gps[]> {
     return this.repo.findAllByUserId(user_id);
  }

  async getGps(id: string): Promise<Gps | null> {
    return this.repo.findById(id);
  }

  async createGps(input: Omit<Gps, 'id'>): Promise<Gps> {
    // Business rules could be applied here
    return this.repo.save(input);
  }
}
