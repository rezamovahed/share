const express = require('express');

const router = express.Router();

/**
 * @route /branding
 * @method GET
 * @description Allows admin to add branding.
 * @access Private
 */
router.get('/', (req, res) => {
  res.render('comingsoon', {
    pageTitle: 'Branding',
    pageDesc: process.env.DESC,
    pageName: 'branding'
  });
});

module.exports = router;
