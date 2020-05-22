import { readFileSync } from 'fs-extra';
import { Service } from '@/services/service';
import { HttpStatus } from '@/common/enums';

export class IndexService extends Service {
  constructor() {
    super();
  }

  public analizeFile(file: Express.Multer.File) {
    try {
      // read file content
      const data = readFileSync(file.path, { flag: 'r', encoding: 'utf-8' });
      // if contains columns
      const { length } = data.split('\n');

      if (!length) {
        throw this.response(
          HttpStatus.BAD_REQUEST,
          'Database file badly formatted',
        );
      }

      return this.response(HttpStatus.OK, { filename: file.filename });
    } catch (error) {
      console.error(error);
      throw this.response(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
      );
    }
  }
}
