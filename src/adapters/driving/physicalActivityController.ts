import express, { Express } from 'express';
import { Address } from "../../domain/address";
import { AddressRepositoryPort } from "../../ports/driven/repoPort";
import {Request, Response} from "express";
import { PhysicalActivityPort } from '../../ports/driving/physicalActivityPort';

const router = express.Router();

export class PhysicalActivityController {
  private service: PhysicalActivityPort;

  constructor(private readonly addressRepo: AddressRepositoryPort) {
    // this.service = new AddressService(addressRepo);
  }

  registerRoutes(app: Express) {
    app.get('/users/:user_id/physical_activities', this.getAllPhysicalActivities.bind(this));
  }

  async getAllPhysicalActivities(req: Request, res: Response) {
    const list = await this.service.listPhysicalActivity();
    res.json(list);
  }
}

export default router;