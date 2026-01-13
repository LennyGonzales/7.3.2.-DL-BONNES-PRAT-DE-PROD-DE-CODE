import { PhysicalActivities } from '../../domain/PhysicalActivities';

export interface PhysicalActivityRepositoryPort {
  findAllByUserId(userId: string): Promise<PhysicalActivities>;
}