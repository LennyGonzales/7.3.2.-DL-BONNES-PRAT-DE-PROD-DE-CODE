import express from 'express';
import * as YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import * as fs from "node:fs";

import { AddressController } from './adapters/driving/addressController';
import { InMemoryAddressRepo } from "./adapters/driven/inMemoryAddressRepo";
import { AddressService } from "./services/addressService";
import { GpsController } from './adapters/driving/gpsController';
import { HealthRecordController } from './adapters/driving/healthRecordController';
import { GpsService } from './services/gpsService';
import { HealthRecordService } from './services/healthRecordService';
import { inMemoryGpsRepo } from './adapters/driven/inMemoryGpsRepo';
import { PhysicalActivityController } from './adapters/driving/physicalActivityController';
import { PhysicalActivityService } from './services/physicalActivityService';
import { inMemoryHealthRecordRepo } from './adapters/driven/inMemoryHealthRecordRepo';
import { Sqlite3GpsRepo } from './adapters/driven/sqlite3GpsRepo';
import db from "./infra/db/db";
import { Sqlite3HealthRecordRepo } from './adapters/driven/sqlite3HealthRecordRepo';

const app = express();
app.use(express.json());

const addressRepo = new InMemoryAddressRepo();
const gpsRepo = new Sqlite3GpsRepo(db);
const healthRecordRepo = new Sqlite3HealthRecordRepo(db);

const file  = fs.readFileSync('./openapi.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const addressService = new AddressService(addressRepo);
const addressController = new AddressController(addressService);
addressController.registerRoutes(app);

const gpsService = new GpsService(gpsRepo);
const gpsController = new GpsController(gpsService);
gpsController.registerRoutes(app);

const healthRecordService = new HealthRecordService(healthRecordRepo);
const healthRecordController = new HealthRecordController(healthRecordService);
healthRecordController.registerRoutes(app);

const physicalActivityService = new PhysicalActivityService(gpsRepo, healthRecordRepo);
const physicalActivityController = new PhysicalActivityController(physicalActivityService);
physicalActivityController.registerRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
});
