import { v4 as uuidv4 } from 'uuid';
import { HealthRecord } from '../../domain/healthRecord';
import { HealthRecordRepositoryPort } from '../../ports/driven/healthRecordRepositoryPort';

const store: HealthRecord[] = [];

export class inMemoryHealthRecordRepo implements HealthRecordRepositoryPort {
    async findAllByUserId(user_id: string): Promise<HealthRecord[]> {
        return store.filter((s) => s.user_id === user_id);
    }

    async findById(id: string): Promise<HealthRecord | null> {
        const found = store.find((s) => s.id === id);
        return found ?? null;
    }

    async save(healthRecord: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
        const newHealthRecord: HealthRecord = new HealthRecord(healthRecord.user_id, healthRecord.timestamp, healthRecord.heartbeat, uuidv4());
        store.push(newHealthRecord);
        console.log('Saved HealthRecord:', newHealthRecord);
        return newHealthRecord;
    }
}
