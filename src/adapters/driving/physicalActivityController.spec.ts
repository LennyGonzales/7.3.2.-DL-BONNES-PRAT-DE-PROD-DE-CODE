import { PhysicalActivityController } from './physicalActivityController';
import { PhysicalActivities } from '../../domain/PhysicalActivities';
import { PhysicalActivity } from '../../domain/PhysicalActivity';
import { PhysicalActivityPort } from '../../ports/driving/physicalActivityPort';

describe('PhysicalActivityController', () => {
  let controller: PhysicalActivityController;
  let mockPort: jest.Mocked<PhysicalActivityPort>;

  beforeEach(() => {
    mockPort = {
      listPhysicalActivitiesByUserId: jest.fn(),
    };

    controller = new PhysicalActivityController(mockPort);
  });

  it('getAllPhysicalActivities retourne la liste des activites physiques pour un user', async () => {
    const activities = new PhysicalActivities('ae5a7d56-5ade-42b7-a2c5-284512da3a60', [
      new PhysicalActivity('1985-09-25T17:45:30.005Z', '1985-09-25T18:45:30.005Z', [
        {
          timestamp: '1985-09-25T17:45:30.005Z',
          latitude: '43.6728315',
          longitude: '32.3326411',
        },
      ]),
    ]);
    mockPort.listPhysicalActivitiesByUserId.mockResolvedValue(activities);

    const req = {
      params: { user_id: 'ae5a7d56-5ade-42b7-a2c5-284512da3a60' },
    } as any;

    const res = {
      json: jest.fn(),
    } as any;

    await controller.getAllPhysicalActivities(req, res);

    expect(mockPort.listPhysicalActivitiesByUserId).toHaveBeenCalledWith('ae5a7d56-5ade-42b7-a2c5-284512da3a60');
    expect(res.json).toHaveBeenCalledWith(activities);
  });
});
