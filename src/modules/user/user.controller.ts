import { Request, Response } from 'express';
import { IController, ControllerRoutes } from '@/typings/controller.type';
import { UserService } from './user.service';
import { Controller } from '../controller';
import { validationPipe } from '@/http/pipes/validation.pipe';
import { userCreateSchema } from '@/common/joi-schemas';

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
      /** POST requests */
      post: [
        {
          path: '/',
          middlewares: [await validationPipe(userCreateSchema)],
          handler: this._createUser.bind(this),
        },
      ],
    };
  }

  /** ------------------- HANDLERS ----------------- */

  private _index(_: Request, res: Response) {
    const result = this._userService.getAll();

    return this.sendResponse(result, res);
  }

  /** create a new user */
  private _createUser({ body }: Request, res: Response) {
    const result = this._userService.create(body);

    // send customized response easily
    return this.sendResponse(result, res);
  }
}

export default UserController;
