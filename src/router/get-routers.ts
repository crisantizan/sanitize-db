import { readdirSync } from 'fs';
import { join } from 'path';
import { ControllerRouteProps } from '@/typings/shared.type';

/** auto import controllers */
async function getControllers(): Promise<any[]> {
  // path of modules folder
  const modulesPath = join(__dirname, '..', 'modules');

  try {
    const modulesDir = readdirSync(modulesPath, { withFileTypes: true });

    const controllers: any[] = [];

    for (const dir of modulesDir) {
      // only folders
      if (dir.isFile()) {
        continue;
      }

      const dirName = dir.name;

      // browse folder, files inside of the current module
      const files = readdirSync(join(modulesPath, dirName));
      // get only the controller file
      const controllerFile = files.filter(f =>
        /.controller.[js|ts]{2}$/.test(f),
      )[0];

      if (!controllerFile) {
        throw new Error(`Module ${dirName} doesn't have a controller file`);
      }

      // import controller
      const controller = await import(`@/modules/${dirName}/${controllerFile}`);
      if (!controller.default) {
        throw new Error(
          'Controllers should be exported by: export default, no custom names',
        );
      }

      controllers.push(controller.default);
    }
    return controllers;
  } catch (error) {
    throw error;
  }
}

/** extract only route props */
export async function getRouters(): Promise<ControllerRouteProps[]> {
  const controllers = await getControllers();

  return controllers.map((Controller: any) => {
    const instance: ControllerRouteProps = new Controller();

    // route name and router
    return { route: instance.route, router: instance.router };
  });
}
