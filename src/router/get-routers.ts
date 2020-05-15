import { readdirSync } from 'fs';
import { join } from 'path';
import { ControllerRouteProps } from '@/typings/shared.typing';

function autoImport() {
  const modulesPath = join(__dirname, '..', 'modules');
  const modules = readdirSync(modulesPath);
  const controllers: any[] = [];

  modules.forEach(folder => {
    const files = readdirSync(join(modulesPath, folder));
    const controllerFile = files.filter(f => /\.controller\.ts$/.test(f))[0];
    const controller = require(`@/modules/${folder}/${controllerFile}`);

    if (!controller.default) {
      throw new Error(
        'Controllers should be exported by: export default, no custom names',
      );
    }
    controllers.push(controller.default);
  });

  return controllers;
}

/** extract only route props */
function getRouters(controllers: any[]): ControllerRouteProps[] {
  return controllers.map((Controller: any) => {
    const instance: ControllerRouteProps = new Controller();

    // route name and router
    return { route: instance.route, router: instance.router };
  });
}

export default getRouters(autoImport());
