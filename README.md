# `Boilerplate Express + TypeScript`

### `What's it?`

This project is my personal boilerplate to develop express applications with Typescript, with basics configurations to fast start the development.

### `What's include?`

- MVC pattern
- Easy routing
- Path aliases
- Auto import of controllers
- Basic and recommended middlewares
- Request data validator (with [@hapi/joi](https://www.npmjs.com/package/@hapi/joi) package)
- Global response handler
- Global error handler
- Ordened folder structure
- Singleton service to manage environment variables
- Enum with all HTTP status codes

### `Install`

```bash
$ git clone https://github.com/crisantizan/express-ts-boilerplate
$ cd express-ts-boilerplate
$ yarn # or npm install
```

### `Scripts`

- `start`: run in production (after executing "npm run build")
- `serve`: run in development
- `build`: generate js files for production
- `format`: use prettier to format all files
- `format:check`: use prettier to check format status to all files

### `Folders explained`

#### `assets`

Include here all assets of your application: images, videos, and others... when "npm run build" is executed, all files of this folder will be copied to the new production folder.

#### `common`

How his name name indicates, common files will be located here. Files that you can use on anything place of your project. For now, only i just added enums and joi schemas, but you can add others file types in the future.

- `enums`

  Typescipt enums

- `joi-schemas`

  Joi validation schemas

#### `helpers`

Classes, functions and any helper file that you can require to solve a specific problem.

#### `http`

Related files with express.

- `exceptions`

  Add your custom exceptions

- `guards`

  A middleware type but only related with the user authentication and access permissions to your resources.

- `middlewares`

  Any express middleware

- `pipes`

  Middleware type with two use cases:

  - `transformation`

    Transform data and output new, see an <a href="https://github.com/crisantizan/express-ts-boilerplate/blob/master/src/http/pipes/transform-response.pipe.ts" target="_blank">example file</a>.

  - `validation`

    Verify if the input data is valid, see an <a href="https://github.com/crisantizan/express-ts-boilerplate/blob/master/src/http/pipes/validation.pipe.ts" target="_blank">example file</a>.

#### `modules`

Folder that contains files to manage request and responses of your rest api. Each module will be a folder that will have three files:

- `controller`

  Router that handle and manage all http requests of an specific endpoint with direct communication with services. See an <a href="https://github.com/crisantizan/express-ts-boilerplate/blob/master/src/modules/user/user.controller.ts" target="_blank">example file</a>.

- `service`

  Receive the input data and decide what to do with it: save, get, delete or update in database, or make that you like. These always they should a return something. See an <a href="https://github.com/crisantizan/express-ts-boilerplate/blob/master/src/modules/user/user.service.ts" target="_blank">example file</a>.

- `type`

  Typescript types for this module

In the root of modules folder there is a file single, "controller.ts". This is the main controller, of which the rest will be extended and they will inherit his methods and properties.

<p align="center">Cristian Santiz, 2020</p>
