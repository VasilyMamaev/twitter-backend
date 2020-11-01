import express from 'express';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';
import { sendEmail } from '../utils/sendEmail';
import { UserModelInterface } from '../models/UserModel';

class UserController {
  async index(_: express.Request, res: express.Response): Promise<void> {
    try {
      const users = await UserModel.find({}).exec();

      res.json({
        status: 'success',
        data: users,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        errors: JSON.stringify(err),
      });
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ status: 'error', errors: errors.array() });
        return;
      }

      const data: UserModelInterface = {
        email: req.body.email,
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        confirmHash: generateMD5(
          process.env.SECRET_KEY || Math.random().toString()
        ),
      };

      const user = await UserModel.create(data);

      res.json({
        status: 'success',
        data: user,
      });

      sendEmail(
        'admin@twitclone.com',
        data.email,
        'Twit-clone email confirm',
        `To confirm your mail, go to <a href="http://localhost:${
          process.env.PORT || 8888
        }/users/verify?hash=${data.confirmHash}">link</a>`,
        (err: Error | null) => {
          if (err) {
            res.status(500).json({
              status: 'error',
              message: err,
            });
          } else {
            res.json({
              status: 'success',
              data: user,
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: 'error',
        message: err,
      });
    }
  }

  async verify(req: express.Request, res: express.Response): Promise<void> {
    try {
      const hash = req.query.hash;
      if (!hash) res.status(400).send();

      const user = await UserModel.findOne({
        confirmHash: hash?.toString(),
      }).exec();

      if (user) {
        user.confirmed = true;
        user.save();

        res.status(201).json({
          status: 'success',
        });
      } else {
        res.status(404).json({
          status: 'error',
          message: "User don't exist",
        });
      }
    } catch (err) {
      res.json({
        status: 'error',
        errors: JSON.stringify(err),
      });
    }
  }
}

export const UserCtrl = new UserController();
