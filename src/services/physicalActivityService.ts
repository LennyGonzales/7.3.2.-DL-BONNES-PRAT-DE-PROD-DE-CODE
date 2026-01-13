import { Gps } from '../domain/gps';
import { PhysicalActivities } from '../domain/PhysicalActivities';
import { PhysicalActivityRepositoryPort } from '../ports/driven/physicalActivityRepositoryPort';
import { PhysicalActivityPort } from '../ports/driving/physicalActivityPort';

export class PhysicalActivityService implements PhysicalActivityPort {
  constructor(private repo: PhysicalActivityRepositoryPort) {}

  async listPhysicalActivitiesByUserId(user_id: string): Promise<PhysicalActivities> {
     return this.repo.findAllByUserId(user_id);
  }
}
