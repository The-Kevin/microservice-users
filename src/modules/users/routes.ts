import { Router } from 'express';
import passport from 'passport';
import { createUser, listUser } from './controllers';

const routes = Router();

routes
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), listUser)
  .post(createUser);
export default routes;
