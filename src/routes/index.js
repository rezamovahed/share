const express = require('express');

const router = express.Router();

/**
 * Load MongoDB models.
 */
const Upload = require('../models/Upload');

/**
 * @route /
 * @method GET
 * @description Displays landing page or
 *  users uploads if they are logged inn
 * @access Public/Private
 */
router.get('/', (req, res) => {
  /**
   * If the user is logged in this will add
   * the needed data for the logged in render
   */
  if (req.isAuthenticated()) {
    // Find user uploads
    const limit = 10;
    const uploads = Upload.find({ uploader: req.user.id })
      .limit(limit)
      .sort({ createdAt: -1 });
    return res.render('landing/index', {
      pageTitle: 'Welcome',
      pageDesc: process.env.DESC,
      uploads
    });
  }
  res.render('landing/index', {
    pageTitle: 'Landing',
    pageDesc: process.env.DESC
  });
});

module.exports = router;
