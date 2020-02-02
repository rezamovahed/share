const generate = require('nanoid/generate');

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// eslint-disable-next-line prefer-const
let onetime = '';

/**
 * Load MongoDB models.
 */
const User = require('../models/User');

/**
 * Owner Controller- TConverts a user to owner
 */
exports.getOwner = async (req, res) => {
  onetime = generate(alphabet, 32);
  console.log(
    'Use this token to convert yourself to owner. (Only works once*)'
  );
  console.log(onetime.toString());
  console.log('* Note this resets everytime you reboot the app.');
  res.send(
    'Please check the app console for a onetime token to verify your the owner.'
  );
};

exports.getOwnerToken = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(404).send('Not found');
  }
  if (req.params.token === undefined || req.params.token !== onetime) {
    return res.status(404).send('Not found');
  }
  const isAlready = await User.findOne({
    role: 'owner'
  });
  if (isAlready) {
    return res.status(400).send('Only one owner can be set.');
  }
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      role: 'owner'
    },
    {
      $safe: true,
      $upsert: true
    }
  );
  res.send(user);
};
