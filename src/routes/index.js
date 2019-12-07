const express = require('express');

const router = express.Router();

/**
 * @route /
 * @method GET
 * @description Displays landing page or
 *  users uploads if they are logged inn
 * @access Public/Private
 */
router.get('/', (req, res) => {
  res.render('landing/index', {
    pageTitle: 'Landing',
    pageDesc: process.env.DESC
  });
});

module.exports = router;
