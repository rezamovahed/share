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
const Token = require('.././models/Token');

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

    const user = await User.findOne({ slug: req.params.slug });

    // eslint-disable-next-line prefer-const
    let updatedInfomation = {};

    // Allow owner to edit all.
    if (req.user.role === 'owner') {
      if (user.username !== username) {
        updatedInfomation.username = username;
        user.username = username;
      }
      // Check if streamer mode is enabled
      // This is so it will skip if they are in streamer mode.
      if (!req.user.streamerMode) {
        if (user.email !== email) {
          updatedInfomation.email = email;
          user.email = email;
        }
      }
      if (user.role !== role) {
        updatedInfomation.role = role;
        user.role = role;
      }
      // If the new password is entered it will change the password
      if (!isEmpty(newPassword)) {
        updatedInfomation.password = newPassword;
        user.password = newPassword;
      }
    }

    if (req.user.role === 'admin') {
      if (user.username !== username) {
        updatedInfomation.username = username;
        user.username = username;
      }
      // Check if streamer mode is enabled
      // This is so it will skip if they are in streamer mode.

      if (!req.user.streamerMode) {
        if (user.email !== email) {
          updatedInfomation.email = email;
          user.email = email;
        }
      }
    }

    await user.save();
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
    const { slug } = req.params;
    const boolean = req.params.boolean === 'true';

    // Toggle streamer mode
    await User.findOneAndUpdate(
      {
        slug
      },
      {
        streamerMode: boolean
      },
      { $safe: true }
    );
    res.json({
      message: `Streamer mode has been ${
        !boolean ? 'disabled' : 'enabled'
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
    const { slug } = req.params;

    const boolean = req.params.boolean === 'true';

    // Toggle email verifyied
    if (boolean) {
      // Set the token and the expire date.
      await User.findOneAndUpdate(
        {
          slug
        },
        {
          emailVerified: false,
          emailVerificationToken: generate(alphabet, 24),
          emailVerificationTokenExpire: moment().add('3', 'h')
        },
        { $safe: true, $upsert: true }
      );
    } else {
      await User.findOneAndUpdate(
        {
          slug
        },
        {
          $set: {
            emailVerified: true
          },
          $unset: {
            emailVerificationToken: undefined,
            emailVerificationTokenExpire: undefined
          }
        },
        { $safe: true }
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
        $set: {
          mfa: false
        },
        $unset: {
          mfaSecret: undefined
        }
      },
      { $safe: true }
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
        isBanned: data.isBanned,
        isSuspended: data.isSuspended,
        suspendedReason: data.suspendedReason,
        suspendedExpire: data.suspendedExpire,
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
 * Ban user Controller - Allows admins to ban users.
 */
exports.putBan = async (req, res) => {
  try {
    const { slug } = req.params;

    await User.findOneAndUpdate(
      { slug },
      {
        $set: {
          isBanned: true,
          isSuspended: false,
          role: 'user'
        },
        $unset: {
          suspendedExpire: undefined,
          suspendedReason: undefined
        }
      },
      {
        $safe: true
      }
    );
    res.json({ message: 'User has been banned.', status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Unban user Controller - Allows admins to unban users.
 */
exports.putUnban = async (req, res) => {
  try {
    const { slug } = req.params;

    await User.findOneAndUpdate(
      { slug },
      {
        $set: {
          isBanned: false,
          isSuspended: false
        },
        $unset: {
          suspendedExpire: undefined,
          suspendedReason: undefined
        }
      },
      {
        $safe: true
      }
    );
    res.json({ message: 'User has been unbanned.', status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Suspend user Controller - Allows admins to suspend users.
 */
exports.putSuspend = async (req, res) => {
  try {
    const { slug } = req.params;

    // eslint-disable-next-line prefer-const
    let suspendedExpire = moment();

    const { reason, expire, expireCustom } = req.body;

    switch (expire) {
      case '1':
        suspendedExpire = moment().add('24', 'hours');
        break;
      case '7':
        suspendedExpire = moment().add('7', 'days');
        break;
      case '30':
        suspendedExpire = moment().add('1', 'month');
        break;
      default:
        suspendedExpire = moment(expireCustom);
        break;
    }

    const user = await User.findOneAndUpdate(
      { slug },
      {
        isSuspended: true,
        isBanned: false,
        suspendedExpire,
        suspendedReason: reason
      },
      {
        $safe: true
      }
    );

    res.json({
      message: `${user.username} has been suspended for ${moment(
        suspendedExpire
      ).fromNow(true)}`,
      status: 200
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * unsuspended user Controller - Allows admins to unsuspend users.
 */
exports.putUnsuspend = async (req, res) => {
  try {
    const { slug } = req.params;

    await User.findOneAndUpdate(
      { slug },
      {
        $set: {
          isBanned: false,
          isSuspended: false
        },
        $unset: {
          suspendedExpire: undefined,
          suspendedReason: undefined
        }
      },
      {
        $safe: true
      }
    );
    res.json({ message: 'User has been unsuspended.', status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Delete a users account  - REmoves both all the users data such as tokens and uploaded data.
 */
exports.deleteUser = async (req, res) => {
  try {
    const { slug } = req.params;

    const user = await User.findOne({ slug });

    if (!user) {
      return res.status(404).json({ message: 'User not found', status: 404 });
    }

    // Loop uploads to delete one by one;

    const uploads = Upload.find({ uploader: user.id });

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

    const tokens = await Token.find({ user: user.id });
    tokens.map(async data => {
      await Token.findByIdAndDelete(data.id);
    });

    await User.findByIdAndDelete(user.id);

    res.json({ message: `${user.username} has been deleted`, status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Transfer Ownership Controller - Allows owner to move ownership.
 */
exports.postOwnership = async (req, res) => {};

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
