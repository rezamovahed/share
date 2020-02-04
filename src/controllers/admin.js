/* eslint-disable indent */
const path = require('path');
const fs = require('fs-extra');

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
 * Upoloads lising mini API Controller- Takes data from lib and returns results.
 */
exports.getUploadListData = async (req, res) => {
  try {
    const sort = req.query.order === 'asc' ? 1 : -1;
    const limit = parseFloat(req.query.limit);
    const offset = parseFloat(req.query.offset);

    const uploadsData = await Upload.find({})
      .sort({ uploadedAt: sort })
      .limit(limit)
      .skip(offset)
      .select('uploaded uploadedAt fileName size type fileExtension uploader')
      .populate({ path: 'uploader', select: 'username isVerified role slug' });

    // eslint-disable-next-line prefer-const
    let uploads = [];
    let id = 0;
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

    const uploadedFileExt = path.extname(uploadedFile);
    const uploadedFileName = uploadedFile.replace(uploadedFileExt, '');

    const uploadedFilePath = `${path.join(
      __dirname,
      '../public'
    )}/u/${uploadedFile}`;

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
    fs.remove(uploadedFilePath);
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
    const sort = req.query.order === 'asc' ? 1 : -1;
    const limit = parseFloat(req.query.limit);
    const offset = parseFloat(req.query.offset);
    const search = req.query.search !== undefined && !isEmpty(req.query.search);

    let userData = [];
    if (search) {
      userData = await User.find({ $text: { $search: req.query.search } })
        .sort({ createdAt: sort })
        .limit(limit)
        .skip(offset)
        .select(
          'username slug email createdAt role emailVerified newEmail streamerMode isVerified lastLogin'
        );
    } else {
      userData = await User.find({})
        .sort({ createdAt: sort })
        .limit(limit)
        .skip(offset)
        .select(
          'username slug email createdAt role emailVerified newEmail streamerMode isVerified lastLogin'
        );
    }

    // eslint-disable-next-line prefer-const
    let users = [];
    let id = 0;
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

    const uploadedFileExt = path.extname(uploadedFile);
    const uploadedFileName = uploadedFile.replace(uploadedFileExt, '');

    const uploadedFilePath = `${path.join(
      __dirname,
      '../public'
    )}/u/${uploadedFile}`;

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
    fs.remove(uploadedFilePath);
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
