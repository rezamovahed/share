const express = require('express');
const middleware = require('../middleware');
const router = express.Router();
const Upload = require('../models/upload');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

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
      });
    });
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
 * @route /admin/uploads/:id
 * @method DELETE
 * @description Show Admin Dashboard
 * @access Private
*/
router.delete('/uploads/:id', (req, res) => {
  Upload.findByIdAndDelete(req.params.id, (err, removedFile) => {
    let fileType = {};
    switch (req.query.type) {
      case ('image'):
        fileType.image = true
        break;
      case ('file'):
        fileType.file = true
        break;
      case ('text'):
        fileType.text = true
        break;
    }
    const fileName = req.query.name
    const filePath = `${path.join(__dirname, '../public')}/u/${fileType.image ? 'i' : fileType.file ? 'f' : 't'}/${fileName}`;
    fs.unlink(filePath, err => {
      if (err) {
        req.flash('error', 'Error in deleteing');
        res.redirect('back');
        return;
      }
      req.flash('success', `Deleted ${fileName}`);
      res.redirect('back');
    })
  });
});

/**
 * @route /admin/gallery
 * @method GET
 * @description Admin image gallery
 * @access Private
*/
router.get('/gallery', (req, res) => {
  Upload
    .find({ 'isImage': true })
    .exec((err, gallery) => {
      console.log(gallery)
      res.render('admin/gallery', {
        title: 'Image Gallery',
        gallery,
        csrfToken: req.csrfToken()
      });
    })
});

/**
 * @route /admin/users
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/users', (req, res) => {
  usersListingPerPage(req, res, 1, User, 10, 'admin/users/index', 'User Management')
});

/**
 * @route /admin/users/:page
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/users', (req, res) => {
  usersListingPerPage(req, res, req.params.page, User, 10, 'admin/users/index', 'User Management')
});

module.exports = router;
