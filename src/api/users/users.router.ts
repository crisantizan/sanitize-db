import express from 'express';

const usersRouter = express.Router();
// route name to handle
const usersRoute = '/users';

usersRouter.get('/', (req, res) => {
  res.json({ message: 'works' });
});

export { usersRouter, usersRoute };
