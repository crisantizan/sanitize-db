import { ServiceResponse } from '@/typings/shared.typing';
import { HttpStatus } from '@/common/enums';

/** generate properties to return by a service http */
export function serviceResponse<T>(
  code: HttpStatus,
  response: T,
): ServiceResponse<T> {
  return { code, response };
}
