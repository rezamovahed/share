const { customAlphabet } = require('nanoid/async');

const urlFriendyAlphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Load MongoDB models.
 */
const Link = require('../../../models/Link');

/**
 * Create link Controler - Alllows a user on the API to create a URL
 */
module.exports.createLink = async (req, res) => {
  try {
    const nanoid32 = customAlphabet(urlFriendyAlphabet, 32);

    const { url, code } = req.body;
    const newLink = new Link({
      creator: req.user.id,
      deleteKey: await nanoid32(),
      url,
      code
    });

    res.json({
      auth: true,
      success: true,
      link: {
        url,
        code,
        newurl: `${process.env.FULL_DOMAIN}/l/${newLink.code}`,
        delete: `${process.env.FULL_DOMAIN}/api/v1/delete?key=${newLink.deleteKey}`,
        deleteKey: newLink.deleteKeys
      },
      status: 200
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
