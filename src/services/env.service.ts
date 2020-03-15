import { readFileSync } from 'fs';
import { parse as dotenvParse, DotenvParseOutput } from 'dotenv';
import Joi from '@hapi/joi';
import { getEnvVariablesPath } from '@/helpers/shared.helper';

interface EnvConfig {
  PORT: string;
}

/** get environment variables */
export class EnvService {
  private envConfig!: EnvConfig;
  private static instance: EnvService;

  constructor() {
    if (!!EnvService.instance) {
      return EnvService.instance;
    }

    // first instance
    const filePath = getEnvVariablesPath(process.env.NODE_ENV);
    const config = dotenvParse(readFileSync(filePath));

    this.envConfig = this.validateInput(config);
    EnvService.instance = this;

    return this;
  }

  /** validate properties */
  private validateInput(envConfig: DotenvParseOutput): EnvConfig {
    const schema = Joi.object({
      PORT: Joi.number().default(3000),
    });

    const { error, value } = schema.validate(envConfig);

    if (!!error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
  }

  /** app port */
  get port(): number {
    return Number(this.envConfig.PORT);
  }
}
