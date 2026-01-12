
import { Express } from 'express';
import {Request, Response} from "express";
import { HealthRecordPort } from '../../ports/driving/healthRecordPort';
import { HealthRecord } from '../../domain/healthRecord';

export class HealthRecordController {
  private service: HealthRecordPort;

  constructor(private readonly healthRecordService: HealthRecordPort) {
    this.service = healthRecordService;
  }

  registerRoutes(app: Express) {
    app.get('/users/:user_id/health_records', this.getAllHealthRecords.bind(this));
    app.post('/users/:user_id/health_records', this.createHealthRecord.bind(this));
    app.get('/users/:user_id/health_records/:id', this.getHealthRecord.bind(this));
  }

  async getAllHealthRecords(req: Request, res: Response) {
    const list = await this.service.listHealthRecords();
    res.json(list);
  }

  async createHealthRecord(req: Request, res: Response) {
    const { timestamp, heartbeat } = req.body;
    const user_id = req.params.user_id;
    if (!user_id || !timestamp || !heartbeat) {
      return res.status(400).json({ message: 'user_id, timestamp and heartbeat required' });
    }
    const created = await service.createHealthRecord(new HealthRecord(user_id, timestamp, heartbeat));
    res.status(201).json(created);
  }

  async getHealthRecord(req: Request, res: Response) {
    const id = req.params.id;
    const found = await this.service.getHealthRecord(id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    res.json(found);
  }
}
