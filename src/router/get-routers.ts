import { readdirSync } from 'fs';
import { join } from 'path';
import { ControllerRouteProps } from '@/typings/shared.typing';

/** auto import controllers */
function autoImport() {
  // path of modules folder
  const modulesPath = join(__dirname, '..', 'modules');

  try {
    const modulesFolder = readdirSync(modulesPath);

    const controllers: any[] = [];

    modulesFolder.forEach(folder => {
      // browse folder, files inside of the current module
      const files = readdirSync(join(modulesPath, folder));
      // get only the controller file
      const controllerFile = files.filter(f => /\.controller\.ts$/.test(f))[0];

      if (!controllerFile) {
        throw new Error(`Module ${folder} doesn't have a controller file`);
      }

      // import controller
      const controller = require(`@/modules/${folder}/${controllerFile}`);

      if (!controller.default) {
        throw new Error(
          'Controllers should be exported by: export default, no custom names',
        );
      }

      controllers.push(controller.default);
    });
    return controllers;
  } catch (error) {
    throw error;
  }
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
