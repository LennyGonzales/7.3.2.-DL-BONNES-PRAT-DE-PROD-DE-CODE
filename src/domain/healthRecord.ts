export class HealthRecord {
  id?: string;
  user_id: string;
  timestamp: string;
  heartrate: number;

  constructor(user_id: string, timestamp: string, heartrate: number, id?: string) {
    this.id = id;
    this.user_id = user_id;
    this.timestamp = timestamp;
    this.heartrate = heartrate;
  }
}

export class createHealthRecordDTO {
  user_id: string;
  timestamp: string;
  heartrate: number;

  constructor(user_id: string, timestamp: string, heartrate: number) {
    this.user_id = user_id;
    this.timestamp = timestamp;
    this.heartrate = heartrate;
  }
}