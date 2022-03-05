import passport from 'passport';
import passportJwt from 'passport-jwt';
import jwt from 'jsonwebtoken';
import passportLocal from 'passport-local';
import UserModel, { User } from '../modules/users/models/User';
import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
config();
export interface TokenData {
  _id: string;
}
const JWT_AUDIENCE = ''; //@TODO set email by env
const JWT_ISSUER = '';
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = 4 * 60 * 60;

export const usePassport = (): void => {
  const jwtOpts = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  };

  const localStrategy = new passportLocal.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (
      _req,
      email: string,
      password: string,
      done: (error: Error, user?: User, options?: passportLocal.IVerifyOptions) => void,
    ) => {
      try {
        const user = await UserModel.findOne({
          email,
        }).populate('role.role_id');

        if (user) {
          const passwordMatches = await user.comparePassword(password);
          if (passwordMatches) {
            if (user) {
              return done(null, user, { message: 'Signed in successfully.' });
            } else {
              return done(
                new Error(
                  'The account has not yet been verified. We sent a new email with instructions, check and try again.',
                ),
              );
            }
          }
        }

        return done(new Error('Email and password combination is invalid.'));
      } catch (err) {
        return done(new Error(err.message));
      }
    },
  );

  const jwtStrategy = new passportJwt.Strategy(
    jwtOpts,
    async (payload: { _id: string }, done: passportJwt.VerifiedCallback) => {
      const exists = await UserModel.exists({ _id: payload._id });
      if (!exists) {
        return done(new Error('User not found'));
      } else {
        return done(null, payload);
      }
    },
  );

  passport.use(localStrategy);
  passport.use(jwtStrategy);
};

export const getToken = async (user: User): Promise<{ accessToken: string; expiresIn: number }> => {
  return {
    accessToken: jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
      {
        audience: JWT_AUDIENCE,
        issuer: JWT_ISSUER,
        expiresIn: JWT_EXPIRATION,
      },
    ),
    expiresIn: JWT_EXPIRATION,
  };
};
export const promisifyLocalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<User> =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      'local',
      { session: false, failureRedirect: '/auth/login' },
      async (err, user, info) => {
        if (err) return reject(err);
        if (!user) return reject(new Error(info.message));

        return resolve(user);
      },
    )(req, res, next);
  });
