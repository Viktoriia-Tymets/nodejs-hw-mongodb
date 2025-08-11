import nodemailer from 'nodemailer';

import { getEnvVariable } from './getEnvVariable.js';

const transporter = nodemailer.createTransport({
  host: getEnvVariable('SMTP_HOST'),
  port: Number(getEnvVariable('SMTP_PORT')),
  secure: false,
  auth: {
    user: getEnvVariable('SMTP_LOGIN'),
    pass: getEnvVariable('SMTP_PASSWORD'),
  },
});

const sendEmail = (mail) => {
    mail.from = getEnvVariable('SMTP_FROM'); 
    return transporter.sendMail(mail);
  };
  
  export default sendEmail;
