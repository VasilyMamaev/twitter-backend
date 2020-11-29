import dotenv from 'dotenv';
import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { mongoose } from '../core/db';
import { UserModel, UserModelDocumentInterface, UserModelInterface } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';
import { sendEmail } from '../utils/sendEmail';

dotenv.config();

const isValidObjectId = mongoose.Types.ObjectId.isValid;

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

  async show(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = req.params.id;

      if (!isValidObjectId(userId)) {
        res
          .status(404)
          .json({
            status: 'error',
            message: "can't find user",
          })
          .send();
        return;
      }

      const user = await UserModel.findById(userId).exec();

      res.json({
        status: 'success',
        data: user,
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
        password: generateMD5(req.body.password + process.env.SECRET_KEY),
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
        {
          emailFrom: 'admin@twitclone.com',
          emailTo: data.email,
          subject: 'Twit-clone email confirm',
          html: `To confirm your mail, go to <a href="http://localhost:${
            process.env.PORT || 8888
          }/auth/verify?hash=${data.confirmHash}">link</a>`,
        },
        // FIXME: something wrong with sending mail
        (err: Error | null) => {
          if (err) {
            res
              .status(500)
              .json({
                status: 'error',
                message: err,
              })
              .send();
          } else {
            res
              .json({
                status: 'success',
                data: user,
              })
              .send();
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

  async afterLogin(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user
        ? (req.user as UserModelDocumentInterface).toJSON()
        : undefined;
      res.json({
        status: 'success',
        data: {
          ...user,
          token: jwt.sign({ data: req.user }, process.env.SECRET_KEY || '123', {
            expiresIn: 5 * 60,
          }),
        },
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        errors: JSON.stringify(err),
      });
    }
  }

  async getUserInfo(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const user = req.user
        ? (req.user as UserModelDocumentInterface).toJSON()
        : undefined;
      res.json({
        status: 'success',
        data: user,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        errors: JSON.stringify(err),
      });
    }
  }
}

export const UserCtrl = new UserController();
