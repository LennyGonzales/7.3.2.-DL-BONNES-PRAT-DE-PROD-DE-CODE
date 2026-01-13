import { PhysicalActivities } from '../domain/PhysicalActivities';
import { PhysicalActivity } from '../domain/PhysicalActivity';
import { GpsRepositoryPort } from '../ports/driven/gpsRepositoryPort';
import { PhysicalActivityPort } from '../ports/driving/physicalActivityPort';
import { HealthRecordRepositoryPort } from '../ports/driven/healthRecordRepositoryPort';
import { HealthRecord } from '../domain/healthRecord';
import { Gps } from '../domain/gps';


export class PhysicalActivityService implements PhysicalActivityPort {
    private readonly DEFAULT_ELEVATED_heartrate_THRESHOLD = 90;
    private readonly DEFAULT_MAX_ELEVATED_GAP_MS = 5 * 60 * 1000;

    constructor(private repoGps: GpsRepositoryPort,
              private repoHealthRecord: HealthRecordRepositoryPort) {}

  async listPhysicalActivitiesByUserId(user_id: string): Promise<PhysicalActivities> {
      const userHealthRecords: HealthRecord[] = await this.repoHealthRecord.findAllByUserId(user_id);
      const elevatedheartrateRecords: HealthRecord[] = userHealthRecords.filter(r => r.heartrate > this.DEFAULT_ELEVATED_heartrate_THRESHOLD);
      const elevatedWithMs = elevatedheartrateRecords
        .map((record) => ({ record, ms: Date.parse(record.timestamp) }))
        .filter((item) => !Number.isNaN(item.ms))
        .sort((a, b) => a.ms - b.ms);

      const activityGroups: HealthRecord[][] = [];
      let currentGroup: HealthRecord[] = [];
      let lastMs: number | null = null;

      for (const item of elevatedWithMs) {
        if (lastMs === null || item.ms - lastMs <= this.DEFAULT_MAX_ELEVATED_GAP_MS) {
          currentGroup.push(item.record);
        } else {
          activityGroups.push(currentGroup);
          currentGroup = [item.record];
        }
        lastMs = item.ms;
      }

      if (currentGroup.length > 0) {
        activityGroups.push(currentGroup);
      }

      const userGps: Gps[] = await this.repoGps.findAllByUserId(user_id);
      const gpsWithMs = userGps
        .map((gps) => ({ gps, ms: Date.parse(gps.timestamp) }))
        .filter((item) => !Number.isNaN(item.ms))
        .sort((a, b) => a.ms - b.ms);

      const physicalActivities: PhysicalActivity[] = activityGroups.map((group) => {
        const startAt = group[0].timestamp;
        const endAt = group[group.length - 1].timestamp;
        const startMs = Date.parse(startAt);
        const endMs = Date.parse(endAt);
      const itinerary = gpsWithMs
        .filter((item) => item.ms >= startMs && item.ms <= endMs)
        .map((item) => ({
          timestamp: item.gps.timestamp,
          latitude: item.gps.latitude,
          longitude: item.gps.longitude,
        }));
        return new PhysicalActivity(startAt, endAt, itinerary);
      });

      return new PhysicalActivities(user_id, physicalActivities);
  }
}
