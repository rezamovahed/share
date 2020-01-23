const moment = require('moment');
const generate = require('nanoid/generate');
const sendgrid = require('../config/sendgrid');

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Load MongoDB models.
 */
const User = require('.././models/User');

/**
 * Load Email Templates.
 */
const newEmailVerificationEmail = require('../emails/NewEmailVerify');

/**
 * Update account Controler - Allows users to update basic account details.
 */
exports.putAccount = async (req, res, next) => {
  try {
    // TODO  Add middleware vaildation for username,email,
    // password if the old password is there
    // Add verify people can't change there name
    const {
      username,
      email,
      oldPassword,
      newPassword,
      confirmNewPassword
    } = req.body;
    let successMsg = 'Account details has been updated';

    // This is due to checkbox so I can see if its true or false
    const streamerMode = req.body.streamerMode || false;
    if (
      username === req.user.username &&
      email === req.user.email &&
      streamerMode === req.user.streamerMode &&
      oldPassword
    ) {
      req.flash('error', 'You have not changed any details');
      return res.redirect(301, '/account');
    }
    const user = await User.findById(req.user.id);

    if (username !== req.user.username) {
      user.username = username;
    }
    if (streamerMode !== req.user.streamerMode) {
      user.streamerMode = streamerMode;
    }
    if (!req.user.streamerMode && email !== req.user.email) {
      const token = await generate(alphabet, 24);
      const tokenExpire = moment().add('1', 'h');
      user.newEmailVerificationToken = token;
      user.newEmailVerificationTokenExpire = tokenExpire;
      user.newEmail = email;

      successMsg =
        'Account details has been updated but your new email needs to be verified.';

      const emailTemplate = newEmailVerificationEmail(
        user.email,
        user.newEmail,
        user.newEmailVerificationToken
      );

      const msg = {
        to: user.newEmail,
        from: `${process.env.EMAIL_FROM} <noreply@${process.env.EMAIL_DOMAIN}>`,
        subject: `New Email Verification for  ${process.env.TITLE}`,
        html: emailTemplate.html
      };

      if (process.env.NODE_EV !== 'test') await sendgrid.send(msg);
    }

    await user.save();
    req.flash('success', successMsg);
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.emailVeirfy = async (req, res, next) => {
  try {
    const user = await User.findOne({
      newEmailVerificationToken: req.params.token
    });

    user.newEmailVerificationToken = undefined;
    user.newEmailVerificationTokenExpire = undefined;
    user.email = user.newEmail;
    user.newEmail = undefined;
    await user.save();

    let successMsg = `Email has been changed to ${user.email}`;
    if (user.streamerMode) {
      successMsg = 'Email has been updated.';
    }

    req.flash('success', successMsg);
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.resendEmailVeirfy = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const token = await generate(alphabet, 24);
    const tokenExpire = moment().add('1', 'h');
    user.newEmailVerificationToken = token;
    user.newEmailVerificationTokenExpire = tokenExpire;
    await user.save();

    const emailTemplate = newEmailVerificationEmail(
      user.email,
      user.newEmail,
      user.newEmailVerificationToken
    );

    const msg = {
      to: user.newEmail,
      from: `${process.env.EMAIL_FROM} <noreply@${process.env.EMAIL_DOMAIN}>`,
      subject: `New Email Verification for  ${process.env.TITLE}`,
      html: emailTemplate.html
    };

    if (process.env.NODE_EV !== 'test') await sendgrid.send(msg);

    req.flash('success', 'A new email verification link has been sent.');
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
