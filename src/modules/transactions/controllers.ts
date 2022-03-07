import { Request, Response, NextFunction } from 'express';
import { TokenData } from 'utils/passport-helper';
import UserModel, { User, UserSerialize } from '../users/models/User';

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    return next(new Error());
  }
};
