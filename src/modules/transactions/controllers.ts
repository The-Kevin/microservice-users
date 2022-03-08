import { Request, Response, NextFunction } from 'express';
import { TokenData } from 'utils/passport-helper';
import grcpClientTransaction from './utils';
export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenData = req.user as TokenData;
    const { amount, receiver_id } = req.body;

    grcpClientTransaction.createTransaction(
      { _id: tokenData._id, amount, receiver_id },
      (error, response) => {
        if (error) {
          return res.json(error);
        }
        return res.status(200).json(response);
      },
    );
  } catch (error) {
    return next(new Error(error.message));
  }
};

export const listTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenData = req.user as TokenData;

    grcpClientTransaction.listTransaction({ _id: tokenData._id }, (error, response) => {
      if (error) {
        return res.json(error);
      }
      return res.status(200).json(response);
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};
