import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import router from '@/router';

import { EnvService } from './services/env.service';

const app = express();
const { port, inDevelopment, env } = new EnvService();

// settings
app.set('port', port);
app.set('environment', env);

// global middlewares
app.use(express.json()).use(helmet());

// use only in development
if (inDevelopment) {
  app.use(morgan('dev'));
}

// this is innecesary, only for example
app.get('/', (req, res) => {
  // display available routes
  res.json(['/api/users', '/api/roles']);
});

// set global prefix
app.use('/api', router);

export default app;
