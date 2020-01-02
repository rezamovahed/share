const express = require('express');

const router = express.Router();

/**
 * @route /gallery
 * @method GET
 * @description Displays users images in gallery formate with simple tools.
 * @access Private
 */
router.get('/', (req, res) => {
  res.render('gallery/index', {
    pageTitle: 'My gallery',
    pageDesc: process.env.DESC,
    pageName: 'gallery'
  });
});

module.exports = router;
