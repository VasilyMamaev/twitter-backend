import mailer from '../core/mailer';
import SendMessageInfo from 'nodemailer/lib/sendmail-transport';

export const sendEmail = (
  emailFrom: string,
  emailTo: string,
  subject: string,
  html: string,
  callback?: (err: Error | null, info: SendMessageInfo) => void
) => {
  mailer.sendMail(
    {
      from: emailFrom,
      to: emailTo,
      subject: subject,
      html: html,
    },
    callback ||
      function (err: Error | null, info: SendMessageInfo) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      }
  );
};
