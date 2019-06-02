const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const validator = require('validator');
const md5 = require('js-md5');
const path = require('path');
const Key = require('../models/key');
const User = require('../models/user');
const Upload = require('../models/upload');

/**
 * @route /me
 * @method GET
 * @description Displays account.
 * @access Private
*/
router.get('/', (req, res) => {
  res.render('me/index', {
    title: 'Edit account',
  });
});

/**
 * @route /me
 * @method PUT
 * @description Updates account details.
 * @access Private
*/
router.put('/', (req, res) => {
  let error = {};
  const username = req.body.username.toString();
  const email = req.body.email.toString().toLowerCase();
  const newPassword = req.body.newPassword.toString();
  const oldPassword = req.body.oldPassword.toString();
  const confirmNewPassword = req.body.confirmNewPassword.toString();
  const avatar = gravatar.url(email, {
    s: '100',
    r: 'x',
    d: 'retro'
  }, true);

  // Check if empty
  // Username
  if (!username) { error.username = 'Please enter your username.' };
  // Email
  // Check if email is vaid
  if (!email) { error.email = 'Please enter your email.' };
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' };
  // Password
  if (newPassword) {
    if (!newPassword) { error.newPassword = 'Must have a password' }
    if (!confirmNewPassword) { error.confirmNewPassword = 'Must comfirm password' };
    if (validator.isLength(newPassword, {
      minimum: 8
    })) {
      error.password = 'Password must be at least 8 characters long. '
    }
    if (newPassword !== confirmNewPassword) { error.confirmNewPassword = 'Both passowrds must match.' };
    if (newPassword === oldPassword) { error.oldPassword = "Can't be the same as the old password" };
  }
  // Check if passoword and comfirm password are the same.
  // Check password length
  if (JSON.stringify(error) === '{}') {
    let updatedUser = {
      username,
      email,
      avatar
    }
    User.findByIdAndUpdate(req.user.id, updatedUser, (err, user) => {
      function changePassword() {
        req.logout();
        req.flash('error', 'Your password has been changed.  Please relogin.');
        res.redirect('/login');
      };

      if (newPassword) {
        user.changePassword(oldPassword, newPassword, (err, changedPassword) => {
          return changePassword();
        });
      };

      req.flash('success', 'Your account has been succesfuly updated.');
      res.redirect('/me');
    })
  } else {
    req.flash('error', error);
    res.redirect('/me')
  };
});

/**
 * @route /me/keys
 * @method GET
 * @description Diplays API Keys
 * @access Private
*/
router.get('/keys', (req, res) => {
  Key.find({ 'user': { id: req.user._id } }, (err, keys) => {
    res.render('me/keys', {
      title: 'Manage Keys',
      keys,
    });
  });
});

/**
 * @route /me/keys
 * @method POST
 * @description Creates a API Key
 * @access Private
*/
router.get('/keys/create', (req, res) => {
  let token = jwt.sign({
  }, process.env.API_SECRET, {
      issuer: process.env.TITLE,
      subject: req.user._id.toString()
    });
  let tokenHash = md5(token);
  const newKey = {
    user: {
      id: req.user.id
    },
    hash: tokenHash,
  }
  Key.create(newKey, (err, key) => {
    req.flash('info', token);
    res.redirect('/me/keys');
  });
});

/**
 * @route /me/keys
 * @method POST
 * @description Removes API Key
 * @access Private
*/
router.delete('/keys/:key', (req, res) => {
  Key.findByIdAndRemove(req.params.key, (err, key) => {
    if (err) {
      req.flash('error', 'Error in removing API Key');
      return res.redirect('/me/keys')
    }
    req.flash('success', 'API Key removed');
    res.redirect('/me/keys')
  });
});

// Here's where the content you upload will be stored.
// Can convert this function to be async.
const uploadLimitPerPage = 10
function commandListing(req, res, page) {
  Upload
    .find({ 'uploader': req.user._id })
    .skip((uploadLimitPerPage * page) - uploadLimitPerPage)
    .limit(uploadLimitPerPage)
    .sort({ createdAt: -1 })
    .exec((err, uploads) => {
      Upload.find({ 'uploader': req.user._id }).countDocuments().exec((err, count) => {
        res.render('me/uploads', {
          title: `Manage Uploads`,
          uploads,
          current: page,
          pages: Math.ceil(count / uploadLimitPerPage),
        });
      });
    });
};

/**
 * @route /me/uploads
 * @method GET
 * @description Displays uploaded stuff
 * @access Private
*/
router.get('/uploads', (req, res) => {
  let page = 1;
  commandListing(req, res, page);
});

router.get('/uploads/:page', (req, res) => {
  let page = req.params.page || 1;
  if (page === '0') { return res.redirect('/me/uploads') }
  commandListing(req, res, page);
});

/**
 * @route /me/uploads/id
 * @method delete
 * @description Remove uploaded file
 * @param type name
 * @access Private
*/
router.delete('/uploads/:id', (req, res) => {
  Upload.findByIdAndDelete(req.params.id, (err, removedFile) => {
    const fileName = req.query.name
    const filePath = `${path.join(__dirname, '../public')}/u/${fileName}`;
    fs.unlink(filePath, err => {
      if (err) {
        req.flash('error', 'Error in deleteing');
        res.redirect('back');
        return;
      };
      req.flash('success', `Deleted ${fileName}`);
      res.redirect('back');
    })
  });
});

/**
 * @route /me/gallery
 * @method GET
 * @description Displays images in a gallery fomate
 * @access Private
*/
router.get('/gallery', (req, res) => {
  Upload
    .find({ 'uploader': req.user._id, 'isImage': true })
    .sort({ createdAt: -1 })
    .exec((err, gallery) => {
      res.render('me/gallery', {
        title: 'Image Gallery',
        gallery,
      });
    });
});

/**
 * @route /me/delete
 * @method GET
 * @description Delete Account
 * @access Private
*/
router.get('/delete', (req, res) => {
  const baseFilePath = `${path.join(__dirname, '../public')}/u/`;
  Upload.find({ 'uploader': req.user.id }, (err, file) => {
    file.map(file => {
      Upload.findOneAndDelete({ fileName: file.fileName }, (err, removed) => {
        fs.unlink(baseFilePath + file.fileName);
      });
    });
  });
  Key.deleteMany({ 'user': { id: req.user.id } });
  User.findByIdAndDelete(req.user.id);
  res.redirect('/');
});

/**
 * @route /me/uploads/delete/all
 * @method GET
 * @description Remove all images
 * @access Private
*/
router.get('/uploads/delete/all', (req, res) => {
  // Find all uploads by the user
  Upload.find({ 'uploader': req.user.id }, (err, file) => {
    // If no uploads are found then show a error message
    if (file.length === 0) {
      req.flash('error', 'You must upload before you can delete.');
      res.redirect('/me/uploads');
      return;
    };
    // Loop though all the uploads and remove from database then remove from the FS

    file.map(file => {
    });
    // All uploads has been removed
    req.flash('success', 'All your uploads has been deleted.');
    res.redirect('/me/uploads');
  });
});

module.exports = router;
