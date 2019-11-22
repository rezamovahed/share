const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate');
const nodemailerSendGrid = require('../../../config/sendgrid');
const mailConfig = require('../../../config/email');
const emailTemplates = require('../../../config/emailTemplates');
const User = require('../../../models/user');

/**
 * @param email
 * Email of the user
 */
module.exports = async email => {
  const account = await User.findOne({ email });

  // Sets the token to the user
  const token = await generate(alphabet, 24);
  account.emailVerificationToken = token;

  // Sets the token to expire in 3 hours
  account.emailVerificationTokenExpire = Date.now() + 1000 * 10 * 6 * 60 * 3;

  // Saves the account with the new data
  await account.save();

  // Get's the email template and enters the details.  Setups the basic email formate for nodemailer
  const verifyEmail = {
    to: email,
    from: mailConfig.from,
    subject: `Activate your Account at ${process.env.TITLE}`,
    html: emailTemplates.emailVerify(token).html
  };
  await nodemailerSendGrid.sendMail(verifyEmail);
};
