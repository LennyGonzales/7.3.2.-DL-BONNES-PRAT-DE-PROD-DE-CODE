import { Express } from 'express';
import {Request, Response} from "express";
import { PhysicalActivityPort } from '../../ports/driving/physicalActivityPort';

export class PhysicalActivityController {
  private service: PhysicalActivityPort;

  constructor(private readonly physicalActivityService: PhysicalActivityPort) {
    this.service = physicalActivityService;
  }

  registerRoutes(app: Express) {
    app.get('/users/:user_id/physical_activities', this.getAllPhysicalActivities.bind(this));
  }

  async getAllPhysicalActivities(req: Request, res: Response) {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ message: 'user_id required' });
    }

    try {
      const list = await this.service.listPhysicalActivitiesByUserId(user_id);
      return res.json(list);
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

}
