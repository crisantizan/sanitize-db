import { Router } from 'express';
import routers from './get-routers';

// global router
const rootRouter = Router();

// inject routes in express
routers.forEach(({ route, router }) => {
  rootRouter.use(route, router);
});

export default rootRouter;
