import { HealthRecord } from '../../domain/healthRecord';

export interface HealthRecordPort {
  listHealthRecordsByUserId(user_id: string): Promise<HealthRecord[]>;
  getHealthRecord(id: string): Promise<HealthRecord | null>;
  createHealthRecord(input: Omit<HealthRecord, 'id'>): Promise<HealthRecord>;
  updateHealthRecord(id: string, input: Partial<Omit<HealthRecord, 'id'>>): Promise<HealthRecord | null>;
  deleteHealthRecord(id: string): Promise<boolean>;
}