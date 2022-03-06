import { Router } from 'express';
import { validationMiddleware } from '@mobixtec/visse';
import { login, refresh } from './controllers';
import { loginValidation } from './validation';
const routes = Router();

routes.post('/login', loginValidation(), validationMiddleware, login);
routes.post('/refresh', refresh);

export default routes;
