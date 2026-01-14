
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
    app.delete('/health_records/:id', this.deleteHealthRecord.bind(this));
    app.patch('/health_records/:id', this.updateHealthRecord.bind(this));
  }

  async getAllHealthRecords(req: Request, res: Response) {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ message: 'user_id required' });
    }

    try {
      const list = await this.service.listHealthRecordsByUserId(user_id);
      return res.json(list);
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async createHealthRecord(req: Request, res: Response) {
    const { timestamp, heartrate } = req.body;
    const user_id = req.params.user_id;
    if (!user_id || !timestamp || !heartrate) {
      return res.status(400).json({ message: 'user_id, timestamp and heartrate required' });
    }

    try {
      const existing = await this.service.listHealthRecordsByUserId(user_id);
      const hasDuplicate = existing.some(
        (record) => record.timestamp === timestamp && record.heartrate === heartrate
      );
      if (hasDuplicate) {
        return res.status(409).json({ message: 'duplicate medical record' });
      }

      const created = await this.service.createHealthRecord(new HealthRecord(user_id, timestamp, heartrate));
      return res.status(201).json(created);
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async getHealthRecord(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'id required' });
    }

    try {
      const found = await this.service.getHealthRecord(id);
      if (!found) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.json(found);
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async updateHealthRecord(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'id required' });
    }

    const { timestamp, heartrate } = req.body;
    if (!timestamp || !heartrate) {
      return res.status(400).json({ message: 'timestamp and heartrate required' });
    }

    try {
      const updated = await this.service.updateHealthRecord(id, { timestamp, heartrate });
      if (!updated) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async deleteHealthRecord(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'id required' });
    }

    try {
      const deleted = await this.service.deleteHealthRecord(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

}
