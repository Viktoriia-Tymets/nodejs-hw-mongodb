import nodemailer from 'nodemailer';
import { getEnvVariable } from './getEnvVariable.js';

let transporter;

function initTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: getEnvVariable('SMTP_HOST'),
      port: Number(getEnvVariable('SMTP_PORT')),
      secure: false,
      auth: {
        user: getEnvVariable('SMTP_LOGIN'),
        pass: getEnvVariable('SMTP_PASSWORD'),
      },
    });
  }
}

const sendEmail = (mail) => {
  initTransporter();

  mail.from = getEnvVariable('SMTP_FROM');
  return transporter.sendMail(mail);
};

export default sendEmail;

