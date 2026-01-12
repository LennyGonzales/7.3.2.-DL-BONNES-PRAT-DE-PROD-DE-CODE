import express from 'express';
import { InMemoryAddressRepo } from '../driven/inMemoryAddressRepo';
import { GpsPort } from '../../ports/driving/gpsPort';
import { Gps } from '../../domain/gps';

const router = express.Router();

const repo = new InMemoryAddressRepo();
const service: GpsPort; // AddressService(repo);

router.get('/users/:user_id/gps', async (req, res) => {
  const list = await service.listGps();
  res.json(list);
});

router.post('/users/:user_id/gps', async (req, res) => {
  const { timestamp, latitude, longitude } = req.body;
  const user_id = req.params.user_id;
  if (!user_id || !timestamp || !latitude || !longitude) {
    return res.status(400).json({ message: 'user_id, timestamp, latitude and longitude required' });
  }
  const created = await service.createGps(new Gps(user_id, timestamp, latitude, longitude));
  res.status(201).json(created);
});

router.get('/users/:user_id/gps/:id', async (req, res) => {
  const id = req.params.id;
  const found = await service.getGps(id);
  if (!found) return res.status(404).json({ message: 'Not found' });
  res.json(found);
});

export default router;
