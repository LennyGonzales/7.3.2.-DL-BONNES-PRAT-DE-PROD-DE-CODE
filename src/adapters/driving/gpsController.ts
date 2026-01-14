import { Express } from 'express';
import {Request, Response} from "express";
import { GpsPort } from '../../ports/driving/gpsPort';
import { Gps } from '../../domain/gps';

export class GpsController {
  private service: GpsPort;

  constructor(private readonly gpsService: GpsPort) {
    this.service = gpsService;
  }

  registerRoutes(app: Express) {
    app.get('/users/:user_id/gps', this.getAllGps.bind(this));
    app.post('/users/:user_id/gps', this.createGps.bind(this));
    app.get('/gps/:id', this.getGps.bind(this));
    app.delete('/gps/:id', this.deleteGps.bind(this));
    app.patch('/gps/:id', this.updateGps.bind(this));
  }

  async getAllGps(req: Request, res: Response) {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ message: 'user_id required' });
    }

    try {
      const list = await this.service.listGpsByUserId(user_id);
      return res.json(list);
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }


  async createGps(req: Request, res: Response) {
    const { timestamp, latitude, longitude } = req.body;
    const user_id = req.params.user_id;
    if (!user_id || !timestamp || !latitude || !longitude) {
      return res.status(400).json({ message: 'user_id, timestamp, latitude and longitude required' });
    }

    try {
      const existing = await this.service.listGpsByUserId(user_id);
      const hasDuplicate = existing.some(
        (gps) => gps.timestamp === timestamp && gps.latitude === latitude && gps.longitude === longitude
      );
      if (hasDuplicate) {
        return res.status(409).json({ message: 'duplicate gps' });
      }

      const created = await this.service.createGps(new Gps(user_id, timestamp, latitude, longitude));
      return res.status(201).json(created);
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }


  async getGps(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'id required' });
    }

    try {
      const found = await this.service.getGps(id);
      if (!found) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.json(found);
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }


  async updateGps(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'id required' });
    }

    const { timestamp, latitude, longitude } = req.body;
    if (!timestamp || !latitude || !longitude) {
      return res.status(400).json({ message: 'timestamp, latitude and longitude required' });
    }

    try {
      const updated = await this.service.updateGps(id, { timestamp, latitude, longitude });
      if (!updated) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }


  async deleteGps(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'id required' });
    }

    try {
      const deleted = await this.service.deleteGps(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

}
