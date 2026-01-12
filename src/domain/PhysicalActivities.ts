import { PhysicalActivity } from "./physicalActivity";

export class PhysicalActivities {
  user_id: string;
  physical_activities: PhysicalActivity[];

  constructor(user_id: string, physical_activities: PhysicalActivity[]) {
    this.user_id = user_id;
    this.physical_activities = physical_activities;
  }
}
