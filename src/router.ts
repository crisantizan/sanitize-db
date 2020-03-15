import express from 'express';
import { usersRouter, usersRoute } from '@/api/users/users.router';
import { rolesRoute, rolesRouter } from './api/roles/roles.router';

// global router
const router = express.Router();

// handle all petition (with all methods) that input to /users
router.use(usersRoute, usersRouter).use(rolesRoute, rolesRouter);

export default router;
