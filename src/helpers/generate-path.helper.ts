import { join } from 'path';

export function generatePath(folder: string, ...entries: string[]) {
  const root = join(__dirname, '..');
  return join(root, folder, ...entries);
}
