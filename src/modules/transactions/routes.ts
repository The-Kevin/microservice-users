import { Router } from 'express';
import passport from 'passport';
import { createTransaction, listTransaction } from './controllers';

const routes = Router();

routes
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), listTransaction)
  .post(passport.authenticate('jwt', { session: false }), createTransaction);
export default routes;
