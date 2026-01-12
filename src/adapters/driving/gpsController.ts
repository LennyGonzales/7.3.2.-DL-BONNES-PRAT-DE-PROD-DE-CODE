import express, { Express } from 'express';
import { AddressRepositoryPort } from "../../ports/driven/repoPort";
import {Request, Response} from "express";
import { GpsPort } from '../../ports/driving/gpsPort';
import { Gps } from '../../domain/gps';

const router = express.Router();

export class GpsController {
  private service: GpsPort;

  constructor(private readonly addressRepo: AddressRepositoryPort) {
    // this.service = new AddressService(addressRepo);
  }

  registerRoutes(app: Express) {
    app.get('/users/:user_id/gps', this.getAllGps.bind(this));
    app.post('/users/:user_id/gps', this.createGps.bind(this));
    app.get('/users/:user_id/gps/:id', this.getGps.bind(this));
  }

  async getAllGps(req: Request, res: Response) {
    const list = await this.service.listGps();
    res.json(list);
  }

  async createGps(req: Request, res: Response) {
    const { timestamp, latitude, longitude } = req.body;
    const user_id = req.params.user_id;
    if (!user_id || !timestamp || !latitude || !longitude) {
      return res.status(400).json({ message: 'user_id, timestamp, latitude and longitude required' });
    }
    const created = await service.createGps(new Gps(user_id, timestamp, latitude, longitude));
    res.status(201).json(created);
  }

  async getGps(req: Request, res: Response) {
    const id = req.params.id;
    const found = await this.service.getGps(id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    res.json(found);
  }
}

export default router;