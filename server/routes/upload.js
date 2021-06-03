const express = require('express');
const passport = require('passport');
const { customAlphabet } = require('nanoid');
const path = require('path');

const router = express.Router();

/**
 * Load MongoDB models.
 */
const User = require('../models/User');
const Upload = require('../models/Upload');

/**
 * Load middlewares
 */
const isSessionValid = require('../middleware/auth/isSessionValid');

/**
 * Require authentication middleware.
 */
const requireAuth = passport.authenticate('jwt', {
  session: false
});

/**
 * Load input validators.
 */

const urlFriendyAlphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * @route /uploads
 * @method GET
 * @description Allows a logged in user to get their current uploads
 */
router.get('/', requireAuth, isSessionValid, async (req, res) => {
  try {
    const uploads = await Upload.find({ uploader: req.user.id });

    const totalUploads = uploads.length;

    res.status(200).json({ uploads, total: totalUploads });
  } catch (e) {
    res.status(500).json({
      code: 'SERVER_ERROR',
      error: 'Internal Server Error.'
    });
  }
});

/**
 * @route /uploads
 * @method POST
 * @description Allows a logged in user to upload a file to the server
 */
router.get('/', requireAuth, isSessionValid, async (req, res) => {
  try {
    const nanoid32 = customAlphabet(urlFriendyAlphabet, 64);
    // TODO add validation file check for mineTypes and fileLimit

    // Get the body
    const { stoage, displayName } = req.body;

    // Get the files
    const { name, size, mimetype, mv } = req.files.file;

    const tags = JSON.parse(req.body.tags) || [];
    const extension = path.extname(name);

    // Create a random file name using nanoid
    const fileName = nanoid32();

    // Create a random delete key
    const deleteKey = nanoid32();

    switch (stoage) {
      default:
        // eslint-disable-next-line no-case-declarations
        const filePath = `${path.join(__dirname, '../../public/uploads')}/${
          req.user.id
        }/${fileName}${extension}`;
        // Move the file to a public directory in u folder for express
        await mv(filePath);
        break;
    }

    const upload = new Upload({
      uploader: req.user.id,
      displayName: displayName || fileName,
      fileExtension: extension,
      fileName,
      fileType: mimetype,
      deleteKey,
      fileSize: size,
      tags
    });

    await upload.save();
    res.status(201).json({
      file: {
        name: fileName,
        size,
        tags,
        url: {
          file: `${process.env.FULL_DOMAIN}/u/${fileName}`,
          delete: `${process.env.FULL_DOMAIN}/u/${fileName}/delete?key=${deleteKey}`
        },
        deleteKey
      }
    });
  } catch (e) {
    res.status(500).json({
      code: 'SERVER_ERROR',
      error: 'Internal Server Error.'
    });
  }
});

/**
 * @route /upload/:upload_id
 * @method GET
 * @description Allows a logged in user to get basic details aboout uploaded image.
 */
router.get('/:upload_id', async (req, res) => {
  try {
    const upload = await Upload.findOne({
      fileName: req.params.upload_id
    })
      .select(
        '-_id uploader fileName fileSize fileExtension fileType storgeURL displayName'
      )
      .populate({
        path: 'uploader',
        select: 'username -_id'
      });

    if (!upload) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Upload not found.'
      });
    }
    res.status(200).json({
      upload
    });
  } catch (e) {
    res.status(500).json({
      code: 'SERVER_ERROR',
      error: 'Internal Server Error.'
    });
  }
});

/**
 * @route /upload/:upload_id/raw
 * @method GET
 * @description Allows a logged in user to upload a file to the server
 */
router.get('/:upload_id/raw', async (req, res) => {
  try {
    const upload = await Upload.findOne({ fileName: req.params.upload_id });

    if (!upload) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Upload not found.'
      });
    }

    const filePath = `${path.join(__dirname, '../public/uploads')}/${
      upload.uploader
    }/${upload.fileName}${upload.fileExtension}`;

    res.status(200).sendFile(filePath);
  } catch (e) {
    res.status(500).json({
      code: 'SERVER_ERROR',
      error: 'Internal Server Error.'
    });
  }
});

module.exports = router;
