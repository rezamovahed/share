const moment = require('moment');
const generate = require('nanoid/generate');

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Load Database Models
 */
const User = require('.././models/User');

exports.putAccount = async (req, res, next) => {
  try {
    //TODO  Add middleware vaildation for username,email,
    // password if the old password is there
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

    if (email !== req.user.email) {
      const token = await generate(alphabet, 24);
      const tokenExpire = moment().add('1', 'h');
      user.newEmailVerificationToken = token;
      user.newEmailVerificationTokenExpire = tokenExpire;
      user.newEmail = email;

      successMsg =
        'Account details has been updated but your new email needs to be verified.';

      // TODO Send email to the newEmail with the token to verify
    }
    await user.save();
    req.flash('success', successMsg);
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
