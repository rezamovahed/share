const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const fileExists = require('file-exists');
const validator = require('validator');
const md5 = require('js-md5');
const path = require('path');
const Key = require('../models/key');
const User = require('../models/user');
const Upload = require('../models/upload');
const middleware = require('../middleware')

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
  const username = req.body.username;
  const email = req.body.email.toLowerCase();
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const confirmNewPassword = req.body.confirmNewPassword;
  const avatar = gravatar.url(req.body.email, {
    s: '100',
    r: 'x',
    d: 'retro'
  }, true);

  // Check if empty
  // Username
  if (!username) { error.username = 'Please enter your username.' }
  // Email
  // Check if email is vaid
  if (!email) { error.email = 'Please enter your email.' }
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' }
  // Password
  if (newPassword) {
    if (!newPassword) { error.newPassword = 'Must have a password' }
    if (!confirmNewPassword) { error.confirmNewPassword = 'Must comfirm password' }
    if (validator.isLength(newPassword, {
      minimum: 8
    })) {
      error.password = 'Password must be at least 8 characters long. '
    }
    if (newPassword !== confirmNewPassword) { error.confirmNewPassword = 'Both passowrds must match.' }
    if (newPassword === oldPassword) { error.oldPassword = "Can't be the same as the old password" }
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
        req.logOut();
        req.flash('error', 'Your password has been changed.  Please relogin.')
        res.redirect('/login')
      }
      if (newPassword) {
        user.changePassword(oldPassword, newPassword, (err, changedPassword) => {
          return changePassword();
        });
      } else {
        req.flash('success', 'Your account has been succesfuly updated.');
        res.redirect('/me');
      }
    })
  } else {
    req.flash('error', error);
    res.redirect('/me')
  }
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
      title: 'My Keys',
      keys,

    });

  });
});

/**
 * @route /me/keys
 * @method POST
 * @description Diplays API Keys
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
    res.redirect('/me/keys')
  });
});
/**
 * @route /me/keys
 * @method POST
 * @description Diplays API Keys
 * @access Private
*/
router.delete('/keys/:key', (req, res) => {
  Key.findByIdAndRemove(req.params.key, (err, key) => {
    req.flash('success', 'API Key removed');
    res.redirect('/me/keys')
  });
});

// Here's where the content you upload will be stored.
const uploadLimitPerPage = 10
function commandListing(req, res, page) {
  Upload
    .find({ 'uploader': req.user._id })
    .skip((uploadLimitPerPage * page) - uploadLimitPerPage)
    .limit(uploadLimitPerPage)
    .exec((err, uploads) => {
      Upload.find({ 'uploader': req.user._id }).countDocuments().exec((err, count) => {
        res.render('me/uploads', {
          title: `My Uploads`,
          uploads,
          current: page,
          pages: Math.ceil(count / uploadLimitPerPage),

        });
      });
    });
}

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
 * @description Upload a Image
 * @param type name
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

function deleteByUploadFileType(type, file) {
  let filePath = `${path.join(__dirname, '../public')}/u/${type === 'image' ? 'i' : type === 'file' ? 'f' : 't'}/${file}`;
  Upload.findOneAndDelete({ fileName: file }, (err, removed) => {
    fs.unlink(filePath, err => {
      if (err) { return res.status(500) }
    });
  });
}

/**
 * @route /me/gallery
 * @method GET
 * @description Displays images in a gallery fomate
 * @access Private
*/
router.get('/gallery', (req, res) => {
  Upload
    .find({ 'uploader': req.user._id, 'isImage': true })
    .exec((err, gallery) => {
      res.render('me/gallery', {
        title: 'Image Gallery',
        gallery,

      });
    })

});

/**
 * @route /me/delete
 * @method GET
 * @description Delete Account
 * @access Private
*/
router.get('/delete', (req, res) => {
  let images = [];
  let files = [];
  let texts = [];
  let error;
  Upload.find({ 'uploader': req.user._id }, (err, file) => {
    file.map(file => {
      if (file.isImage) {
        return images.push({
          fileType: 'image',
          fileName: file.fileName
        });
      }
      if (file.isFile) {
        return files.push({
          fileType: 'file',
          fileName: file.fileName
        });
      }
      if (file.isText) {
        return texts.push({
          fileType: 'text',
          fileName: file.fileName
        });
      }
    });
    if (images) {
      images.map(image => {
        deleteByUploadFileType(image.fileType, image.fileName);
      });
    }
    if (files) {
      files.map(file => {
        deleteByUploadFileType(file.fileType, file.fileName);
      });
    }
    if (texts) {
      texts.map(text => {
        deleteByUploadFileType(text.fileType, text.fileName);
      });
    }
  });
  Key.find({ 'user': { id: req.user._id } }, (err, keys) => {
    keys.map(key => {
      Key.findByIdAndDelete(key.id, (err, removedKey) => {
      });
    });
  });
  User.findByIdAndDelete(req.user.id, (err, removedUser) => {
    res.redirect('/')
  });
});

/**
 * @route /me/uploads/delete/all
 * @method GET
 * @description Remove all images
 * @access Private
*/
router.get('/uploads/delete/all', (req, res) => {
  let images = [];
  let files = [];
  let texts = [];
  let error;
  Upload.find({ 'uploader': req.user._id }, (err, file) => {
    file.map(file => {
      if (file.isImage) {
        return images.push({
          fileType: 'image',
          fileName: file.fileName
        });
      }
      if (file.isFile) {
        return files.push({
          fileType: 'file',
          fileName: file.fileName
        });
      }
      if (file.isText) {
        return texts.push({
          fileType: 'text',
          fileName: file.fileName
        });
      }
    });
    if (!images && !files && !texts) {
      req.flash('error', 'You must upload before you can delete.')
      res.redirect('/me/uploads')

    }
    if (images) {
      images.map(image => {
        deleteByUploadFileType(image.fileType, image.fileName);
      });
    }
    if (files) {
      files.map(file => {
        deleteByUploadFileType(file.fileType, file.fileName);
      });
    }
    if (texts) {
      texts.map(text => {
        deleteByUploadFileType(text.fileType, text.fileName);
      });
    }
    req.flash('success', 'All your uploads has been deleted.')
    res.redirect('/me/uploads')
  });
});

module.exports = router;
