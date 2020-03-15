import { Router, Request, Response } from 'express';

/** methods and props that all controllers they should have */
export interface Controller {
  /** express router */
  router: Router;
  /** route name that handle the controller */
  route: string;
  /** method to inicializate routes */
  initRoutes(): void;
  /** method handle to home route for the controller */
  index(req: Request, res: Response): void | Response;
}
