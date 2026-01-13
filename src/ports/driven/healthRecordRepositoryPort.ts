import { HealthRecord } from '../../domain/healthRecord';

export interface HealthRecordRepositoryPort {
    findAllByUserId(userId: string): Promise<HealthRecord[]>;
    findById(id: string): Promise<HealthRecord | null>;
    save(gps: Omit<HealthRecord, 'id'>): Promise<HealthRecord>;
}