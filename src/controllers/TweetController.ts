import dotenv from 'dotenv';
import express from 'express';
import { validationResult } from 'express-validator';

import { TweetModel, TweetModelInterface } from '../models/TweetModel';
import { UserModelDocumentInterface, UserModelInterface } from '../models/UserModel';
import { isValidObjectId } from '../utils/isValidObjectId';

dotenv.config();

class TweetController {
  async index(_: express.Request, res: express.Response): Promise<void> {
    try {
      const tweets = await TweetModel.find({}).exec();

      res.json({
        status: 'success',
        data: tweets,
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
      const tweetId = req.params.id;

      if (!isValidObjectId(tweetId)) {
        res
          .status(404)
          .json({
            status: 'error',
            message: "can't find tweet",
          })
          .send();
        return;
      }

      const tweet = await TweetModel.findById(tweetId).exec();

      res.json({
        status: 'success',
        data: tweet,
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
      const user = req.user as UserModelInterface;

      if (user?._id) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({ status: 'error', errors: errors.array() });
          return;
        }

        const data: TweetModelInterface = {
          text: req.body.text,
          user: user._id,
        };

        const tweet = await TweetModel.create(data);

        res.json({
          status: 'success',
          data: tweet,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 'error',
        errors: JSON.stringify(err),
      });
    }
  }

  async delete(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as UserModelDocumentInterface;

      if (user) {
        const tweetId = req.params.id;

        if (!isValidObjectId(tweetId)) {
          res.status(400).send();
          return;
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet) {
          if (String(tweet.user) === String(user._id)) {
            tweet.remove();
            res.send();
          } else {
            res
              .status(403)
              .json({
                status: 'error',
                message: "you don't have enough rights",
              })
              .send();
          }
        } else {
          res
            .status(404)
            .json({
              status: 'error',
              message: "tweet doesn't exist",
            })
            .send();
        }
      }
    } catch (err) {
      res.status(500).json({
        status: 'error',
        errors: JSON.stringify(err),
      });
    }
  }

  async update(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as UserModelDocumentInterface;

      if (user) {
        const tweetId = req.params.id;

        if (!isValidObjectId(tweetId)) {
          res.status(400).send();
          return;
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet) {
          if (String(tweet.user) === String(user._id)) {
            const text = req.body.text;
            tweet.text = text;
            tweet.save();
            res.send();
          } else {
            res
              .status(403)
              .json({
                status: 'error',
                message: "you don't have enough rights",
              })
              .send();
          }
        } else {
          res
            .status(404)
            .json({
              status: 'error',
              message: "tweet doesn't exist",
            })
            .send();
        }
      }
    } catch (err) {
      res.status(500).json({
        status: 'error',
        errors: JSON.stringify(err),
      });
    }
  }
}

export const TweetCtrl = new TweetController();
