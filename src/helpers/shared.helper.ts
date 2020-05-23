import { EnvMode, ErrorFieldObject } from '@/typings/shared.type';
import { join as joinPath } from 'path';

/** get envirironment variables path */
export function getEnvVariablesPath(envMode: EnvMode) {
  return joinPath(__dirname, '..', '..', `.env.${envMode}`);
}

/** generate the error object of field */
export function errorFieldObject(
  field: string,
  message: string,
): ErrorFieldObject {
  return { field, message };
}

export function escapeRegExp(string: string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}
