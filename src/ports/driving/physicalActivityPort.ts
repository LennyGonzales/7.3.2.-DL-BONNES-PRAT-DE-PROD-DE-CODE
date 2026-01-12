import { PhysicalActivities } from '../../domain/PhysicalActivities';

export interface PhysicalActivityPort {
  listPhysicalActivity(): Promise<PhysicalActivities>;
}