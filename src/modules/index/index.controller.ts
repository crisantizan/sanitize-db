import { Controller } from '../controller';
import { ControllerRoutes } from '@/typings/controller.type';
import { Request, Response } from 'express';

export default class IndexController extends Controller {
  public route: string = '/';

  constructor() {
    super();
    super.initRoutes(this.routes());
  }

  public async routes(): Promise<ControllerRoutes> {
    return {
      get: [
        {
          path: '',
          handler: this._index.bind(this),
        },
      ],
    };
  }

  private _index(req: Request, res: Response) {
    res.render('index');
  }
}
