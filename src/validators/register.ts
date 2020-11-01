import * as validator from 'express-validator';

export const registerValidations = [
  validator
    .body('email', 'Enter email')
    .isString()
    .isEmail()
    .withMessage('Wrong email'),
  validator
    .body('fullname', 'Enter full name')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    })
    .withMessage('full name length mast be more than 2 less then 40'),
  validator
    .body('username', 'Enter user name')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    })
    .withMessage('username length must be more than 2 less then 40'),
  validator
    .body('password', 'Enter password')
    .isString()
    .isLength({
      min: 6,
    })
    .withMessage('min password length is 6 symbols')
    .custom((value, { req }) => {
      if (value !== req.body.password2) {
        throw new Error("Passwords didn't match");
      }
      return true;
    }),
];
