import { Router } from 'express';
import { HttpStatus } from '@/common/enums';

/** add index signature */
export interface Index<T> {
  [key: string]: T;
}

/** environment mode */
export type EnvMode = 'development' | 'production';

/** express router props in controllers */
export interface ControllerRouteProps {
  route: string;
  router: Router;
}

/** props to return (for every field) when error has ocurred in a field */
export interface ErrorFieldObject {
  field: string;
  message: string;
}

/** properties to return by a service http */
export interface ServiceResponse<T> {
  code: HttpStatus;
  response: T;
}
