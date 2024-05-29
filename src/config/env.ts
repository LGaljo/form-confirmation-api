import * as dotenv from 'dotenv';
import * as process from "node:process";

export interface Env {
  PORT: number;
  HOST: string;
  API_URL: string;
  APP_URL: string;
  MAIL_SENDER_NAME: string;
  MAIL_PASSWORD: string;
  MAIL_ADDRESS: string;
  MAIL_PORT: number;
  MAIL_HOST: string;
  FORM_TEMPLATE_PATH: string;
  FORM_TEMPLATE_NAME: string;
  MAIL_TEMPLATE_PATH: string;
  MAIL_TEMPLATE_NAME: string;
  ICAL_EVENT: string;
}

dotenv.config();

export const env: Env = {
  PORT: Number(process.env['PORT']),
  HOST: process.env['HOST'],
  API_URL: process.env['API_URL'],
  APP_URL: process.env['APP_URL'],
  MAIL_SENDER_NAME: process.env['MAIL_SENDER_NAME'],
  MAIL_PASSWORD: process.env['MAIL_PASSWORD'],
  MAIL_ADDRESS: process.env['MAIL_ADDRESS'],
  MAIL_PORT: Number(process.env['MAIL_PORT']),
  MAIL_HOST: process.env['MAIL_HOST'],
  FORM_TEMPLATE_PATH: process.env['FORM_TEMPLATE_PATH'],
  FORM_TEMPLATE_NAME: process.env['FORM_TEMPLATE_NAME'],
  MAIL_TEMPLATE_PATH: process.env['MAIL_TEMPLATE_PATH'],
  MAIL_TEMPLATE_NAME: process.env['MAIL_TEMPLATE_NAME'],
  ICAL_EVENT: process.env['ICAL_EVENT'],
};
