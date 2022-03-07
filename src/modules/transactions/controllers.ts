import { Request, Response, NextFunction } from 'express';
import { TokenData } from 'utils/passport-helper';
import amqp from '../../config/connection';

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenData = req.user as TokenData;

    const payload = {
      user_id: tokenData._id,
      receiver_id: req.body.receiver_id,
      type: req.body.type,
      amount: req.body.amount,
    };

    const channel = (await amqp).createChannel();

    (await channel).assertQueue('transaction', {
      durable: false,
    });
    (await channel).sendToQueue('transaction', Buffer.from(JSON.stringify(payload)));

    return res.status(200).json(payload);
  } catch (error) {
    return next(new Error());
  }
};
