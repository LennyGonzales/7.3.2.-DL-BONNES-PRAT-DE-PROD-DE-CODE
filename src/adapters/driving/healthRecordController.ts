import express from 'express';
import { InMemoryAddressRepo } from '../driven/inMemoryAddressRepo';
import { HealthRecord } from '../../domain/healthRecord';
import { HealthRecordPort } from '../../ports/driving/healthRecordPort';

const router = express.Router();

const repo = new InMemoryAddressRepo();
const service: HealthRecordPort; // AddressService(repo);

router.get('/users/:user_id/health_records', async (req, res) => {
  const list = await service.listHealthRecords();
  res.json(list);
});

router.post('/users/:user_id/health_records', async (req, res) => {
  const { timestamp, heartbeat } = req.body;
  const user_id = req.params.user_id;
  if (!user_id || !timestamp || !heartbeat) {
    return res.status(400).json({ message: 'user_id, timestamp and heartbeat required' });
  }
  const created = await service.createHealthRecord(new HealthRecord(user_id, timestamp, heartbeat));
  res.status(201).json(created);
});

router.get('/users/:user_id/health_records/:id', async (req, res) => {
  const id = req.params.id;
  const found = await service.getHealthRecord(id);
  if (!found) return res.status(404).json({ message: 'Not found' });
  res.json(found);
});

export default router;
