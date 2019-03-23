const sg = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');

// Setup SendGrid Auth
const sgAuth = {
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD
  }
}

const nodemailerSendGrid = nodemailer.createTransport(sg(sgAuth));
module.exports = nodemailerSendGrid;
