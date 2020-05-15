// register alias in javascript files
if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

import app from '@/app';
import { config } from 'dotenv';
import { getEnvVariablesPath } from '@/helpers/shared.helper';
import { EnvMode } from './typings/shared.type';

// load environment variables according to mode
config({
  path: getEnvVariablesPath(process.env.NODE_ENV as EnvMode),
});

function bootstrap() {
  const [port, env] = [app.get('port'), app.get('environment')];

  app.listen(port, () =>
    console.info(`[${env}] server running on port: ${port}`),
  );
}

bootstrap();
