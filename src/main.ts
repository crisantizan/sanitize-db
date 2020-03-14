import { config } from 'dotenv';
import { getEnvVariablesPath } from '@/helpers/shared.helper';

// load environment variables according to mode
config({
  path: getEnvVariablesPath(process.env.NODE_ENV),
});

// register alias in javascript files
if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

import './app';
