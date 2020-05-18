import { Router } from 'express';
import { getRouters } from './get-routers';

// global router
const rootRouter = Router();

(async () => {
  const routers = await getRouters();
  // inject routes in express
  routers.forEach(({ route, router }) => {
    rootRouter.use(route, router);
  });
})();

export default rootRouter;
