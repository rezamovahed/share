const nodemailerSendGrid = require('../../../config/sendgrid');
const mailConfig = require('../../../config/email');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate');
const User = require('../../../models/user');
const emailTemplates = require('../../../config/emailTemplates');

/**
 * @param email
 * Email of the user
 */
module.exports = async (id, newEmail) => {
  const account = await User.findOneById(id);

  // Sets the token to the user
  const token = await generate(alphabet, 24);
  account.newEmail = newEmail;

  account.emailVerificationToken = token;

  // Sets the token to expire in 3 hours
  account.emailVerificationTokenExpire = Date.now() + 1000 * 10 * 6 * 60 * 3;

  // Saves the account with the new data
  await account.save();

  // Get's the email template and enters the details.  Setups the basic email formate for nodemailer
  const comfirmNewEmail = {
    to: newEmail,
    from: mailConfig.from,
    subject: `Please comfirm your new email at ${process.env.TITLE}`,
    html: emailTemplates.newEmail(token).html
  };
  await nodemailerSendGrid.sendMail(newEmail);
};
