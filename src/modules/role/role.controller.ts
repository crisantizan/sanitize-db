import { Request, Response } from 'express';
import { Router } from 'express';
import { Controller } from '@/typings/controller.typing';

export class RolesController implements Controller {
  public router: Router = Router();
  public route: string = '/roles';

  constructor() {
    this.initRoutes();
  }

  /**
   * important: use .bind(this) in all methods that you use
   */
  public initRoutes() {
    this.router.get('/', this.index.bind(this));
  }

  public index(req: Request, res: Response) {
    return res.json({ message: 'roles works' });
  }
}
