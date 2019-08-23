const nodemailerSendGrid = require('../../config/sendgrid')l
const mailConfig = require('../../config/email');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate')
const User = require('../../models/user');

module.exports = async (email, cb) => {
  const account = await User.findOne({ email })
  if (!account) return cb(null, 'Unknowed Error.  Please try again.')
  // Sets the token to the user
  const token = generate(alphabet, 24);
  account.emailVerificationToken = token;
  // Sets the token to expire in 3 hours
  account.emailVerificationTokenExpire = Date.now() + 1000 * 10 * 6 * 60 * 3;
  account.save()

  const htmlOuput = await emailTemplates.activateAccount(req.headers.host, token);

  const accountActvationEmail = {
    to: email,
    from: mailConfig.from,
    subject: `Please activate your account on ${process.env.TITLE}`,
    html: htmlOuput.html
  };
  nodemailerSendGrid.sendMail(accountActvationEmail, (err, info) => {
    if (err) return cb(null, 'Could not send email.  Please contact support.')
    cb(true, null);
  });
};
