import { check, ValidationChain } from 'express-validator';
import { handlePageAndLimitQuery } from '../../utils/validationChain';
import UserModel from './models/User';

export const createUserValidation = (): ValidationChain[] => [
  check('first_name')
    .exists()
    .withMessage({
      id: 'required-first-name',
      message: 'The first name value is required.',
    })
    .bail()
    .isString()
    .notEmpty()
    .withMessage({
      id: 'invalid-first-name',
      message: 'The first name value is invalid.',
    }),
  check('last_name')
    .exists()
    .withMessage({
      id: 'required-last-name',
      message: 'The last name value is required.',
    })
    .bail()
    .isString()
    .notEmpty()
    .withMessage({
      id: 'invalid-last-name',
      message: 'The last name value is invalid.',
    }),
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
      if (!check) return Promise.reject();

      return Promise.resolve();
    })
    .withMessage({
      id: 'invalid-email',
      message: 'The email value already exist in our system.',
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

export const listUserValidation = (): ValidationChain[] => [...handlePageAndLimitQuery];
