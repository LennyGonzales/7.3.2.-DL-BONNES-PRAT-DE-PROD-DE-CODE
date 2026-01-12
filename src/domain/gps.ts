export class Gps {
  id?: string;
  user_id: string;
  timestamp: string;
  latitude: string;
  longitude: string;

  constructor(user_id: string, timestamp: string, latitude: string, longitude: string, id?: string) {
    this.id = id;
    this.user_id = user_id;
    this.timestamp = timestamp;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
