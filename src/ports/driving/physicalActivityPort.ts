import { PhysicalActivities } from '../../domain/physicalActivities';

export interface physicalActivityPort {
  listPhysicalActivity(): Promise<PhysicalActivities>;
}