import { EnvMode } from '@/typings/shared.typing';
import { join as joinPath } from 'path';

/** get envirironment variables path */
export function getEnvVariablesPath(envMode: EnvMode) {
  return joinPath(__dirname, '..', '..', `.env.${envMode}`);
}
