import { check, ValidationChain } from 'express-validator';
import UserModel from '../users/models/User';

export const loginValidation = (): ValidationChain[] => [
  check('email')
    .exists()
    .withMessage({
      id: 'required-email',
      message: 'The email value is required.',
    })
    .bail()
    .isString()
    .notEmpty()
    .isEmail()
    .withMessage({
      id: 'invalid-email',
      message: 'The email value is invalid.',
    })
    .custom(async (email: string) => {
      const check: boolean = await UserModel.exists({ email });
      if (check) return Promise.reject();

      return Promise.resolve();
    })
    .withMessage({
      id: 'invalid-email',
      message: 'The email value not exist in our system.',
    }),
  check('password')
    .exists()
    .withMessage({
      id: 'required-password',
      message: 'The password value is required.',
    })
    .bail()
    .isString()
    .notEmpty()
    .withMessage({
      id: 'invalid-password',
      message: 'The password value is invalid.',
    }),
];
