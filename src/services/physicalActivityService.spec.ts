import { Gps } from '../domain/gps';
import { PhysicalActivities } from '../domain/PhysicalActivities';
import { PhysicalActivity } from '../domain/PhysicalActivity';
import { GpsService } from './gpsService';
import { PhysicalActivityService } from './physicalActivityService';

describe('PhysicalActivityService', () => {
  let mockRepo: {
    findAllByUserId: jest.Mock<Promise<PhysicalActivities>, []>;
  };
  let service: PhysicalActivityService;

  beforeEach(() => {
    mockRepo = {
      findAllByUserId: jest.fn(),
    };
    service = new PhysicalActivityService(mockRepo);
  });

  it('listPhysicalActivitiesByUserId retourne la liste fournie par le repo', async () => {
    const physicalActivity1 = new PhysicalActivity('1985-09-25 17:45:30.005', '2015-09-25 17:45:30.005', [new Gps('ae5a7d56-5ade-42b7-a2c5-284512da3a60', '1985-09-25 17:45:30.005', '43.6728315', '32.3326411'), new Gps('ea814045-20f9-43e4-b9e6-f75241f501d3', '1985-10-25 15:45:30.005', '21.6328315', '42.3426411'), new Gps('b3cdc353-1ec6-4332-bd16-262bb9aaa269', '2015-09-25 17:45:30.005', '56.6728315', '32.3986411')]);
    const physicalActivity2 = new PhysicalActivity('1985-09-25 17:45:30.005', '2015-09-25 17:45:30.005', [new Gps('b3cdc353-1ec6-4332-bd16-262bb9aaa269', '2015-09-25 17:45:30.005', '56.6728315', '32.3986411', 'e5c1258c-e5d9-4d8d-b310-f23489facc3c'), new Gps('d15b94ae-7c70-4faf-83ae-f8b7b268b9cd', '2015-09-25 18:45:30.005', '58.6728315', '87.3986411')]);
    const sample: PhysicalActivities = new PhysicalActivities('ae5a7d56-5ade-42b7-a2c5-284512da3a60', [physicalActivity1, physicalActivity2]);
    mockRepo.findAllByUserId.mockResolvedValue(sample);
    await expect(service.listPhysicalActivitiesByUserId('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2')).resolves.toEqual(sample);
    expect(mockRepo.findAllByUserId).toHaveBeenCalledWith('d63a7ea6-6e0d-4183-ad6b-b6f21c8cecd2');
  });
});

