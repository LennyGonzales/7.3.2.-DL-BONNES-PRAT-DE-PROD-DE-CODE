import { PhysicalActivityRepositoryPort } from '../../ports/driven/physicalActivityRepositoryPort';
import { PhysicalActivities } from '../../domain/PhysicalActivities';

export class inMemoryPhysicalActivityRepo implements PhysicalActivityRepositoryPort {
  constructor(private readonly store: PhysicalActivities[] = []) {}

  async findAllByUserId(user_id: string): Promise<PhysicalActivities> {
    return this.store.filter((s) => s.user_id === user_id)[0];
  }
}
