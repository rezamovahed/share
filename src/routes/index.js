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
router.get('/', async (req, res) => {
  /**
   * If the user is logged in this will add
   * the needed data for the logged in render
   */

  if (req.isAuthenticated()) {
    // If user is banned.
    if (req.user.isBanned) {
      return res.render('landing/index', {
        pageTitle: 'Your currently banned',
        pageDesc: process.env.DESC,
        pageName: 'uploads'
      });
    }
    // Find user uploads
    // Per page limit.
    const limit = 10;

    const uploads = await Upload.find({ uploader: req.user.id })
      .limit(limit)
      .sort({ createdAt: -1 });
    return res.render('landing/index', {
      pageTitle: 'Welcome',
      pageDesc: process.env.DESC,
      uploads,
      pageName: 'uploads'
    });
  }
  res.render('landing/index', {
    pageTitle: 'Landing',
    pageDesc: process.env.DESC
  });
});

module.exports = router;
