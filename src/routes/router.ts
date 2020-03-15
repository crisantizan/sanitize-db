import { Router } from 'express';
import routersGroup from './from-controller-to-route';

// global router
const rootRouter = Router();

// inject routes group in express
routersGroup.forEach(({ route, router }) => {
  rootRouter.use(route, router);
});

export default rootRouter;
