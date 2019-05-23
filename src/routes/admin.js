const express = require('express');
const router = express.Router();
const Upload = require('../models/upload');
const User = require('../models/user');
const Key = require('../models/key');
const fs = require('fs');
const path = require('path');
const password = require('generate-password');
const gravatar = require('gravatar');
const validator = require('validator')

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
    .sort({ createdAt: -1 })
    .populate('uploader')
    .exec((err, data) => {
      model.countDocuments().exec((err, count) => {
        res.render(render, {
          title,
          data,
          current: page,
          pages: Math.ceil(count / limit),
        });
      })
    })
}

function usersListingPerPage(req, res, page, model, limit, render, title) {
  model
    .find({})
    .skip((limit * page) - limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec((err, data) => {
      model.countDocuments().exec((err, count) => {
        res.render(render, {
          title,
          data,
          current: page,
          pages: Math.ceil(count / limit)
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
  uploaderListingPerPage(req, res, 1, Upload, 10, 'admin/uploads', 'Uploads Management')
});

/**
 * @route /admin/uploads/:page
 * @method GET
 * @description Show Admin Dashboard
 * @access Private
*/
router.get('/uploads/:page', (req, res) => {
  uploaderListingPerPage(req, res, req.params.page, Upload, 10, 'admin/uploads', 'Uploads Management')
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
    const fileName = req.query.name
    const filePath = `${path.join(__dirname, '../public')}/u/${fileName}`;
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
 * @route /admin/uploads/delete/all
 * @method GET
 * @description Delete Account
 * @access Private
*/
router.get('/uploads/delete/all', (req, res) => {
  let error;
  Upload.find({}, (err, file) => {
    file.map(file => {
      const filePath = `${path.join(__dirname, '../public')}/u/${file}`;
      Upload.findOneAndDelete({ fileName: file }, (err, removed) => {
        fs.unlink(filePath, err => {
          if (err) { return res.status(500) }
        });
      });
    });
  });
  res.redirect('back')
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
    })
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
 * @route /admin/users/:id
 * @method GET
 * @description Shows a edit form for the user
 * @access Private
*/
router.get('/users/:id', (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    let username = user.username;
    let email = user.email;
    let accountActivated = user.accountActivated;
    let isAdmin = user.isAdmin;
    // Add user password change.
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
  const isAdmin = req.body.admin;
  const avatar = gravatar.url(req.body.email, {
    s: '100',
    r: 'x',
    d: 'retro'
  }, true);
  let error = {};

  // Check if empty
  // Username
  if (!username) { error.username = 'Please enter your username.' }
  // Email
  // Check if email is vaid
  if (!email) { error.email = 'Please enter your email.' }
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' }

  // Password
  if (password && validator.isLength(password, {
    minimum: 8
  })) {
    error.password = 'Password must be at least 8 characters long.'
  }

  if (JSON.stringify(error) === '{}') {
    let updatedUser = {
      username,
      email,
      accountActivated,
      isAdmin,
      avatar
    }
    User.findByIdAndUpdate(id, updatedUser, (err, user) => {

      if (err) {
        if (err.code === 11000) {
          error.username = 'Username may be already in use.'
          error.email = 'EMail may be already in use.'
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
      req.flash('success', 'User has been updated');
      res.redirect('/admin/users');
      return;
    });
  } else {
    req.flash('error', error);
    res.redirect(`/admin/users/${id}`);
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
    req.flash('error', "You can't remove your own user")
    res.redirect('back')
    return;
  }
  let error;
  Upload.find({ 'uploader': req.params.id }, (err, file) => {
    file.map(file => {
      const filePath = `${path.join(__dirname, '../public')}/u/${file}`;
      Upload.findOneAndDelete({ fileName: file }, (err, removed) => {
        fs.unlink(filePath, err => {
          if (err) { return res.status(500) }
        });
      });
    });
  });
  Key.find({ 'user': { id: req.params.id } }, (err, keys) => {
    keys.map(key => {
      Key.findByIdAndDelete(key.id, (err, removedKey) => {
      });
    });
  });
  User.findByIdAndDelete(req.params.id, (err, removedUser) => {
    req.flash('success', `${removedUser.username} has been removed.`)
    res.redirect('back')
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
  if (!username) { error.username = 'Please enter your username.' }
  // Email
  if (!email) { error.email = 'Please enter your email.' }
  // Password
  if (!password) { error.password = 'Must have a pssword' }

  // Check if email is vaid
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' }
  // Check if passoword and comfirm password are the same.
  // Check password length
  if (!validator.isLength(password, {
    minimum: 8
  })) {
    error.password = 'Password must be at least 8 characters long. '
  }
  if (JSON.stringify(error) === '{}') {
    let newUser = {
      username,
      email,
      avatar,
    }
    if (req.body.activate) { newUser.accountActivated = true }
    if (req.body.admin) { newUser.isAdmin = true }
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
      req.flash('success', `${username} has been created`)
      res.redirect('/admin/users')
    })
  } else {
    req.flash('error', error)
    res.render('admin/users/new', {
      title: 'Create new user',
      username: username,
      email: email,
      password: password,

    });
  }
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
router.get('/users/:pages', (req, res) => {
  usersListingPerPage(req, res, req.params.page, User, 10, 'admin/users/index', 'User Management')
});

module.exports = router;
