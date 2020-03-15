import { Request, Response } from 'express';
import { Router } from 'express';
import { Controller } from '@/typings/controller.typing';
import { UsersService } from './users.service';

export class UsersController implements Controller {
  public router: Router = Router();
  public route: string = '/users';
  private usersService!: UsersService;

  constructor() {
    this.usersService = new UsersService();
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', this.index.bind(this));
  }

  public index(req: Request, res: Response) {
    return res.json({ message: this.usersService.getAll() });
  }
}
