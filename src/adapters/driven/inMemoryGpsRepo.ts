import { v4 as uuidv4 } from 'uuid';
import { Gps } from '../../domain/gps';
import { GpsRepositoryPort } from '../../ports/driven/gpsRepositoryPort';

export class inMemoryGpsRepo implements GpsRepositoryPort {
  constructor(private readonly store: Gps[] = []) {}

  async findAllByUserId(user_id: string): Promise<Gps[]> {
    return this.store.filter((s) => s.user_id === user_id);
  }

  async findById(id: string): Promise<Gps | null> {
    const found = this.store.find((s) => s.id === id);
    return found ?? null;
  }

  async save(gps: Omit<Gps, 'id'>): Promise<Gps> {
    const newGps: Gps = { ...gps, id: uuidv4() };
    this.store.push(newGps);
    return newGps;
  }

  async update(id: string, gps: Partial<Omit<Gps, 'id'>>): Promise<Gps | null> {
    const index = this.store.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const updatedGps = { ...this.store[index], ...gps };
    this.store[index] = updatedGps;
    return { ...updatedGps };
  }

  async delete(id: string): Promise<boolean> {
    const index = this.store.findIndex((s) => s.id === id);
    if (index === -1) return false;
    this.store.splice(index, 1);
    return true;
  }
}
