import { createHealthRecordDTO, HealthRecord } from '../domain/healthRecord';
import { HealthRecordService } from '../services/healthRecordService';

type HealthRecordTestContext = {
  service: HealthRecordService;
  cleanup?: () => void | Promise<void>;
};

export const healthRecordIntegrationTests = (
  suiteName: string,
  setup: () => HealthRecordTestContext | Promise<HealthRecordTestContext>
) => {
  describe(suiteName, () => {
    let context: HealthRecordTestContext;

    beforeEach(async () => {
      context = await setup();
    });

    afterEach(async () => {
      if (context.cleanup) {
        await context.cleanup();
      }
    });

    it('addHealthRecord et verification avec listHealthRecordByUserId', async () => {
      const sample = [
        new createHealthRecordDTO('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-01T10:00:00Z', 72),
        new createHealthRecordDTO('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-02T10:00:00Z', 75),
      ];

      for (const record of sample) {
        await context.service.createHealthRecord(record);
      }

      const result = await context.service.listHealthRecordsByUserId(
        '3f8fc01f-3847-4a1e-a5f9-aa4699a15eab'
      );

      expect(result).toHaveLength(2);
      expect(result.map(r => r.heartrate)).toEqual([72, 75]);
    });

    it('addHealthRecord et verification avec getHealthRecord', async () => {
      const sample = new createHealthRecordDTO('3f8fc01f-3847-4a1e-a5f9-aa4699a15eab', '2024-01-01T10:00:00Z', 72);

      const created = await context.service.createHealthRecord(sample);
      const found = await context.service.getHealthRecord(created.id!);

      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
      expect(found!.timestamp).toBe(sample.timestamp);
      expect(found!.heartrate).toBe(sample.heartrate);
      expect(found!.user_id).toBe(sample.user_id);
    });

    it('updateHealthRecord modifie un health record existant et verification avec getHealthRecord', async () => {
      const sample = new createHealthRecordDTO('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25T17:45:30.005Z', 72);
      const created = await context.service.createHealthRecord(sample);
      const updates: Partial<Omit<HealthRecord, 'id'>> = {
        timestamp: '1985-10-25T17:45:30.005Z',
        heartrate: 85,
      };

      const updatedHealthRecord = await context.service.updateHealthRecord(created.id!, updates);

      expect(updatedHealthRecord).toBeDefined();
      expect(updatedHealthRecord!.id).toBe(created.id);
      expect(updatedHealthRecord!.timestamp).toBe(updates.timestamp);
      expect(updatedHealthRecord!.heartrate).toBe(updates.heartrate);

      const found = await context.service.getHealthRecord(created.id!);

      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
      expect(found!.timestamp).toBe(updates.timestamp);
      expect(found!.heartrate).toBe(updates.heartrate);
    });

    it('deleteHealthRecord et verification', async () => {
      const sample = new createHealthRecordDTO('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25T17:45:30.005Z', 72);
      const created = await context.service.createHealthRecord(sample);

      const result = await context.service.deleteHealthRecord(created.id!);
      expect(result).toBe(true);

      const found = await context.service.getHealthRecord(created.id!);
      expect(found).toBeNull();
    });
  });
};
