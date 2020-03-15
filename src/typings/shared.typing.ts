import { Router } from 'express';

/** environment mode */
export type EnvMode = 'development' | 'production';

/** express router props in controllers */
export interface ControllerRouteProps {
  route: string;
  router: Router;
}
