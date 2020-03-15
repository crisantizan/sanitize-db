import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { EnvService } from './services/env.service';

const app = express();
const { port, inDevelopment, env } = new EnvService();

// settings
app.set('port', port);
app.set('environment', env)
// global middlewares
app.use(express.json()).use(helmet());

// middlewares only in development
if (inDevelopment) {
  app.use(morgan('dev'));
}

export default app;
