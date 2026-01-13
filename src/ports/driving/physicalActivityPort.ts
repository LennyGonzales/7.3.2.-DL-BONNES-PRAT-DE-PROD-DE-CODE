import { PhysicalActivities } from '../../domain/PhysicalActivities';

export interface PhysicalActivityPort {
  listPhysicalActivitiesByUserId(user_id: string): Promise<PhysicalActivities>;
}