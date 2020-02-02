const express = require('express');

const router = express.Router();

/**
 * Load MongoDB models.
 */
const Upload = require('../models/Upload');
const User = require('../models/User');

/**
 * Load middlewares
 */
const isOwner = require('../middleware/roleCheck/isOwner');

/**
 * @route /admin
 * @method GET
 * @description Displays a admin dashboard
 * @access Private
 */
router.get('/', async (req, res) => {
  const uploads = await Upload.countDocuments();
  const users = await User.countDocuments();
  const files = await Upload.countDocuments({ type: 'file' });
  const images = await Upload.countDocuments({ type: 'image' });
  const texts = await Upload.countDocuments({ type: 'text' });

  res.render('admin/index', {
    pageTitle: 'Admin Area',
    pageDesc: process.env.DESC,
    pageName: 'admin',
    uploads,
    users,
    files,
    images,
    texts
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
router.get('/gallery', async (req, res) => {
  const images = await Upload.find({ type: 'image' }).select(
    'fileName fileExtension'
  );
  res.render('admin/gallery', {
    pageTitle: 'Gallery',
    pageDesc: process.env.DESC,
    pageName: 'adminGallery',
    images
  });
});

/**
 * @route /admin/users
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

/**
 * @route /admin/users/:slug
 * @method GET
 * @description Displays a users details.
 * @access Private
 */
router.get('/user/:slug', (req, res) => {
  res.render('admin/comingsoon', {
    pageTitle: 'View User',
    pageDesc: process.env.DESC,
    pageName: 'adminUsersView'
  });
});

/**
 * @route /admin/settings
 * @method GET
 * @description Displays a page to create configs for supported uplaoders
 * @access Private
 */
router.get('/settings', isOwner, async (req, res) => {
  res.render('admin/comingsoon', {
    pageTitle: 'Settings',
    pageDesc: process.env.DESC,
    pageName: 'adminSettings'
  });
});

module.exports = router;
