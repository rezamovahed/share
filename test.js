const nodemailerSendGrid = require('./src/config/sendgrid');
const mailConfig = require('./src//config/email');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate')
const User = require('./src/models/user');
const emailTemplates = require('./src/config/emailTemplates');

async function sendEmail(email, cb) {
  const account = await User.findOne({ email })

  // Sets the token to the user
  const token = generate(alphabet, 24);
  account.emailVerificationToken = token;

  // Sets the token to expire in 3 hours
  account.emailVerificationTokenExpire = Date.now() + 1000 * 10 * 6 * 60 * 3;

  // Saves the account with the new data
  await account.save()

  // Get's the email template and enters the details.  Setups the basic email formate for nodemailer
  const accountActvationEmail = {
    to: email,
    from: mailConfig.from,
    subject: `Activate Your Account at ${process.env.TITLE}`,
    html: emailTemplates.emailVerify(token).html
  }
  console.log('Sent email')
  console.log(accountActvationEmail)
}

sendEmail('demonwolf@demonwolfdev.com')
