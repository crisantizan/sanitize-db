import { Service } from '@/services/service';

export class UserService extends Service {
  // repository here

  /** get all users simulation */
  public getAll(): string[] {
    return ['Juan', 'Álvaro', 'Luis'];
  }
}
