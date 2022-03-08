import { Router } from 'express';
import { validationMiddleware } from '@mobixtec/visse';
import { login, refresh } from './controllers';
const routes = Router();

routes.post('/login', login);
routes.post('/refresh', refresh);

export default routes;
