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
import { HttpStatus } from './common/enums';

const app = express();
const { port, inDevelopment, env } = new EnvService();

/** -------------------- SETTINGS -------------------- */
app.set('port', port);
app.set('environment', env);

/** -------------- GLOBAL MIDDLEWARES --------------- */

app
  .use(cors(), express.json())
  .use(helmet(), compression({ filter: shouldCompressMiddleware }));

// use only in development
if (inDevelopment) {
  app.use(morgan('dev'));
}

// transform responses
app.use(transformResponsePipe); // comment this if you don't use it

// global error handler
app.use(globalErrorHandlerMiddleware);

/** -------------------- ROUTER -------------------- */

// redirect from root to /api
app.get('/', (_, res) => res.redirect('/api'));

// this is innecesary, only for example
app.get('/api', (_, res) => {
  // display available routes
  res.json({
    availableRoutes: ['GET /api/users'],
  });
});

// set global prefix and use all routes
app.use('/api', router);

// not found path
app.use('*', (_, res) => {
  res.status(HttpStatus.NOT_FOUND).json('Path not available');
});

export default app;
