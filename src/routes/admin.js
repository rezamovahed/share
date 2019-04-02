const express = require('express');
const middleware = require('../middleware');
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

function deleteByUploadFileType(type, file) {
  let filePath = `${path.join(__dirname, '../public')}/u/${type === 'image' ? 'i' : type === 'file' ? 'f' : 't'}/${file}`;
  Upload.findOneAndDelete({ fileName: file }, (err, removed) => {
    fs.unlink(filePath, err => {
      if (err) { return res.status(500) }
    });
  });
}

/**
 * @route /admin/uploads/delete/all
 * @method GET
 * @description Delete Account
 * @access Private
*/
router.get('/uploads/delete/all', (req, res) => {
  let images = [];
  let files = [];
  let texts = [];
  let error;
  Upload.find({}, (err, file) => {
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
      csrfToken: req.csrfToken(),
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
 * @route /admin/users/new
 * @method GET
 * @description Shows create user
 * @access Private
*/
router.get('/users/new', (req, res) => {
  let generatePassword = password.generate({
    length: 10,
    numbers: true
  });
  res.render('admin/users/new', {
    title: 'Create new user',
    csrfToken: req.csrfToken(),
    password: generatePassword,
  });
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
  let images = [];
  let files = [];
  let texts = [];
  let error;
  Upload.find({ 'uploader': req.params.id }, (err, file) => {
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
  console.log(req.body)
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
          csrfToken: req.csrfToken()
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
      csrfToken: req.csrfToken()
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
