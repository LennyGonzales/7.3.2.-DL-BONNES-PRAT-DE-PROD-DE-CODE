import express from 'express';
import * as YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import addressController from './adapters/driving/addressController';
import path from 'path';

const app = express();
app.use(express.json());

const swaggerPath = path.resolve(__dirname, '..', 'openapi.yaml');
const swaggerDoc = YAML.parse(swaggerPath);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/addresses', addressController);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
});
