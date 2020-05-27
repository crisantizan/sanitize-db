// register alias in javascript files
if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

import app from '@/app';
import { config } from 'dotenv';
import { getEnvVariablesPath } from '@/helpers/shared.helper';
import { EnvMode } from './typings/shared.type';
import { testConnection } from '@/database/connection';

// load environment variables according to mode
config({
  path: getEnvVariablesPath(process.env.NODE_ENV as EnvMode),
});

async function bootstrap() {
  try {
    // test database connection
    await testConnection();

    const [port, env] = [app.get('port'), app.get('environment')];

    if (env === 'development') {
      console.log('Database connection successfully!');
    }

    app.listen(port, () =>
      console.info(`[${env}] server running on port: ${port}`),
    );
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
