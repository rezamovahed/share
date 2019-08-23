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
const usersListingPerPage = require('./utils/userLisingPerPage');
const deleteUpload = require('./utils/deleteUpload');
const router = express.Router();

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
    });
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
  const uploads = (await uploadsLisingPerPage(req, res, 1, 10, true, 'uploader'));
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
  const uploads = (await uploadsLisingPerPage(req, res, req.params.page, 10, true, 'uploader'));
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
        };
      });
    };
  });

  setTimeout(() => {
    if (deleteErrors.file > 0 || deleteErrors.db > 0) {
      req.flash('error', `Could not remove that file.  Please try again. If this keeps happening then contact the site admin <a href="/me/support">here</a>`);
      res.redirect('/me/uploads');
      return;
    };
    // All uploads has been removed
    req.flash('success', `Deleted ${fileName}`);
    res.redirect('back');
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
          };
        });
      };
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
  const data = (await usersListingPerPage(req, res, req.params.page, User, 8));
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
    const accountActivated = user.accountActivated;
    const isAdmin = user.isAdmin;
    const lastLog = user.lastLog || 'N/A';
    const lastLogIP = user.lastLogIP || 'N/A';
    const createdIP = user.createdIP || 'N/A';
    const lastActivity = user.lastActivity || 'N/A';
    const lastActivityIP = user.lastActivityIP || 'N/A';
    const isBanned = user.isBanned;
    const isSuspended = user.isSuspended;
    const suspendedReason = user.suspendedReason;
    const suspendedExpire = user.suspendedExpire || null;
    res.render('admin/users/edit', {
      title: `Edit ${username}`,
      username,
      email,
      accountActivated,
      isAdmin,
      lastLog,
      lastLogIP,
      createdIP,
      lastActivity,
      lastActivityIP,
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
router.patch('/users/:id/suspend', (req, res) => {
  let reason = req.body.reason;
  const expireCustom = moment(req.body.suspendExpireCustom, "M/D/YYYY h:mm A").utc();
  const expireDate = moment().add(req.body.suspendExpire || 0, 'days');

  if (!reason) {
    reason = 'For breaking the reasons you have been issued a temp suspend from our site';
  }
  if (req.body.suspendExpire === 'custom') {

  };
  const expire = (req.body.suspendExpire === 'custom') ? expireCustom : expireDate;
  User.findById(req.params.id, (err, user) => {
    if (user.isBanned) {
      user.isBanned = undefined;
    }
    user.isSuspended = true;
    user.suspendedExpire = expire;
    user.suspendedReason = reason;
    user.save();
    req.flash('success', `${user.username} has been suspend till ${moment(expire).format('M/D/YYYY h:mm A')} UTC`)
    res.redirect('/admin/users');
  });
});

/**
 * @route /admin/users/:id/unsuspend
 * @method PATCH
 * @description Allows you to unsuspend a user.
 * @access Private
*/
router.patch('/users/:id/unsuspend', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    user.isSuspended = undefined;
    user.suspendExpire = undefined;
    user.suspendedReason = undefined;
    user.save();
    req.flash('success', `${user.username} has been unsuspend.`)
    res.redirect('/admin/users');
  });
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
  let toBan = await User.findById(req.params.id);
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
    req.flash('error', "You can't remove your account.");
    res.redirect('back');
    return;
  };
  let toUnban = await User.findById(req.params.id);
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

  let updatedUser = {
    username,
    email,
    accountActivated,
    avatar
  }
  // Check if empty
  // Username
  if (!username) { error.username = 'Please enter a username.' };

  if (req.user.streamerMode) {
    const editUser = await User.findById(id);
    updatedUser.email = editUser.email;

  } else {
    // Email
    // Check if email is vaid
    if (!email) { error.email = 'Please enter your email.' };
    if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' };
  }

  // Password
  if (password && validator.isLength(password, {
    minimum: 8
  })) {
    error.password = 'Password must be at least 8 characters long.';
  }

  if (JSON.stringify(error) === '{}') {

    if (req.body.isAdmin) {
      updatedUser.isAdmin = true
    } else {
      updatedUser.isAdmin = false;
    };
    User.findByIdAndUpdate(id, updatedUser, (err, user) => {
      if (err) {
        if (err.code === 11000) {
          error.username = 'Username may be already in use.';
          error.email = 'Email may be already in use.';
        }
        req.flash('error', error);
        res.redirect(`/admin/users/${id}`);
        return;
      };
      if (password) {
        user.setPassword(password, (err, newPassword) => { });
      };
      if (req.user.streamerMode) {
        req.flash('success', `${username} has been updated. Email has been left unchanged due to streamer mode being enabled.`);
        res.redirect('/admin/users');
        return;
      };
      // Add user password change.
      req.flash('success', `${username} has been updated.`);
      res.redirect('/admin/users');
      return;
    });
  } else {
    req.flash('error', error);
    res.redirect(`/admin/users/${id}`);
  };
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
      displayName: username,
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
  const data = (await usersListingPerPage(req, res, 1, User, 8));
  res.render('admin/users/index', {
    title: 'User Management',
    data: data.data,
    current: 1,
    pages: Math.ceil(data.count / 8)
  });
});


module.exports = router;
