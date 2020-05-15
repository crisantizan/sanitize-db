import { Service } from '@/services/service';
import { HttpStatus } from '@/common/enums';
import { UserCreate } from './user.type';
import { ServiceResponse } from '@/typings/shared.type';

export class UserService extends Service {
  // repository here

  /** get all users simulation */
  public getAll(): ServiceResponse<string[]> {
    return this.response(HttpStatus.OK, ['Juan', 'Álvaro', 'Luis']);
  }

  /** create a new user */
  public create(data: UserCreate): ServiceResponse<UserCreate> {
    // all services will be return throught this method
    return this.response(HttpStatus.CREATED, data);
  }
}
