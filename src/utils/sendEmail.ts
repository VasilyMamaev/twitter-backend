import SendMessageInfo from 'nodemailer/lib/sendmail-transport';

import mailer from '../core/mailer';

export const sendEmail = (
  obj: { emailFrom: string; emailTo: string; subject: string; html: string },
  callback?: (err: Error | null, info: SendMessageInfo) => void
) => {
  mailer.sendMail(
    {
      from: obj.emailFrom,
      to: obj.emailTo,
      subject: obj.subject,
      html: obj.html,
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
