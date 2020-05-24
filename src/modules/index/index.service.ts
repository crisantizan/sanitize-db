import { readFileSync, pathExists, writeJSON, unlinkSync } from 'fs-extra';
import { Service } from '@/services/service';
import { HttpStatus } from '@/common/enums';

import { MulterFile, Index } from '@/typings/shared.type';
import { AnalizeFileColumns, SanitizeDB } from './index.type';
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
    try {
      const path = await this._validateAndGeneratePath(filename);

      const content = readFileSync(path, { flag: 'r', encoding: 'utf-8' });
      // get columns
      const columns = content.split('\r\n');
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

  public async sanitizeDB({ columns, filter, filename, keyword }: SanitizeDB) {
    try {
      const path = await this._validateAndGeneratePath(filename);
      const content = readFileSync(path, { flag: 'r', encoding: 'utf-8' });

      // get columns
      const rows = content.split('\r\n');

      const sanitized: any[] = [];

      let index = 0;
      for (let row of rows) {
        // remove last keyword if there's
        row = row.replace(new RegExp(`${escapeRegExp(keyword)}$`), '');

        const fields = row.split(keyword);

        // new object
        const obj: Index<string> = {};

        columns.forEach((value, idx) => {
          // get only filtered fields
          if (filter.some(v => v === value)) {
            obj[value] = fields[idx] || '';
          }
        });

        // add
        sanitized[index] = obj;

        index++;
      }

      const jsonFile = `${Date.now()}.json`;
      // create JSON file
      await writeJSON(generatePath('public', jsonFile), sanitized);
      // remove txt file
      unlinkSync(path);

      return this.response(HttpStatus.OK, { jsonFile });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async _validateAndGeneratePath(filename: string) {
    const path = generatePath('uploads', filename);

    if (!(await pathExists(path))) {
      throw this.response(HttpStatus.NOT_FOUND, 'Database file not found');
    }

    return path;
  }
}
