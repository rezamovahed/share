const express = require('express');
const router = express.Router();
const Upload = require('../models/upload');
const User = require('../models/user');
const Key = require('../models/key');
const fs = require('fs');
const path = require('path');
const password = require('generate-password');
const gravatar = require('gravatar');
const validator = require('validator');
const middleware = require('../middleware')
const uploadsLisingPerPage = require('./utils/adminUploadsPerPage');;
const usersListingPerPage = require('./utils/userLisingPerPage');
const deleteUpload = require('./utils/deleteUpload');

/**
 * @route /admin
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/', middleware.owner, async (req, res) => {
  try {
    let uploads = await Upload.countDocuments({}, (err, count) => { return count });
    let users = await User.countDocuments({}, (err, count) => { return count });
    res.render('admin/index', {
      title: 'Admin',
      uploads,
      users
    })
  } catch (err) {
    req.flash('error', 'Could not load data.');
    res.render('admin/index');
    return;
  }
});

/**
 * @route /admin/uploads
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/uploads', async (req, res) => {
  const uploads = (await uploadsLisingPerPage(req, res, 1, Upload, 10, true, 'uploader'));
  res.render('admin/uploads', {
    title: 'Uploads Management',
    data: uploads.data,
    current: 1,
    pages: Math.ceil(uploads.count / 10)
  });
});

/**
 * @route /admin/uploads/:page
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/uploads/:page', async (req, res) => {
  if (req.params.page === '0') { return res.redirect('/admin/uploads') };
  const uploads = (await uploadsLisingPerPage(req, res, req.params.page, Upload, 10, true, 'uploader'));
  res.render('admin/uploads', {
    title: 'Uploads Management',
    data: uploads.data,
    current: req.params.page,
    // Count/limit
    pages: Math.ceil(uploads.count / 10)
  });
});

/**
 * @route /admin/uploads/:id
 * @method DELETE
 * @description Show Admin Dashboard
 * @access Private
*/
router.delete('/uploads/:id', (req, res) => {
  // Finds the upload via the id and starts the removel process
  Upload.findByIdAndDelete(req.params.id, (err, removedFile) => {
    const fileName = req.query.name;
    const filePath = `${path.join(__dirname, '../public')}/u/${fileName}`;
    fs.unlink(filePath, err => {
      req.flash('success', `Deleted ${fileName}`);
      res.redirect('back');
    });
  });
});

/**
 * @route /admin/uploads/delete/all
 * @method GET
 * @description Delete Account
 * @access Private
*/
router.get('/uploads/delete/all', async (req, res) => {
  let error;
  uploads = (await Upload.find({}));   // If no uploads are found then show a error message

  if (uploads.length === 0) {
    req.flash('error', 'There are no uploads to remove.');
    res.redirect('/me/uploads');
    return;
  };

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
    .sort({ createdAt: -1 })
    .exec((err, gallery) => {
      res.render('admin/gallery', {
        title: 'Image Gallery',
        gallery,
      });
    });
});

/**
 * @route /admin/users/new
 * @method GET
 * @description Shows create user
 * @access Private
*/
router.get('/users/new', (req, res) => {
  let generatePassword = password.generate({
    length: 16,
    numbers: true
  });
  res.render('admin/users/new', {
    title: 'Create new user',
    password: generatePassword,
  });
});

/**
 * @route /admin/users/:page
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/users/:page', async (req, res) => {
  if (req.params.page === '0') { return res.redirect('/admin/users') };
  const data = (await usersListingPerPage(req, res, req.params.page, User, 10));
  res.render('admin/users/index', {
    title: 'User Management',
    data: data.data,
    current: req.params.page,
    pages: Math.ceil(data.count / 10)
  });
});

/**
 * @route /admin/users/:id/edit
 * @method GET
 * @description Shows a edit form for the user
 * @access Private
*/
router.get('/users/:id/edit', (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    let username = user.username;
    let email = user.email;
    let accountActivated = user.accountActivated;
    let isAdmin = user.isAdmin;
    res.render('admin/users/edit', {
      title: `Edit ${username}`,
      username,
      email,
      accountActivated,
      isAdmin,
      id
    });
  });
});

/**
 * @route /admin/users/:id
 * @method PUT
 * @description Shows a edit form for the user
 * @access Private
*/
router.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const username = req.body.username;
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const accountActivated = req.body.activate;
  const avatar = gravatar.url(req.body.email, {
    s: '100',
    r: 'x',
    d: 'retro'
  }, true);

  let error = {};

  // Check if empty
  // Username
  if (!username) { error.username = 'Please enter a username.' };
  // Email
  // Check if email is vaid
  if (!email) { error.email = 'Please enter your email.' };
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' };

  // Password
  if (password && validator.isLength(password, {
    minimum: 8
  })) {
    error.password = 'Password must be at least 8 characters long.';
  }

  if (JSON.stringify(error) === '{}') {
    let updatedUser = {
      username,
      email,
      accountActivated,
      avatar
    }
    if (req.body.isAdmin) {
      updatedUser.isAdmin = true
    } else {
      updatedUser.isAdmin = false;
    };
    User.findByIdAndUpdate(id, updatedUser, (err, user) => {
      if (err) {
        if (err.code === 11000) {
          error.username = 'Username may be already in use.';
          error.email = 'EMail may be already in use.';
        }
        req.flash('error', error);
        res.redirect(`/admin/users/${id}`);
        return;
      }
      if (password) {
        user.setPassword(password, (err, newPassword) => {
        });
      };
      // Add user password change.
      req.flash('success', `${username} has been updated`);
      res.redirect('/admin/users');
      return;
    });
  } else {
    req.flash('error', error);
    res.redirect(`/ admin / users / ${id}`);
  }
});

/**
 * @route /admin/users/:id
 * @method DELETE
 * @description Shows create user
 * @access Private
*/
router.delete('/users/:id', (req, res) => {
  if (req.user.id === req.params.id) {
    req.flash('error', "You can't remove your account.");
    res.redirect('back');
    return;
  }

  let error;

  Upload.find({ 'uploader': req.params.id }, (err, file) => {
    file.map(file => {
      const filePath = `${path.join(__dirname, '../public')} / u / ${file}`;
      Upload.findOneAndDelete({ fileName: file }, (err, removed) => {
        fs.unlink(filePath, err => { });
      });
    });
  });

  Key.find({ 'user': { id: req.params.id } }, (err, keys) => {
    keys.map(key => {
      Key.findByIdAndDelete(key.id, (err, removedKey) => { });
    });
  });

  User.findByIdAndDelete(req.params.id, (err, removedUser) => {
    req.flash('success', `${removedUser.username} has been removed.`);
    res.redirect('back');
  });
});

/**
 * @route /admin/users/new
 * @method POST
 * @description Shows create user
 * @access Private
*/
router.post('/users/new', (req, res) => {
  let error = {};
  const username = req.body.username;
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const avatar = gravatar.url(req.body.email, {
    s: '100',
    r: 'x',
    d: 'retro'
  }, true);

  // Check if empty
  // Username
  if (!username) { error.username = 'Please enter your username.' };
  // Email
  if (!email) { error.email = 'Please enter your email.' };
  // Password
  if (!password) { error.password = 'Must have a pssword' };

  // Check if email is vaid
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' };
  // Check if passoword and comfirm password are the same.
  // Check password length
  if (!validator.isLength(password, {
    minimum: 8
  })) {
    error.password = 'Password must be at least 8 characters long.';
  }

  if (JSON.stringify(error) === '{}') {
    let newUser = {
      username,
      email,
      avatar,
    };

    if (req.body.activate) { newUser.accountActivated = true };
    if (req.body.admin) { newUser.isAdmin = true };

    User.register(newUser, password, (err, user) => {
      if (err.name === 'UserExistsError') { error.alreadyAccount = 'A user with the given username is already registered' };
      if (JSON.stringify(error) !== '{}') {
        req.flash('error', error);
        res.render('admin/users/new', {
          title: 'Create new user',
          username,
          email: email,
          password: password,
        });
        return;
      }
      req.flash('success', `${username} has been created`);
      res.redirect('/admin/users');
    });
  } else {
    req.flash('error', error)
    res.render('admin/users/new', {
      title: 'Create new user',
      username: username,
      email: email,
      password: password,

    });
  };
});

/**
 * @route /admin/users
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/users', async (req, res) => {
  const data = (await usersListingPerPage(req, res, 1, User, 10));
  res.render('admin/users/index', {
    title: 'User Management',
    data: data.data,
    current: 1,
    pages: Math.ceil(data.count / 10)
  });
});


module.exports = router;
