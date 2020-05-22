import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import favicon from 'serve-favicon';
import { join } from 'path';

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
app
  .set('port', port)
  .set('environment', env)
  .set('views', join(__dirname, 'views'))
  .set('view engine', 'pug');

/** -------------- GLOBAL MIDDLEWARES --------------- */

app
  /** serve static files */
  .use('/static', express.static(join(__dirname, 'public')))
  .use(favicon(join(__dirname, 'public', 'favicon.ico')))
  /** api */
  .use(cors(), express.json())
  .use(helmet(), compression({ filter: shouldCompressMiddleware }));

// use only in development
if (inDevelopment) {
  app.use(morgan('dev'));
}

// transform responses
app.use(transformResponsePipe); // comment this if you don't use it

/** -------------------- ROUTER -------------------- */

app.use(router);

// global error handler
app.use(globalErrorHandlerMiddleware);

// not found path
app.use('*', (_, res) => {
  res.status(HttpStatus.NOT_FOUND).json('Path not available');
});

export default app;
