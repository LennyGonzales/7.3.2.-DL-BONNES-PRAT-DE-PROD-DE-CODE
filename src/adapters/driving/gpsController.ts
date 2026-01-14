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
    const list = await this.service.listGpsByUserId(user_id);
    res.json(list);
  }

  async createGps(req: Request, res: Response) {
    const { timestamp, latitude, longitude } = req.body;
    const user_id = req.params.user_id;
    if (!user_id || !timestamp || !latitude || !longitude) {
      return res.status(400).json({ message: 'user_id, timestamp, latitude and longitude required' });
    }
    const created = await this.service.createGps(new Gps(user_id, timestamp, latitude, longitude));
    res.status(201).json(created);
  }

  async getGps(req: Request, res: Response) {
    const id = req.params.id;
    const found = await this.service.getGps(id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    res.json(found);
  }

  async updateGps(req: Request, res: Response) {
    const id = req.params.id;
    const { timestamp, latitude, longitude } = req.body;
    const updated = await this.service.updateGps(id, { timestamp, latitude, longitude });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  }

  async deleteGps(req: Request, res: Response) {
    const id = req.params.id;
    const deleted = await this.service.deleteGps(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  }
}
