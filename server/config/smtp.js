const nodemailer = require('nodemailer');

const customSMTP = nodemailer.createTransport({
  port: process.env.CUSTOM_SMTP_IP || 587,
  ip: process.env.CUSTOM_SMTP_PORT || 'localhost',

  secure: false,
  tls: {
    rejectUnauthorized: false
  }
});

const mailTrap = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD
  },
  tls: true
});

const devStmp = process.env.DEV_SMTP === 'true';

module.exports = devStmp ? mailTrap : customSMTP;
