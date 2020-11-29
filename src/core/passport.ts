import dotenv from 'dotenv';
import passport from 'passport';
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { UserModel, UserModelInterface } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';

dotenv.config();

passport.use(
  new LocalStrategy(
    async (username, password, done): Promise<void> => {
      try {
        const user = await UserModel.findOne({
          $or: [{ email: username }, { username }],
        }).exec();

        if (!user) {
          return done(null, false);
        }
        if (user.password === generateMD5(password + process.env.SECRET_KEY)) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY || '123',
      jwtFromRequest: ExtractJwt.fromHeader('token'),
    },
    async (payload: { data: UserModelInterface }, done) => {
      try {
        const user = await UserModel.findById(payload.data._id).exec();

        if (user) {
          return done(null, user);
        }
        done(null, false);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user: UserModelInterface, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});

export { passport };
