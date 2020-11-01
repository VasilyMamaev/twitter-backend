import mongoose from 'mongoose';

mongoose.connect(
  process.env.MONGODB_URI ||
    'mongodb+srv://vasily:47052Aa!@cluster0.bhq1v.mongodb.net/twit-clone',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', () => {
  console.log('mongoDb connected...');
});

export { db, mongoose };
