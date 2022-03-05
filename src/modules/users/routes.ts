import { Router } from 'express';
import { createUser } from './controllers';

const routes = Router();

routes.route('/').post(createUser);
export default routes;
