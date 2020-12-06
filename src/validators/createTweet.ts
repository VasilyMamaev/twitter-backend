import * as validator from 'express-validator';

import { MAX_TWEET_LENGTH } from '../models/TweetModel';

export const createTweetValidations = [
  validator
    .body('text', 'Enter tweet text')
    .isString()
    .isLength({
      min: 2,
      max: MAX_TWEET_LENGTH,
    })
    .withMessage(`Maximum tweet length is ${MAX_TWEET_LENGTH} symbols`),
];
