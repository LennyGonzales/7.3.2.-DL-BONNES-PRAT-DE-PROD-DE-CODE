import { v4 as uuidv4 } from 'uuid';
import { Gps } from '../../domain/gps';
import { GpsRepositoryPort } from '../../ports/driven/GpsRepositoryPort';

const store: Gps[] = [];

export class inMemoryGpsRepo implements GpsRepositoryPort {
  async findAllByUserId(user_id: string): Promise<Gps[]> {
    return store.filter((s) => s.user_id === user_id);
  }

  async findById(id: string): Promise<Gps | null> {
    const found = store.find((s) => s.id === id);
    return found ?? null;
  }

  async save(gps: Omit<Gps, 'id'>): Promise<Gps> {
    const newGps: Gps = new Gps(gps.user_id, gps.timestamp, gps.latitude, gps.longitude, uuidv4());
    store.push(newGps);
    return newGps;
  }
}
