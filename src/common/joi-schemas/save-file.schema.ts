import joi from '@hapi/joi';
import { SaveFileData } from '@/modules/index/index.type';

/** save file schema */
export const saveFileSchema = joi.object<SaveFileData>({
  filename: joi.string().required(),
});
