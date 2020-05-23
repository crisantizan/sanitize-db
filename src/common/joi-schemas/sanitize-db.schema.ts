import joi from '@hapi/joi';
import { SanitizeDB } from '@/modules/index/index.type';

/** joi user create schema */
export const sanitizeDBSchema = joi.object<SanitizeDB>({
  columns: joi
    .array()
    .items(joi.string().required())
    .required(),
  filter: joi
    .array()
    .items(joi.string().required())
    .required(),
  filename: joi.string().required(),
});
