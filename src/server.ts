import './core/db';

import dotenv from 'dotenv';
import express from 'express';

import { TweetCtrl } from './controllers/TweetController';
import { UserCtrl } from './controllers/UserController';
import { passport } from './core/passport';
import { createTweetValidations } from './validators/createTweet';
import { registerValidations } from './validators/register';

dotenv.config();

const app: express.Application = express();

const PORT = process.env.PORT || 8888;

app.use(express.json());
app.use(passport.initialize());

// ROUTES
app.get('/auth/verify', registerValidations, UserCtrl.verify);
app.post('/auth/register', registerValidations, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);

app.get('/users', UserCtrl.index);
app.get(
  '/users/me',
  passport.authenticate('jwt', { session: false }),
  UserCtrl.getUserInfo
);
app.get('/users/:id', UserCtrl.show);

app.get('/tweets', TweetCtrl.index);
app.get('/tweets/:id', TweetCtrl.show);
app.post(
  '/tweets',
  passport.authenticate('jwt'),
  createTweetValidations,
  TweetCtrl.create
);
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetCtrl.delete);

app.listen(PORT, (): void => {
  console.log(`Server has been started on port: ${PORT}`);
});
