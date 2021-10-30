const smtp = require('../config/smtp');
const sendgrid = require('../config/sendgrid');

module.exports = async msg => {
  if (process.env.CUSTOM_SMTP === 'true') {
    return smtp.sendMail(msg);
  }
  await sendgrid.send(msg);
};
