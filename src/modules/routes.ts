import { Router } from 'express';
import routeUser from './users/routes';
import routeAuth from './auth/routes';
const routes = Router();

routes.use('/users', routeUser);
routes.use('/auth', routeAuth);
export default routes;
