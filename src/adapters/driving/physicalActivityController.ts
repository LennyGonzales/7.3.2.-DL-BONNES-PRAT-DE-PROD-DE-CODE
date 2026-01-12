import express from 'express';
import { InMemoryAddressRepo } from '../driven/inMemoryAddressRepo';
import { physicalActivityPort } from '../../ports/driving/physicalActivityPort';

const router = express.Router();

const repo = new InMemoryAddressRepo();
const service: physicalActivityPort; // AddressService(repo);

router.get('/users/:user_id/physical_activities', async (req, res) => {
  const list = await service.listPhysicalActivity();
  res.json(list);
});

export default router;
