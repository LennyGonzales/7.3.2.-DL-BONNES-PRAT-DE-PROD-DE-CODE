import { Gps } from "./gps";

export type ItineraryPoint = Omit<Gps, 'id' | 'user_id'>;

export class PhysicalActivity {
  start_at: string;
  end_at: string;
  itinerary: ItineraryPoint[];

  constructor(start_at: string, end_at: string, itinerary: ItineraryPoint[]) {
    this.start_at = start_at;
    this.end_at = end_at;
    this.itinerary = itinerary;
  }
}
