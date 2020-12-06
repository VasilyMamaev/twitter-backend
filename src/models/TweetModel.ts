import { Document, model, Schema } from 'mongoose';

import { UserModelInterface } from './UserModel';

export const MAX_TWEET_LENGTH = 140;

export interface TweetModelInterface {
  _id?: string;
  text: string;
  user: UserModelInterface | string;
}

export type TweetModelDocumentInterface = TweetModelInterface & Document;

const TweetSchema = new Schema<TweetModelInterface>({
  text: {
    required: true,
    type: String,
    maxlength: MAX_TWEET_LENGTH,
  },
  user: {
    required: true,
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
});

export const TweetModel = model<TweetModelDocumentInterface>(
  'Tweet',
  TweetSchema
);
