import { Request, Response, NextFunction } from 'express';
import { TokenData } from 'utils/passport-helper';
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
    return next(new Error(error.message));
  }
};

export const listUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenData = req.user as TokenData;
    const users = await UserModel.aggregate([
      {
        $match: {
          $expr: {
            $not: {
              _id: tokenData._id,
            },
          },
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    return res.status(200).json(users);
  } catch (error) {
    return next(new Error(error.message));
  }
};
