
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
    app.get('/health_records/:id', this.getHealthRecord.bind(this));
  }

  async getAllHealthRecords(req: Request, res: Response) {
    const user_id = req.params.user_id;
    const list = await this.service.listHealthRecordsByUserId(user_id);
    res.json(list);
  }

  async createHealthRecord(req: Request, res: Response) {
    const { timestamp, heartbeat } = req.body;
    const user_id = req.params.user_id;
    if (!user_id || !timestamp || !heartbeat) {
      return res.status(400).json({ message: 'user_id, timestamp and heartbeat required' });
    }
    const created = await this.service.createHealthRecord(new HealthRecord(user_id, timestamp, heartbeat));
    res.status(201).json(created);
  }

  async getHealthRecord(req: Request, res: Response) {
    const id = req.params.id;
    const found = await this.service.getHealthRecord(id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    res.json(found);
  }

  async updateHealthRecord(req: Request, res: Response) {
    const id = req.params.id;
    const { timestamp, heartbeat } = req.body;
    const updated = await this.service.updateHealthRecord(id, { timestamp, heartbeat });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  }

  async deleteHealthRecord(req: Request, res: Response) {
    const id = req.params.id;
    const deleted = await this.service.deleteHealthRecord(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  }
}
