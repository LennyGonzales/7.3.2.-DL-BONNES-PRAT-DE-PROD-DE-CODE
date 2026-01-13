import { PhysicalActivityRepositoryPort } from '../../ports/driven/physicalActivityRepositoryPort';
import { PhysicalActivities } from '../../domain/PhysicalActivities';

const store: PhysicalActivities[] = [];

export class inMemoryPhysicalActivityRepo implements PhysicalActivityRepositoryPort {
  async findAllByUserId(user_id: string): Promise<PhysicalActivities> {
    return store.filter((s) => s.user_id === user_id)[0];
  }
}
