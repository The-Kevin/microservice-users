import { Request, Response, NextFunction } from 'express';
import UserModel, { User, UserSerialize } from '../users/models/User';
import RefreshToken from '../auth/models/RefreshToken';
import uuid4 from 'uuid4';
import { TokenData, promisifyLocalAuthenticate, getToken } from '../../utils/passport-helper';

async function handleLogin(user: User, res: Response) {
  const { accessToken, expiresIn } = await getToken(user);

  const refreshToken = uuid4();

  const checkRefresh = await RefreshToken.exists({ user_id: user._id });
  if (!checkRefresh) {
    await RefreshToken.updateMany({ user_id: user._id }, { expired: true });
  }

  const token = new RefreshToken({
    token: refreshToken,
    user_id: user._id,
  });

  await token.save();

  const responseJson = {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer',
    expires_in: expiresIn,
  };

  return res.status(200).json(responseJson).end();
}
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await promisifyLocalAuthenticate(req, res, next);
    console.log('wtf');

    await handleLogin(user as User, res);
  } catch (error) {
    console.log(error);
    next(new Error(error));
  }
};
