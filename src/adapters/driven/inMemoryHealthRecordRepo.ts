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
        console.log('Saved HealthRecord:', newHealthRecord);
        return newHealthRecord;
    }
}
