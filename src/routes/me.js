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
const userUploadsPerPage = require('./utils/userUploadsPerPage');;
const deleteUpload = require('./utils/deleteUpload');

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
  let username = req.body.username.toString();
  let displayName = req.body.username.toString();
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

    if (!confirmNewPassword) { error.confirmNewPassword = 'Must comfirm password' };
    if (!validator.isLength(newPassword, {
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
    username = username.toLowerCase();
    let updatedUser = {
      username,
      displayName,
      email,
      avatar
    }
    User.findByIdAndUpdate(req.user.id, updatedUser, (err, user) => {
      if (err) {
        if (err.code === 11000) {
          error.username = 'Username has already been taked.'
        }
        req.flash('error', error);
        res.redirect('/me');
        return;
      }
      if (newPassword) {
        user.changePassword(oldPassword, newPassword, (err, changedPassword) => {
          if (err) {
            if (err.name === 'IncorrectPasswordError') {
              error.oldPassword = 'Wrong current password.'
              req.flash('error', error);
              res.redirect('/me');
              return;
            }
          }
        });
        req.flash('success', 'Your password has been changed.  Please relogin.');
        req.logout();
        res.redirect('/login');
        return;
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

/**
 * @route /me/uploads
 * @method GET
 * @description Displays uploaded stuff
 * @access Private
*/
router.get('/uploads', async (req, res) => {
  let page = 1;
  const uploads = await (userUploadsPerPage(req, res, page, req.user.id, 10));
  res.render('me/uploads', {
    title: `Manage Uploads`,
    uploads: uploads.data,
    current: page,
    // Count/limit
    pages: Math.ceil(uploads.count / 10),
  });
});

router.get('/uploads/:page', async (req, res) => {
  let page = req.params.page || 1;
  if (page === '0') { return res.redirect('/me/uploads') }
  const uploads = await (userUploadsPerPage(req, res, page, req.user.id, 10));
  res.render('me/uploads', {
    title: `Manage Uploads`,
    uploads: uploads.data,
    current: page,
    // Count/limit
    pages: Math.ceil(uploads.count / 10),
  });
});

/**
 * @route /me/uploads/id
 * @method delete
 * @description Remove uploaded file
 * @param type name
 * @access Private
*/
router.delete('/uploads/:id', (req, res) => {
  const fileName = req.query.name
  let deleteErrors = {
    file: 0,
    db: 0,
  };
  deleteUpload.file(fileName, cb => {
    if (!cb) {
      deleteErrors.file += 1;
    } else {
      deleteUpload.database(fileName, cb => {
        if (!cb) {
          deleteErrors.db += 1;
        }
      });
    }
  });
  setTimeout(() => {
    if (deleteErrors.file > 0 || deleteErrors.db > 0) {
      req.flash('error', `Could not remove that file.  Please try again. If this keeps happening then contact the site admin <a href="/me/support">here</a>`);
      res.redirect('/me/uploads');
      return;
    }
    // All uploads has been removed
    req.flash('success', `Deleted ${fileName}`);
    res.redirect('back');
  });
});

/**
 * @route /me/gallery
 * @method GET
 * @description Displays images in a gallery fomate
 * @access Private
*/
router.get('/gallery', async (req, res) => {
  const gallery = (await Upload.find({ 'uploader': req.user._id, 'isImage': true }).sort({ createdAt: -1 }));
  res.render('me/gallery', {
    title: 'Image Gallery',
    gallery,
  });
});

/**
 * @route /me/delete
 * @method GET
 * @description Delete Account
 * @access Private
*/
router.get('/delete', (req, res) => {
  Upload.find({ 'uploader': req.user.id }, (err, file) => {
    file.map(file => {
      deleteUpload.file(file.fileName, cb => {
        if (!cb) {
          deleteErrors.file += 1;
        } else {
          deleteUpload.database(file.fileName, cb => {
            if (!cb) {
              deleteErrors.db += 1;
            }
          });
        }
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
router.get('/uploads/delete/all', async (req, res) => {
  let deleteErrors = {
    file: 0,
    db: 0,
  };
  // Find all uploads by the user
  uploads = (await Upload.find({ 'uploader': req.user.id }));   // If no uploads are found then show a error message
  if (uploads.length === 0) {
    req.flash('error', 'You must upload before you can delete.');
    res.redirect('/me/uploads');
    return;
  };
  // Loop though all the uploads and removes it from the file system then removes it from the database
  /**
   * What am going to do here is "try" to remove each file then at the end if any erros happen it will show two messages.
   * Saying it's done but also how many uploads failed.  This is so the user knows not all the uploads they wanted removed
   * have been removed for some reason
   */

  uploads.map(file => {
    deleteUpload.file(file.fileName, cb => {
      if (!cb) {
        deleteErrors.file += 1;
      } else {
        deleteUpload.database(file.fileName, cb => {
          if (!cb) {
            deleteErrors.db += 1;
          }
        });
      }
    });
  })
  setTimeout(() => {
    if (deleteErrors.file > 0 || deleteErrors.db > 0) {
      req.flash('error', `Not all files could be removed.  Please try again. If this keeps happening then contact the site admin <a href="/me/support">here</a>`);
      res.redirect('/me/uploads');
      return;
    }
    // All uploads has been removed
    req.flash('success', 'All your uploads has been deleted.');
    res.redirect('/me/uploads');
  });
});

module.exports = router;
