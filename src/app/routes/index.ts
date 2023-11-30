import { Router } from 'express';
import { studentRoutes } from '../modules/students/students.routes';
import { userRouter } from '../modules/users/users.routes';

const router = Router();

const pathRouter = [
  {
    path: '/users',
    route: userRouter,
  },
  {
    path: '/students',
    route: studentRoutes,
  },
];

pathRouter.map((route) => router.use(route.path, route.route));

export default router;