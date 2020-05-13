const express = require('express');
const { customAlphabet } = require('nanoid/async');

const urlFriendyAlphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const router = express.Router();

const nanoid32 = customAlphabet(urlFriendyAlphabet, 24);

/**
 * Load MongoDB models.
 */
const Token = require('../models/Link');

/**
 * @route /links
 * @method GET
 * @description Displays links created by the user.
 * @access Private
 */
router.get('/', async (req, res) => {
  res.render('links/index', {
    pageTitle: 'My links',
    pageDesc: process.env.DESC,
    pageName: 'links',
    newLinkCode: await nanoid32()
  });
});

module.exports = router;
