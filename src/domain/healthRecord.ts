export class HealthRecord {
  id?: string;
  user_id: string;
  timestamp: string;
  heartbeat: number;

  constructor(user_id: string, timestamp: string, heartbeat: number, id?: string) {
    this.id = id;
    this.user_id = user_id;
    this.timestamp = timestamp;
    this.heartbeat = heartbeat;
  }
}

export class createHealthRecordDTO {
  user_id: string;
  timestamp: string;
  heartbeat: number;

  constructor(user_id: string, timestamp: string, heartbeat: number) {
    this.user_id = user_id;
    this.timestamp = timestamp;
    this.heartbeat = heartbeat;
  }
}