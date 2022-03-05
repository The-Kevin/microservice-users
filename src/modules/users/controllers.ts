import { Request, Response, NextFunction } from 'express';
import UserModel, { User, UserSerialize } from './models/User';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const newUser: User = new UserModel({
      first_name,
      last_name,
      email,
      password,
    });

    await newUser.save();

    return res.status(201).json(newUser.serialize() as UserSerialize);
  } catch (error) {
    return next(new Error(error));
  }
};
