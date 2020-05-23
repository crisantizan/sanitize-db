import joi from '@hapi/joi';
import { AnalizeFileColumns } from '@/modules/index/index.type';

/** joi user create schema */
export const analyzeFileSchema = joi.object<AnalizeFileColumns>({
  filename: joi.string().required(),
  keyword: joi.string().required(),
});
