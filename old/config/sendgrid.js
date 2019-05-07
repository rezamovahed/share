const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

module.exports =  nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY
  })
);

