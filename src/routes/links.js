const express = require('express');

const router = express.Router();


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
    pageName: 'links'
  });
});

module.exports = router;
