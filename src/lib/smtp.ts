import { MailOptions, Options } from 'nodemailer/lib/smtp-transport';
import { env } from '../config/env';
import { InternalServerErrorException } from '@nestjs/common';
import { createTransport } from 'nodemailer';

const options: Options = {
  port: env.MAIL_PORT,
  host: env.MAIL_HOST,
  secure: env.MAIL_SECURE,
  auth: {
    user: env.MAIL_ADDRESS,
    pass: env.MAIL_PASSWORD,
  },
};

export async function sendMail(mail: MailOptions): Promise<void> {
  const transporter = createTransport(options);

  try {
    await transporter
      .verify()
      .then((success: any) => {
        // console.log(success);
        // console.log('Server is ready to take our messages');
      })
      .catch((error: any) => {
        console.error(error);
        throw new InternalServerErrorException(
          'nodemailer verification failed',
        );
      });

    await transporter
      .sendMail(mail)
      .then((info: any) => {
        console.log(info);
      })
      .catch((error: any) => {
        console.error(error);
      });
  } catch (err) {
    console.error(err);
  }
}
