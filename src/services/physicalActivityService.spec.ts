import { Gps } from '../domain/gps';
import { PhysicalActivities } from '../domain/PhysicalActivities';
import { PhysicalActivity } from '../domain/PhysicalActivity';
import { HealthRecord } from '../domain/healthRecord';
import { PhysicalActivityService } from './physicalActivityService';
import { ELEVATED_HEARTRATE_THRESHOLD, MAX_ELEVATED_GAP_MS } from '../config/physicalActivityConfig';

describe('PhysicalActivityService', () => {
  let mockGpsRepo: {
    findAllByUserId: jest.Mock<Promise<Gps[]>, [string]>;
    findById: jest.Mock<Promise<Gps | null>, [string]>;
    save: jest.Mock<Promise<Gps>, [Omit<Gps, 'id'>]>;
    update: jest.Mock<Promise<Gps | null>, [string, Partial<Omit<Gps, 'id'>>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
  };
  let mockHealthRecordRepo: {
    findAllByUserId: jest.Mock<Promise<HealthRecord[]>, [string]>;
    findById: jest.Mock<Promise<HealthRecord | null>, [string]>;
    save: jest.Mock<Promise<HealthRecord>, [Omit<HealthRecord, 'id'>]>;
    update: jest.Mock<Promise<HealthRecord | null>, [string, Partial<Omit<HealthRecord, 'id'>>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
  };
  let service: PhysicalActivityService;

  beforeEach(() => {
    mockGpsRepo = {
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockHealthRecordRepo = {
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new PhysicalActivityService(mockGpsRepo, mockHealthRecordRepo);
  });

  it('listPhysicalActivitiesByUserId construit les activites depuis les donnees de sante et GPS', async () => {
    const userId = '3f8fc01f-3847-4a1e-a5f9-aa4699a15eab';
    const baseMs = Date.parse('2020-01-01T10:00:00.000Z');
    const timestamp1 = new Date(baseMs).toISOString();
    const timestamp2 = new Date(baseMs + MAX_ELEVATED_GAP_MS - 1).toISOString();
    const timestamp3 = new Date(baseMs + (MAX_ELEVATED_GAP_MS - 1) * 2).toISOString();
    const records: HealthRecord[] = [
      new HealthRecord(userId, timestamp1, ELEVATED_HEARTRATE_THRESHOLD + 10),
      new HealthRecord(userId, timestamp2, ELEVATED_HEARTRATE_THRESHOLD + 11),
      new HealthRecord(userId, timestamp3, ELEVATED_HEARTRATE_THRESHOLD - 10),
    ];
    const gps1 = new Gps(userId, timestamp1, '43.6728315', '32.3326411');
    const gps2 = new Gps(userId, timestamp2, '21.6328315', '42.3426411');
    const gps3 = new Gps(userId, timestamp3, '58.6728315', '87.3986411');

    mockHealthRecordRepo.findAllByUserId.mockResolvedValue(records);
    mockGpsRepo.findAllByUserId.mockResolvedValue([gps1, gps3, gps2]);

    const expectedActivity1 = new PhysicalActivity(
      timestamp1,
      timestamp2,
      [
        { timestamp: gps1.timestamp, latitude: gps1.latitude, longitude: gps1.longitude },
        { timestamp: gps2.timestamp, latitude: gps2.latitude, longitude: gps2.longitude },
      ],
    );
    const expected = new PhysicalActivities(userId, [expectedActivity1]);

    await expect(service.listPhysicalActivitiesByUserId(userId)).resolves.toEqual(expected);
    expect(mockHealthRecordRepo.findAllByUserId).toHaveBeenCalledWith(userId);
    expect(mockGpsRepo.findAllByUserId).toHaveBeenCalledWith(userId);
  });

  it('utilise le MAX_ELEVATED_GAP pour regrouper les activites', async () => {
    const userId = 'a03e98c4-9f13-4e2c-8ac7-6d00f5409f50';
    const baseMs = Date.parse('2020-01-01T10:00:00.000Z');
    const timestamp1 = new Date(baseMs).toISOString();
    const timestamp2 = new Date(baseMs + MAX_ELEVATED_GAP_MS).toISOString();
    const timestamp3 = new Date(baseMs + MAX_ELEVATED_GAP_MS * 2 + 1000).toISOString();
    const records: HealthRecord[] = [
      new HealthRecord(userId, timestamp1, ELEVATED_HEARTRATE_THRESHOLD + 1),
      new HealthRecord(userId, timestamp2, ELEVATED_HEARTRATE_THRESHOLD + 5),
      new HealthRecord(userId, timestamp3, ELEVATED_HEARTRATE_THRESHOLD + 2),
    ];
    const gps1 = new Gps(userId,timestamp1, '10.0001', '20.0001');
    const gps2 = new Gps(userId, timestamp2, '10.0002', '20.0002');
    const gps3 = new Gps(userId, timestamp3, '10.0003', '20.0003');

    mockHealthRecordRepo.findAllByUserId.mockResolvedValue(records);
    mockGpsRepo.findAllByUserId.mockResolvedValue([gps2, gps3, gps1]);

    const result = await service.listPhysicalActivitiesByUserId(userId);

    expect(result.physical_activities).toHaveLength(2);
    expect(result.physical_activities[0].start_at).toBe(timestamp1);
    expect(result.physical_activities[0].end_at).toBe(timestamp2);
    expect(result.physical_activities[1].start_at).toBe(timestamp3);
    expect(result.physical_activities[1].end_at).toBe(timestamp3);
  });

  it('respecte le ELEVATED_HEARTRATE_THRESHOLD pour creer une activite', async () => {
    const userId = '9f7b9f8c-2a14-4d7a-8b5a-8a2a5b44d8c9';
    const aboveTs = '2020-01-02T10:00:00.000Z';
    const belowTs = '2020-01-02T10:10:00.000Z';
    const records: HealthRecord[] = [
      new HealthRecord(userId, aboveTs, ELEVATED_HEARTRATE_THRESHOLD + 1),
      new HealthRecord(userId, belowTs, ELEVATED_HEARTRATE_THRESHOLD),
    ];
    const gps = new Gps(userId, '2020-01-02T10:00:30.000Z', '11.0001', '21.0001');

    mockHealthRecordRepo.findAllByUserId.mockResolvedValue(records);
    mockGpsRepo.findAllByUserId.mockResolvedValue([gps]);

    const result = await service.listPhysicalActivitiesByUserId(userId);

    expect(result.physical_activities).toHaveLength(1);
    expect(result.physical_activities[0].start_at).toBe(aboveTs);
    expect(result.physical_activities[0].end_at).toBe(aboveTs);
  });

  it('cree deux groupes quand l ecart depasse MAX_ELEVATED_GAP_MS', async () => {
    const userId = '7b1e3e6f-0b5b-4a4c-9a8c-1d2b8c42b0e1';
    const baseMs = Date.parse('2020-02-01T08:00:00.000Z');
    const timestamp1 = new Date(baseMs).toISOString();
    const timestamp2 = new Date(baseMs + MAX_ELEVATED_GAP_MS - 1).toISOString();
    const timestamp3 = new Date(baseMs + MAX_ELEVATED_GAP_MS * 2).toISOString();
    const records: HealthRecord[] = [
      new HealthRecord(userId, timestamp1, ELEVATED_HEARTRATE_THRESHOLD + 1),
      new HealthRecord(userId, timestamp2, ELEVATED_HEARTRATE_THRESHOLD + 1),
      new HealthRecord(userId, timestamp3, ELEVATED_HEARTRATE_THRESHOLD + 1),
    ];
    const gps1 = new Gps(userId, timestamp1, '12.0001', '22.0001');
    const gps2 = new Gps(userId, timestamp2, '12.0002', '22.0002');
    const gps3 = new Gps(userId, timestamp3, '12.0003', '22.0003');

    mockHealthRecordRepo.findAllByUserId.mockResolvedValue(records);
    mockGpsRepo.findAllByUserId.mockResolvedValue([gps3, gps1, gps2]);

    const result = await service.listPhysicalActivitiesByUserId(userId);

    expect(result.physical_activities).toHaveLength(2);
    expect(result.physical_activities[0].start_at).toBe(timestamp1);
    expect(result.physical_activities[0].end_at).toBe(timestamp2);
    expect(result.physical_activities[1].start_at).toBe(timestamp3);
    expect(result.physical_activities[1].end_at).toBe(timestamp3);
  });

  it('retourne des activites avec start_at avant end_at et des timestamps ISO8601', async () => {
    const userId = 'f4bd7a4e-6fb9-4f2e-89d8-9e6b5d858b66';
    const records: HealthRecord[] = [
      new HealthRecord(userId, '2020-01-01T10:00:00.000Z', ELEVATED_HEARTRATE_THRESHOLD + 10),
      new HealthRecord(userId, '2020-01-01T10:01:00.000Z', ELEVATED_HEARTRATE_THRESHOLD + 5),
    ];
    const gps1 = new Gps(userId, '2020-01-01T10:00:30.000Z', '43.6728315', '32.3326411');
    const gps2 = new Gps(userId, '2020-01-01T10:00:45.000Z', '21.6328315', '42.3426411');

    mockHealthRecordRepo.findAllByUserId.mockResolvedValue(records);
    mockGpsRepo.findAllByUserId.mockResolvedValue([gps1, gps2]);

    const result = await service.listPhysicalActivitiesByUserId(userId);
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    for (const activity of result.physical_activities) {
      expect(Date.parse(activity.start_at)).toBeLessThanOrEqual(Date.parse(activity.end_at));
      expect(activity.start_at).toMatch(isoRegex);
      expect(activity.end_at).toMatch(isoRegex);
      for (const point of activity.itinerary) {
        expect(point.timestamp).toMatch(isoRegex);
      }
    }
  });
});
