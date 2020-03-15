import express from 'express';

const rolesRouter = express.Router();
// route name to handle
const rolesRoute = '/roles';

rolesRouter.get('/', (req, res) => {
  res.json({ message: `route ${rolesRoute}` });
});

export { rolesRouter, rolesRoute };
