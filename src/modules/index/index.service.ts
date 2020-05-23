import { readFileSync, pathExists } from 'fs-extra';
import { Service } from '@/services/service';
import { HttpStatus } from '@/common/enums';

import { MulterFile } from '@/typings/shared.type';
import { AnalizeFileColumns } from './index.type';
import { generatePath } from '@/helpers/generate-path.helper';
import { escapeRegExp } from '@/helpers/shared.helper';

export class IndexService extends Service {
  constructor() {
    super();
  }

  public analyzeFileContent(file: MulterFile) {
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
      throw error;
    }
  }

  /** analyze columns and return fields amount */
  public async analyzeFileColumns({ filename, keyword }: AnalizeFileColumns) {
    const path = generatePath('uploads', filename);

    try {
      if (!(await pathExists(path))) {
        throw this.response(HttpStatus.NOT_FOUND, 'Database file not found');
      }

      const content = readFileSync(path, { flag: 'r', encoding: 'utf-8' });
      // get columns
      const columns = content.split('\n');
      let length = 0;

      // escape keyword
      keyword = escapeRegExp(keyword);

      for (let column of columns) {
        // remove last keyword if there's
        column = column.replace(new RegExp(`${keyword}$`), '');

        // search keyword in column
        const count = column.match(new RegExp(keyword, 'g'));

        if (count === null || !count.length) {
          throw this.response(HttpStatus.BAD_REQUEST, 'Keyword invalid');
        }

        // get higher number
        if (count.length > length) {
          length = count.length;
        }
      }

      return this.response(HttpStatus.OK, { columns: length + 1 });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
