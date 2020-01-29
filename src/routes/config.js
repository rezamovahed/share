const express = require('express');

const router = express.Router();

/**
 * @route /configs
 * @method GET
 * @description Displays a page to create configs for supported uplaoders
 * @access Public/Private
 */
router.get('/', async (req, res) => {
  res.render('comingsoon', {
    pageTitle: 'Config Maker',
    pageDesc: process.env.DESC,
    pageName: 'config'
  });
});

module.exports = router;
