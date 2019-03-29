const express = require('express');
const middleware = require('../middleware');
const router = express.Router();
const Upload = require('../models/upload');
const User = require('../models/user');

/**
 * @route /admin
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/', async (req, res) => {
  try {
    let uploads = await Upload.countDocuments({}, (err, count) => { return count });
    let users = await User.countDocuments({}, (err, count) => { return count });
    res.render('admin/index', {
      title: 'Admin',
      uploads,
      users
    })
  } catch (err) {
    req.flash('error', 'Could not load data.')
    res.render('admin/index');
    return;
  }
});

function uploaderListingPerPage(req, res, page, model, limit, render, title) {
  model
    .find({})
    .skip((limit * page) - limit)
    .limit(limit)
    .populate('uploader')
    .exec((err, data) => {
      model.countDocuments().exec((err, count) => {
        res.render(render, {
          title,
          data,
          current: page,
          pages: Math.ceil(count / limit),
          csrfToken: req.csrfToken(),
        });
      })
    })
}

function usersListingPerPage(req, res, page, model, limit, render, title) {
  model
    .find({})
    .skip((limit * page) - limit)
    .limit(limit)
    .exec((err, data) => {
      model.countDocuments().exec((err, count) => {
        res.render(render, {
          title,
          data,
          current: page,
          pages: Math.ceil(count / limit),
          csrfToken: req.csrfToken(),
        });
      })
    })
}


/**
 * @route /admin/uploads
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/uploads', (req, res) => {
  uploaderListingPerPage(req, res, 1, Upload, 10, 'admin/uploads', 'Upload Management')
});

/**
 * @route /admin/uploads/:page
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/uploads/:page', (req, res) => {
  uploaderListingPerPage(req, res, req.params.page, Upload, 10, 'admin/uploads', 'Upload Management')
});


/**
 * @route /admin/users
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/users', (req, res) => {
  res.render('admin/users', {
    title: 'User Management'
  });
});

module.exports = router;
