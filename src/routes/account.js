const express = require('express');

const router = express.Router();

/**
 * @route /account
 * @method GET
 * @description Displays a users account details
 * @access Private
 */
router.get('/', (req, res) => {
  res.render('account/index', {
    pageTitle: 'My Account',
    pageDesc:
      'Advanced uploader with web front-end for images,files,and text. Built with ShareX in mind. Licensed under MIT and is free to use.'
  });
});

module.exports = router;
