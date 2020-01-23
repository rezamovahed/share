const express = require('express');

const router = express.Router();

/**
 * @route /admin
 * @method GET
 * @description Displays a admin dashboard
 * @access Private
 */
router.get('/', (req, res) => {
  console.log('POG')
  res.render('admin/index', {
    pageTitle: 'Admin Area',
    pageDesc: process.env.DESC,
    pageName: 'admin'
  });
});

/**
 * @route /admin/uploads
 * @method GET
 * @description Displays all the uploads from all users.
 * @access Private
 */
router.get('/uploads', (req, res) => {
  res.render('admin/uploads', {
    pageTitle: 'Uploads',
    pageDesc: process.env.DESC,
    pageName: 'adminUploads'
  });
});

/**
 * @route /admin/gallery
 * @method GET
 * @description Displays all the uploads from all users in gallery formate
 * @access Private
 */
router.get('/gallery', (req, res) => {
  res.render('admin/gallery', {
    pageTitle: 'Gallery',
    pageDesc: process.env.DESC,
    pageName: 'adminGallery'
  });
});

/**
 * @route /admin
 * @method GET
 * @description Displays a admin dashboard
 * @access Private
 */
router.get('/users', (req, res) => {
  res.render('admin/users/index', {
    pageTitle: 'Users',
    pageDesc: process.env.DESC,
    pageName: 'adminUsers'
  });
});

module.exports = router;
