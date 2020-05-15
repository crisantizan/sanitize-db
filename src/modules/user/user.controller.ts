import { Request, Response } from 'express';
import { IController, ControllerRoutes } from '@/typings/controller.typing';
import { UserService } from './user.service';
import { Controller } from '../controller';

class UserController extends Controller implements IController {
  public route: string = '/users';

  constructor(private readonly _userService = new UserService()) {
    super();
    super.initRoutes(this.routes());
  }

  /**
   * important: use .bind(this) in all methods that you use
   */
  public async routes(): Promise<ControllerRoutes> {
    return {
      /** GET requests */
      get: [
        {
          path: '/',
          handler: this._index.bind(this),
        },
      ],
    };
  }

  /** ------------------- HANDLERS ----------------- */

  private _index(_: Request, res: Response) {
    return res.json({ message: this._userService.getAll() });
  }
}

export default UserController;
