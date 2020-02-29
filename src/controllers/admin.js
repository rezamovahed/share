/* eslint-disable indent */
const path = require('path');
const fs = require('fs-extra');
const generate = require('nanoid/generate');
const moment = require('moment');

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Load MongoDB models.
 */
const User = require('.././models/User');
const Upload = require('.././models/Upload');

/**
 * Load vaildation middleware
 */
const isEmpty = require('../validation/isEmpty');

/**
 * Edit user Controller - Allows admins to update users accounts.
 */
exports.putEditUser = async (req, res) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { username, email, role, newPassword } = req.body;

    const streamerMode = !isEmpty(req.body.streamerMode);
    const emailVerified = !isEmpty(req.body.emailVerified);

    const user = await User.findOne({ slug: req.params.slug });

    // This is a object that will include only which has been updated.
    const updatedInfomation = {};

    // Allow owner to edit all.
    if (req.user.role === 'owner') {
      if (user.username !== username) {
        updatedInfomation.username = username;
      }
      // Check if streamer mode is enabled
      // This is so it will skip if they are in streamer mode.
      if (!req.user.streamerMode) {
        if (user.email !== email) {
          updatedInfomation.email = email;
        }
      }
      if (user.role !== role) {
        updatedInfomation.role = role;
      }
    }

    if (req.user.role === 'admin') {
      if (user.username !== username) {
        updatedInfomation.username = username;
      }
      // Check if streamer mode is enabled
      // This is so it will skip if they are in streamer mode.

      if (!req.user.streamerMode) {
        if (user.email !== email) {
          updatedInfomation.email = email;
        }
      }
    }

    await User.findOneAndUpdate(
      {
        slug: req.params.slug
      },
      updatedInfomation,
      { $safe: true, $upsert: true }
    );

    if (isEmpty(updatedInfomation)) {
      req.flash('error', "You didn't change any of the user infomation.");
      return res.redirect(`/admin/users/edit/${user.slug}`);
    }
    req.flash('success', 'User has been updated.');
    res.redirect(`/admin/users/${user.slug}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Toggle users streamer mode Controller - Allows admins to update users streamer mode status.
 */
exports.putStreamerMode = async (req, res) => {
  try {
    const { boolean, slug } = req.params;
    // Toggle streamer mode
    await User.findOneAndUpdate(
      {
        slug
      },
      {
        streamerMode: boolean
      },
      { $safe: true, $upsert: true }
    );
    res.json({
      message: `Streamer mode has been ${
        boolean === 'false' ? 'disabled' : 'enabled'
      } for this user`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
/**
 * Toggle users email verified Controller - Allows admins to update users email verified status.
 */

exports.putEmailVerified = async (req, res) => {
  try {
    const { boolean, slug } = req.params;
    // Toggle email verifyied
    if (boolean === 'true') {
      await User.findOneAndUpdate(
        {
          slug
        },
        {
          emailVerified: true,
          emailVerificationToken: undefined,
          emailVerificationTokenExpire: undefined
        },
        { $safe: true, $upsert: true }
      );
    } else {
      // Set the token and the expire date.
      const token = await generate(alphabet, 24);
      const tokenExpire = moment().add('3', 'h');

      await User.findOneAndUpdate(
        {
          slug
        },
        {
          emailVerified: false,
          emailVerificationToken: token,
          emailVerificationTokenExpire: tokenExpire
        },
        { $safe: true, $upsert: true }
      );
    }

    res.json({
      message:
        boolean === 'false'
          ? 'User must now verify there email before they can login.'
          : 'User can now login even if they did not verify there email.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Delete users mfa Controller - Allows admins to update users mfa.
 */
exports.deleteUserMFA = async (req, res) => {
  try {
    // Remove another users MFA
    await User.findOneAndUpdate(
      {
        slug: req.params.slug
      },
      {
        mfa: false,
        mfaSecret: undefined
      },
      { $safe: true, $upsert: true }
    );
    res.json({
      message: 'MFA has been disabled for this user.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Upoloads lising mini API Controller- Takes data from lib and returns results.
 */
exports.getUploadListData = async (req, res) => {
  try {
    // Simple query params used by table to sort,limit, and offet.
    const sort = req.query.order === 'asc' ? 1 : -1;
    const limit = parseFloat(req.query.limit);
    const offset = parseFloat(req.query.offset);

    const uploadsData = await Upload.find({})
      .sort({ uploadedAt: sort })
      .limit(limit)
      .skip(offset)
      .select('uploaded uploadedAt fileName size type fileExtension uploader')
      .populate({
        path: 'uploader',
        select: 'username isVerified role slug'
      });

    // eslint-disable-next-line prefer-const
    let uploads = [];
    let id = 0;
    // Creates uploadsData object which is used to return for the table.
    uploadsData.map(data => {
      uploads.push({
        id: (id += 1),
        file: data.fileName,
        extension: data.fileExtension,
        type: data.type,
        size: data.size,
        uploadedAt: data.uploadedAt,
        uploader: data.uploader.username,
        slug: data.uploader.slug,
        isVerified: data.uploader.isVerified
      });
    });

    const total = await Upload.countDocuments({
      uploader: req.user.id
    });

    res.json({
      total,
      rows: uploads
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Delete upload mini API - Removes a file from database and filesystem.
 */
exports.deleteSingleUpload = async (req, res) => {
  try {
    const { uploadedFile } = req.params;

    // Gets the file ext and file name.
    const uploadedFileExt = path.extname(uploadedFile);
    const uploadedFileName = uploadedFile.replace(uploadedFileExt, '');

    // Creates the file path
    const uploadedFilePath = `${path.join(
      __dirname,
      '../public'
    )}/u/${uploadedFile}`;

    // Removes the file from the database
    const upload = await Upload.findOneAndDelete({
      fileName: uploadedFileName
    });

    if (!upload) {
      if (req.user.streamerMode) {
        return res.status(404).json({
          message: `<strong>${uploadedFileName.substring(
            0,
            3
          )}*********************</strong> was not found.`,
          status: 404
        });
      }
      return res.status(404).json({
        message: `<strong>${uploadedFileName}</strong> was not found.`,
        status: 404
      });
    }
    // Removes the file form the disk
    await fs.remove(uploadedFilePath);
    if (req.user.streamerMode) {
      return res.json({
        message: `<strong>${uploadedFileName.substring(
          0,
          3
        )}*********************</strong> has been deleted.`,
        status: 200
      });
    }
    res.json({
      message: `<strong>${uploadedFileName}</strong> has been deleted.`,
      status: 200
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Upoloads lising mini API Controller- Takes data from lib and returns results.
 */
exports.getUserListData = async (req, res) => {
  try {
    // Simple query params used by table to sort,limit, and offet.
    // Plus with a username and email serach.
    const sort = req.query.order === 'asc' ? 1 : -1;
    const limit = parseFloat(req.query.limit);
    const offset = parseFloat(req.query.offset);
    const search = req.query.search !== undefined && !isEmpty(req.query.search);

    const userSelect =
      'username slug email createdAt role emailVerified newEmail streamerMode isVerified lastLogin lastLoginIP isBanned isSuspended';
    let userData = [];
    if (search) {
      userData = await User.find({ $text: { $search: req.query.search } })
        .sort({ createdAt: sort })
        .limit(limit)
        .skip(offset)
        .select(userSelect);
    } else {
      userData = await User.find({})
        .sort({ createdAt: sort })
        .limit(limit)
        .skip(offset)
        .select(userSelect);
    }

    // eslint-disable-next-line prefer-const
    let users = [];
    let id = 0;

    // Creates userData object to return to the table.
    userData.map(data => {
      users.push({
        id: (id += 1),
        username: data.username,
        slug: data.slug,
        email: data.email,
        role: data.role,
        emailVerified: data.emailVerified,
        newEmail: data.newEmail,
        createdAt: data.createdAt,
        streamerMode: data.streamerMode,
        isVerified: data.isVerified,
        lastLogin: data.lastLogin
      });
    });

    const total = await User.countDocuments({});

    res.json({
      total,
      rows: users
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Delete Upload in gallery - Removes a file from database and filesystem.
 */
exports.deleteGallerySingleUpload = async (req, res) => {
  try {
    const { uploadedFile } = req.params;

    // Gets the file ext and file name
    const uploadedFileExt = path.extname(uploadedFile);
    const uploadedFileName = uploadedFile.replace(uploadedFileExt, '');

    // Gets the file path
    const uploadedFilePath = `${path.join(
      __dirname,
      '../public'
    )}/u/${uploadedFile}`;

    // Removes upload from the database
    const upload = await Upload.findOneAndDelete({
      fileName: uploadedFileName
    });

    if (!upload) {
      if (req.user.streamerMode) {
        req.flash(
          'error',
          `<strong>${uploadedFileName.substring(
            0,
            3
          )}*********************</strong> was not found.`
        );
        return res.redirect('/admin/gallery');
      }
      req.flash('error', `<strong>${uploadedFileName}</strong> was not found.`);
      return res.redirect('/admin/gallery');
    }
    // Removes upload from disk
    await fs.remove(uploadedFilePath);
    if (req.user.streamerMode) {
      req.flash(
        'success',
        `
        <strong>${uploadedFileName.substring(
          0,
          3
        )}*********************</strong> has been deleted.`
      );
      return res.redirect('/admin/gallery');
    }
    req.flash(
      'success',
      `<strong>${uploadedFileName}</strong> has been deleted.`
    );
    res.redirect('/admin/gallery');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Delete all uploads for all users - Removes all file from database and filesystem that users have uploaded..
 */
exports.deleteAllUploads = async (req, res) => {
  try {
    // Finds all the uploads
    const uploads = await Upload.find({});

    // If none then return that there is no uploaded files.
    if (uploads.length === 0) {
      req.flash('error', 'No files have been uploaded yet.');
      return res.redirect('/admin/uploads');
    }

    // Deletes uploads one by one.
    uploads.map(async data => {
      const uploadedFileExt = data.fileExtension;
      const uploadedFileName = data.fileName;

      const uploadedFilePath = `${path.join(
        __dirname,
        '../public'
      )}/u/${uploadedFileName + uploadedFileExt}`;

      await Upload.findOneAndDelete({
        fileName: uploadedFileName
      });
      await fs.remove(uploadedFilePath);
    });

    req.flash('success', 'All users uploads have been removed.');
    res.redirect('/admin/uploads');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Delete all uploads for all users - Removes all file from database and filesystem that users have uploaded..
 */
// exports.deleteAllToken = async (req, res) => {
//   try {
//     const uploads = await Upload.find({});

//     req.flash('success', 'All users uploads have been removed.');
//     res.redirect('/');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// };
