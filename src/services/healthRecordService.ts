import { HealthRecord } from '../domain/healthRecord';
import { HealthRecordRepositoryPort } from '../ports/driven/healthRecordRepositoryPort';
import { HealthRecordPort } from '../ports/driving/healthRecordPort';

export class HealthRecordService implements HealthRecordPort {
    constructor(private repo: HealthRecordRepositoryPort) {}

    async listHealthRecordsByUserId(user_id: string): Promise<HealthRecord[]> {
        return this.repo.findAllByUserId(user_id);
    }

    async getHealthRecord(id: string): Promise<HealthRecord | null> {
        return this.repo.findById(id);
    }

    async createHealthRecord(input: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
        // Business rules could be applied here
        return this.repo.save(input);
    }

    async updateHealthRecord(id: string, input: Partial<Omit<HealthRecord, 'id'>>): Promise<HealthRecord | null> {
        const existingHealthRecord = await this.repo.findById(id);
        if (!existingHealthRecord) return null;
        return this.repo.update(id, input);
    }

    async deleteHealthRecord(id: string): Promise<boolean> {
        const existingHealthRecord = await this.repo.findById(id);
        if (!existingHealthRecord) return false;
        return this.repo.delete(id);
    }
}
