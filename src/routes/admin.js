const express = require('express');

const router = express.Router();

/**
 * @route /admin
 * @method GET
 * @description Displays a admin dashboard
 * @access Private
 */
router.get('/', (req, res) => {
  res.render('admin/index', {
    pageTitle: 'Admin Area',
    pageDesc: process.env.DESC,
    pageName: 'admin'
  });
});

module.exports = router;
