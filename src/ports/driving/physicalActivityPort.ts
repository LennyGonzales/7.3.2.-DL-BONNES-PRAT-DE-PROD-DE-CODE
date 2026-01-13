import { PhysicalActivities } from '../../domain/PhysicalActivities';

export interface PhysicalActivityPort {
  listPhysicalActivityByUserId(user_id: string): Promise<PhysicalActivities>;
}