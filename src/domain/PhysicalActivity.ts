import { Gps } from "./gps";

export class PhysicalActivity {
  start_at: string;
  end_at: string;
  itinerary: Gps[];

  constructor(user_id: string, start_at: string, end_at: string, itinerary: Gps[]) {
    this.start_at = start_at;
    this.end_at = end_at;
    this.itinerary = itinerary;
  }
}
