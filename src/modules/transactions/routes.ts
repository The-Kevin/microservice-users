import { Router } from 'express';
import passport from 'passport';
import { createTransaction } from './controllers';
const routes = Router();

routes.route('/').post(passport.authenticate('jwt', { session: false }), createTransaction);
export default routes;
