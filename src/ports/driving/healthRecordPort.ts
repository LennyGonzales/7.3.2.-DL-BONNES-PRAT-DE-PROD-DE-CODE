import { HealthRecord } from '../../domain/healthRecord';

export interface HealthRecordPort {
  listHealthRecordsByUserId(user_id: string): Promise<HealthRecord[]>;
  getHealthRecord(id: string): Promise<HealthRecord | null>;
  createHealthRecord(input: Omit<HealthRecord, 'id'>): Promise<HealthRecord>;
}