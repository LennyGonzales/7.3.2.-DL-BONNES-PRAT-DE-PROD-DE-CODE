import { v4 as uuidv4 } from 'uuid';
import { HealthRecord } from '../../domain/healthRecord';
import { HealthRecordRepositoryPort } from '../../ports/driven/healthRecordRepositoryPort';

export class inMemoryHealthRecordRepo implements HealthRecordRepositoryPort {
    constructor(private readonly store: HealthRecord[] = []) {}

    async findAllByUserId(user_id: string): Promise<HealthRecord[]> {
        return this.store.filter((s) => s.user_id === user_id);
    }

    async findById(id: string): Promise<HealthRecord | null> {
        const found = this.store.find((s) => s.id === id);
        return found ?? null;
    }

    async save(healthRecord: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
        const newHealthRecord: HealthRecord = { ...healthRecord, id: uuidv4() };
        this.store.push(newHealthRecord);
        return newHealthRecord;
    }

    async update(id: string, healthRecord: Partial<Omit<HealthRecord, 'id'>>): Promise<HealthRecord | null> {
        const index = this.store.findIndex((s) => s.id === id);
        if (index === -1) return null;
        const updatedHealthRecord = { ...this.store[index], ...healthRecord };
        this.store[index] = updatedHealthRecord;
        return { ...updatedHealthRecord };
    }

    async delete(id: string): Promise<boolean> {
        const index = this.store.findIndex((s) => s.id === id);
        if (index === -1) return false;
        this.store.splice(index, 1);
        return true;
    }
}
