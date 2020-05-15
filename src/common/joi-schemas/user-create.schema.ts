import joi from '@hapi/joi';
import { UserCreate } from '@/modules/user/user.type';

/** joi user create schema */
export const userCreateSchema = joi.object<UserCreate>({
  name: joi.string().required(),
  password: joi.string().required(),
  email: joi
    .string()
    .required()
    .email(),
});
