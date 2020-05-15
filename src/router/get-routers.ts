import { readdirSync } from 'fs';
import { join } from 'path';
import { ControllerRouteProps } from '@/typings/shared.typing';

/** auto import controllers */
function autoImport() {
  // path of modules folder
  const modulesPath = join(__dirname, '..', 'modules');

  try {
    const modulesDir = readdirSync(modulesPath, { withFileTypes: true });

    const controllers: any[] = [];

    modulesDir.forEach(dir => {
      // only folders
      if (dir.isFile()) {
        return;
      }

      const dirName = dir.name;

      // browse folder, files inside of the current module
      const files = readdirSync(join(modulesPath, dirName));
      // get only the controller file
      const controllerFile = files.filter(f => /\.controller\.ts$/.test(f))[0];

      if (!controllerFile) {
        throw new Error(`Module ${dirName} doesn't have a controller file`);
      }

      // import controller
      const controller = require(`@/modules/${dirName}/${controllerFile}`);

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
