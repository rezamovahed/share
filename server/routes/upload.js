const express = require('express');
const passport = require('passport');
const { customAlphabet } = require('nanoid');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();

/**
 * Load MongoDB models.
 */
const Upload = require('../models/Upload');
const User = require('../models/User');
const Queue = require('../models/Queue');

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
const validateUpdateUploadInput = require('./../validation/upload/updateUpload');

const urlFriendyAlphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * @route /uploads
 * @method GET
 * @description Allows a logged in user to get all of their current uploads
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
router.post('/', requireAuth, isSessionValid, async (req, res) => {
  try {
    const nanoid32 = customAlphabet(urlFriendyAlphabet, 32);
    // TODO add validation file check for mineTypes and fileLimit

    // Get the body
    const { stoage, displayName } = req.body;

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
        const fileDirPath = `${path.join(__dirname, '../public/uploads')}/${
          req.user.id
        }`;
        // eslint-disable-next-line no-case-declarations
        const exists = await fs.pathExists(fileDirPath);
        if (!exists) {
          fs.ensureDirSync(fileDirPath);
        }

        // eslint-disable-next-line no-case-declarations
        const filePath = `${fileDirPath}/${fileName}${extension}`;
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
          file: `${process.env.WEB_URL}/u/${fileName}`,
          delete: `${process.env.WEB_URL}/u/${fileName}/delete?key=${deleteKey}`
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
 * @route /upload
 * @method DELETE
 * @description Allows a logged in user to delete multiple uploaded images.
 */
router.delete('/', requireAuth, isSessionValid, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'User not found.'
      });
    }
    const isBeingProcessed = await Queue.findOne({
      type: 'upload',
      action: 'delete',
      multi: { $ne: false },
      from: req.user.id
    });
    if (isBeingProcessed) {
      return res.status(400).json({
        code: 'IN_PROGRESS',
        message: 'Removing uploads in progress.  This may take a few mins.'
      });
    }
    const newQueue = new Queue({
      type: 'upload',
      action: 'delete',
      multi: true,
      from: req.user.id,
      code: 'REMOVE_ALL_UPLOADS'
    });
    await newQueue.save();

    res.status(200).json({
      code: 'REMOVE_ALL_UPLOADS',
      message: 'Removing all uploads is in process.  This may take a few mins.'
    });
  } catch (e) {
    res.status(500).json({
      code: 'SERVER_ERROR',
      error: 'Internal Server Error.'
    });
  }
});

/**
 * @route /upload/:fileName
 * @method GET
 * @description Allows a logged in user to get basic details about a single uploaded image.
 */
router.get('/:fileName', async (req, res) => {
  try {
    const upload = await Upload.findOne({
      fileName: req.params.upload_id
    })
      .select(
        '-_id uploader fileName fileSize fileExtension fileType storgeURL displayName createdAt'
      )
      .populate({
        path: 'uploader',
        select: 'username slug role -_id'
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
 * @route /upload/:fileName
 * @method PUT
 * @description Allows a logged in user to update the details of a single uploaded image.
 */
router.put('/:fileName', requireAuth, isSessionValid, async (req, res) => {
  try {
    const upload = await Upload.findOne({
      fileName: req.params.fileName,
      uploader: req.user.id
    });

    if (!upload) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Upload not found.'
      });
    }

    /**
     * Validdate the user input for displayName and tags
     */
    const { codes, errors, isValid } = validateUpdateUploadInput(req.body);

    if (!isValid) {
      return res.status(400).json({ codes, errors });
    }

    const { displayName, tags } = req.body;

    upload.displayName = displayName;
    upload.tags = tags;
    await upload.save();
    res.status(200).json({
      upload,
      message: 'Upload updated.',
      code: 'UPLOAD_UPDATED'
    });
  } catch (e) {
    res.status(500).json({
      code: 'SERVER_ERROR',
      error: 'Internal Server Error.'
    });
  }
});

/**
 * @route /upload/:fileName
 * @method DELETE
 * @description Allows a logged in user to delete a single uploaded image.
 */
router.delete('/:fileName', requireAuth, isSessionValid, async (req, res) => {
  try {
    /**
     * Check if uploaded file exists in database
     */
    const upload = await Upload.findOne({
      uploader: req.user.id,
      fileName: req.params.fileName
    });

    if (!upload) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Upload not found.'
      });
    }

    /**
     * Check if uploaded file exists in public directory
     */
    const filePath = `${path.join(__dirname, '../public/uploads')}/${
      req.user.id
    }/${upload.fileName}${upload.fileExtension}`;

    const uploadFile = await fs.pathExists(filePath);

    if (!uploadFile) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Upload not found.'
      });
    }

    /**
     * If exists, delete the file
     */
    await fs.remove(filePath);
    await upload.remove();
    res.status(200).json({
      code: 'REMOVED',
      message: `${upload.displayName} removed.`
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
 * @description Allows a logged in user to get the raw image data for a single uploaded image.
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
