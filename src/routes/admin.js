const express = require('express');
const moment = require('moment');
const Upload = require('../models/upload');
const User = require('../models/user');
const Key = require('../models/key');
const fs = require('fs');
const path = require('path');
const password = require('generate-password');
const gravatar = require('gravatar');
const validator = require('validator');
const middleware = require('../middleware');
const uploadsLisingPerPage = require('./utils/admin/uploadsPerPage');
const userPerPage = require('./utils/admin/userPerPage');
const deleteUpload = require('./utils/deleteUpload');
const router = express.Router();
const updateUser = ('./utils/admin/updateUser.js');

/**
 * @route /admin
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/', middleware.owner, async (req, res) => {
  const uploads = await Upload.countDocuments({});
  const users = await User.countDocuments({});
  res.render('admin/index', {
    title: 'Admin',
    uploads,
    users
  });
});

/**
 * @route /admin/uploads
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/uploads', async (req, res) => {
  const uploads = await uploadsLisingPerPage(req, res, 1, 10, true, 'uploader');
  res.render('admin/uploads', {
    title: 'Uploads Management',
    data: uploads.data,
    current: 1,
    // Count/limit
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
  const uploads = await uploadsLisingPerPage(req, res, req.params.page, 10, true, 'uploader');
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
  const fileName = req.query.name;

  deleteUpload.file(fileName, err => {
    if (err) {
      req.flash('error', `Could not remove that file.  Please try again.`);
      res.redirect('back');

    } else {
      deleteUpload.database(fileName)
      req.flash('success', `Removed ${fileName}`);
      res.redirect('back');
    };
  });
});

/**
 * @route /admin/uploads/delete/all
 * @method GET
 * @description Delete Account
 * @access Private
*/
router.get('/uploads/delete/all', async (req, res) => {
  uploads = await Upload.find({});   // If no uploads are found then show a error message

  if (uploads.length === 0) {
    req.flash('error', 'There are no uploads to remove.');
    res.redirect('/me/uploads');
    return;
  };

  await uploads.map(file => {
    deleteUpload.file(file.fileName, err => {
      if (err) {
        deleteErrors.file += 1;
      } else {
        deleteUpload.database(file.fileName, err => {
          if (err) {
            deleteErrors.db += 1;
          };
        });
      };
    });
  });
  if (deleteErrors.file > 0 || deleteErrors.db > 0) {
    req.flash('error', `Could not remove that file.  Please try again.`);
    res.redirect('/me/uploads');
    return;
  };
  // All uploads has been removed
  req.flash('success', `Removed ${fileName}`);
  res.redirect('back');
});

/**
 * @route /admin/gallery
 * @method GET
 * @description Admin image gallery
 * @access Private
*/
router.get('/gallery', async (req, res) => {
  const gallery = await Upload.find({ 'isImage': true }).sort({ createdAt: -1 });
  res.render('admin/gallery', {
    title: 'Image Gallery',
    gallery,
  });
});

/**
 * @route /admin/users/new
 * @method GET
 * @description Shows create user
 * @access Private
*/
router.get('/users/new', (req, res) => {
  const generatePassword = password.generate({
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
  const data = (await userPerPage(req, res, req.params.page, User, 8));
  res.render('admin/users/index', {
    title: 'User Management',
    data: data.data,
    current: req.params.page,
    pages: Math.ceil(data.count / 8)
  });
});

/**
 * @route /admin/users/:id/edit
 * @method GET
 * @description Shows a edit form for the user
 * @access Private
*/
router.get('/users/:id/edit', (req, res) => {
  const id = req.params.id;
  User.findById(id, (err, user) => {
    const username = user.username;
    const email = user.email;
    const emailVerified = user.emailVerified;
    const isAdmin = user.isAdmin;
    const lastLog = user.lastLog;
    const lastLogIP = user.lastLogIP;
    const lastActivity = user.lastActivity;
    const isBanned = user.isBanned;
    const isSuspended = user.isSuspended;
    const suspendedReason = user.suspendedReason;
    const suspendedExpire = user.suspendedExpire;
    res.render('admin/users/edit', {
      title: `Edit ${username}`,
      username,
      email,
      emailVerified,
      isAdmin,
      lastLog,
      lastLogIP,
      lastActivity,
      isBanned,
      isSuspended,
      suspendedExpire,
      suspendedReason,
      id
    });
  });
});

/**
 * @route /admin/users/:id/suspend
 * @method GET
 * @description Shows a form that allows you to defind the time to suspend the user
 * @access Private
*/
router.get('/users/:id/suspend', async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
  } catch (e) {
    res.status(404).render('admin/errors/404', {
      title: 'User not found',
      message: 'The user your trying to suspend can not be found.',
      redirect: '/admin/users/'
    });
  };
  res.render('admin/users/suspend', {
    title: `Suspend ${user.username}`,
    username: user.username,
    id: req.params.id
  });
});

/**
 * @route /admin/users/:id/suspend
 * @method PATCH
 * @description Shows a form that allows you to defind the time to suspend the user
 * @access Private
*/
router.patch('/users/:id/suspend', async (req, res) => {
  let reason = req.body.reason;
  const expireCustom = moment(req.body.suspendExpireCustom, "M/D/YYYY h:mm A").utc();
  const expireDate = moment().add(req.body.suspendExpire || 0, 'days');

  if (!reason) {
    reason = 'For breaking the reasons you have been issued a temp suspend from our site';
  }
  if (req.body.suspendExpire === 'custom') {

  };
  const expire = (req.body.suspendExpire === 'custom') ? expireCustom : expireDate;
  const account = await User.findById(req.params.id);
  if (account.isBanned) {
    account.isBanned = undefined;
  }
  account.isSuspended = true;
  account.suspendedExpire = expire;
  account.suspendedReason = reason;
  account.save();
  req.flash('success', `${account.username} has been suspend till ${moment(expire).format('M/D/YYYY h:mm A')} UTC`)
  res.redirect('/admin/users');
});

/**
 * @route /admin/users/:id/unsuspend
 * @method PATCH
 * @description Allows you to unsuspend a user.
 * @access Private
*/
router.patch('/users/:id/unsuspend', async (req, res) => {
  const account = await User.findById(req.params.id)
  account.isSuspended = undefined;
  account.suspendExpire = undefined;
  account.suspendedReason = undefined;
  account.save();
  req.flash('success', `${user.username} has been unsuspend.`)
  res.redirect('/admin/users');
});

/**
 * @route /admin/users/:id/ban
 * @method PATCH
 * @description Bans a user.
 * @access Private
*/
router.patch('/users/:id/ban', async (req, res) => {
  if (req.user.id === req.params.id) {
    req.flash('error', "You can't ban your account.");
    res.redirect('back');
    return;
  };
  const toBan = await User.findById(req.params.id);
  toBan.isBanned = true;
  if (toBan.isSuspended) {
    toBan.isSuspended = undefined;
    toBan.suspendedExpire = undefined;
  }
  toBan.save();
  res.redirect('back');
});

/**
 * @route /admin/users/:id/unban
 * @method PATCH
 * @description Changes the user isBanned to false based on the ID
 * @access Private
*/
router.patch('/users/:id/unban', async (req, res) => {
  if (req.user.id === req.params.id) {
    req.flash('error', "You can't ban your account.");
    res.redirect('back');
    return;
  };
  const toUnban = await User.findById(req.params.id);
  toUnban.isBanned = undefined;
  toUnban.save();
  res.redirect('back');
});

/**
 * @route /admin/users/:id
 * @method PUT
 * @description Shows a edit form for the user
 * @access Private
*/
router.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const username = req.body.username.toString();
  const email = req.body.email.toLowerCase();
  const password = req.body.password.toString();
  const emailVerified = req.body.activate;
  const streamerMode = req.user.streamerMode;
  const isAdmin = req.body.isAdmin;

  updateUser(streamerMode, id, username, email, password, emailVerified, isAdmin, (err, scuress) => {

  });
  // if (streamerMode) {
    // const editUser = await User.findById(id);
    // email = editUser.email;
  // }
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
  };

  Upload.find({ 'uploader': req.params.id }, (err, file) => {
    file.map(file => {
      const filePath = `${path.join(__dirname, '../public')} / u / ${file}`;
      Upload.findOneAndDelete({ fileName: file }, (err, removed) => {
        fs.unlink(filePath);
      });
    });
  });

  Key.findAndDelete({ 'user': { id: req.params.id } }, (err, keys) => {
    keys.map(key => {
      Key.findByIdAndDelete(key.id);
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

    if (req.body.activate) { newUser.emailVerified = true };
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
      };
      req.flash('success', `${username} has been created`);
      res.redirect('/admin/users');
    });
  } else {
    req.flash('error', error)
    res.render('admin/users/new', {
      title: 'Create new user',
      username,
      email,
      password,
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
  const data = (await userPerPage(req, res, 1, User, 8));
  res.render('admin/users/index', {
    title: 'User Management',
    data: data.data,
    current: 1,
    pages: Math.ceil(data.count / 8)
  });
});


module.exports = router;
