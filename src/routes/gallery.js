const express = require('express');

const router = express.Router();

/**
 * Load MongoDB models.
 */
const Upload = require('../models/Upload');

/**
 * @route /gallery
 * @method GET
 * @description Displays users images in gallery formate with simple tools.
 * @access Private
 */
router.get('/', async (req, res) => {
  const images = await Upload.find({ uploader: req.user.id }).sort({
    uploadedAt: -1
  });
  res.render('gallery/index', {
    pageTitle: 'My gallery',
    pageDesc: process.env.DESC,
    pageName: 'gallery',
    images
  });
});

module.exports = router;
