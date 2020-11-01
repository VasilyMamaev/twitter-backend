import dotenv from 'dotenv';

dotenv.config();

import './core/db';

import express from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidations } from './validators/register';

const app: express.Application = express();

const PORT = process.env.PORT || 8888;

app.use(express.json());

app.get('/users', UserCtrl.index);
app.post('/users', registerValidations, UserCtrl.create);
app.get('/users/verify', registerValidations, UserCtrl.verify);
// app.patch('/users', UserCtrl.index);
// app.delete('/users', UserCtrl.index);

app.listen(PORT, (): void => {
  console.log(`Server has been started on port: ${PORT}`);
});
