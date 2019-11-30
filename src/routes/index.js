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
    pageDesc:
      'Advanced uploader with web front-end for images,files,and text. Built with ShareX in mind. Licensed under MIT and is free to use.'
  });
});

module.exports = router;
