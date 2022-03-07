import { Router } from 'express';
import routeUser from './users/routes';
import routeAuth from './auth/routes';
import routeTransaction from './transactions/routes';
const routes = Router();

routes.use('/users', routeUser);
routes.use('/auth', routeAuth);
routes.use('/transactions', routeTransaction);
export default routes;
