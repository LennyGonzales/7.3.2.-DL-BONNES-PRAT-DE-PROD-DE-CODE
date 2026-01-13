import { Gps } from '../domain/gps';
import { PhysicalActivities } from '../domain/PhysicalActivities';
import { PhysicalActivity } from '../domain/PhysicalActivity';
import { HealthRecord } from '../domain/healthRecord';
import { PhysicalActivityService } from './physicalActivityService';

describe('PhysicalActivityService', () => {
  let mockGpsRepo: {
    findAllByUserId: jest.Mock<Promise<Gps[]>, [string]>;
    findById: jest.Mock<Promise<Gps | null>, [string]>;
    save: jest.Mock<Promise<Gps>, [Omit<Gps, 'id'>]>;
  };
  let mockHealthRecordRepo: {
    findAllByUserId: jest.Mock<Promise<HealthRecord[]>, [string]>;
    findById: jest.Mock<Promise<HealthRecord | null>, [string]>;
    save: jest.Mock<Promise<HealthRecord>, [Omit<HealthRecord, 'id'>]>;
  };
  let service: PhysicalActivityService;

  beforeEach(() => {
    mockGpsRepo = {
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    mockHealthRecordRepo = {
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    service = new PhysicalActivityService(mockGpsRepo, mockHealthRecordRepo);
  });

  it('listPhysicalActivitiesByUserId construit les activites depuis les donnees de sante et GPS', async () => {
    const userId = '3f8fc01f-3847-4a1e-a5f9-aa4699a15eab';
    const records: HealthRecord[] = [
      new HealthRecord(userId, '2020-01-01T10:00:00.000Z', 95),
      new HealthRecord(userId, '2020-01-01T10:03:00.000Z', 91),
      new HealthRecord(userId, '2020-01-01T10:20:00.000Z', 100),
      new HealthRecord(userId, '2020-01-01T10:01:00.000Z', 80),
    ];
    const gps1 = new Gps(userId, '2020-01-01T10:00:30.000Z', '43.6728315', '32.3326411');
    const gps2 = new Gps(userId, '2020-01-01T10:02:00.000Z', '21.6328315', '42.3426411');
    const gps3 = new Gps(userId, '2020-01-01T10:20:00.000Z', '56.6728315', '32.3986411');
    const gpsOut = new Gps(userId, '2020-01-01T10:10:00.000Z', '58.6728315', '87.3986411');

    mockHealthRecordRepo.findAllByUserId.mockResolvedValue(records);
    mockGpsRepo.findAllByUserId.mockResolvedValue([gps3, gps1, gpsOut, gps2]);

    const expectedActivity1 = new PhysicalActivity(
      '2020-01-01T10:00:00.000Z',
      '2020-01-01T10:03:00.000Z',
      [
        { timestamp: gps1.timestamp, latitude: gps1.latitude, longitude: gps1.longitude },
        { timestamp: gps2.timestamp, latitude: gps2.latitude, longitude: gps2.longitude },
      ],
    );
    const expectedActivity2 = new PhysicalActivity(
      '2020-01-01T10:20:00.000Z',
      '2020-01-01T10:20:00.000Z',
      [{ timestamp: gps3.timestamp, latitude: gps3.latitude, longitude: gps3.longitude }],
    );
    const expected = new PhysicalActivities(userId, [expectedActivity1, expectedActivity2]);

    await expect(service.listPhysicalActivitiesByUserId(userId)).resolves.toEqual(expected);
    expect(mockHealthRecordRepo.findAllByUserId).toHaveBeenCalledWith(userId);
    expect(mockGpsRepo.findAllByUserId).toHaveBeenCalledWith(userId);
  });
});
