import { Router } from 'express';
import passport from 'passport';
import { createUser, listUser } from './controllers';
import { createUserValidation, listUserValidation } from './validation';
import { validationMiddleware } from '@mobixtec/visse';

const routes = Router();

routes
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), listUserValidation(), listUser)
  .post(createUserValidation(), validationMiddleware, createUser);
export default routes;
