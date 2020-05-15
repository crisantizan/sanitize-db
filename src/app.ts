import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import router from '@/router';

import { EnvService } from './services/env.service';
import { transformResponsePipe } from '@/http/pipes';
import {
  shouldCompressMiddleware,
  globalErrorHandlerMiddleware,
} from '@/http/middlewares';

const app = express();
const { port, inDevelopment, env } = new EnvService();

// settings
app.set('port', port);
app.set('environment', env);

// global middlewares
app
  .use(cors(), express.json())
  .use(helmet(), compression({ filter: shouldCompressMiddleware }));

// use only in development
if (inDevelopment) {
  app.use(morgan('dev'));
}

// transform responses
app.use(transformResponsePipe); // comment this if you don't use it

// redirect from root to /api
app.get('/', (_, res) => res.redirect('/api'));

// this is innecesary, only for example
app.get('/api', (_, res) => {
  // display available routes
  res.json(['/api/users', '/api/roles']);
});

// set global prefix
app.use('/api', router);

// global error handler
app.use(globalErrorHandlerMiddleware);

export default app;
