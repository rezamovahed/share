const express = require('express');
const fs = require('fs-extra');
const passport = require('passport');
const path = require('path');

const { customAlphabet } = require('nanoid');

const router = express.Router();

/**
 * Load MongoDB models.
 */
const Upload = require('../../models/Upload');

/**
 * Load middlewares
 */
const isAPIKeyValid = require('../../middleware/3rd-party/isAPIKeyValid');
const isDeleteKeyValid = require('../../middleware/3rd-party/upload/isDeleteKeyValid');

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
 * @route /3rd-party/upload
 * @method POST
 * @description Allows a logged in user to upload using a 3rd-party client.
 */
router.post('/', requireAuth, isAPIKeyValid, async (req, res) => {
  try {
    const nanoid32 = customAlphabet(urlFriendyAlphabet, 32);
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
        const fileDirPath = `${path.join(__dirname, '../../public/uploads')}/${
          req.user.id
        }`;

        // eslint-disable-next-line no-case-declarations
        const exists = await fs.pathExists(fileDirPath);

        if (!exists) {
          fs.ensureDirSync(fileDirPath);
        }

        // Move the file to a public directory in u folder for express
        await mv(`${fileDirPath}/${fileName}${extension}`);
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
    console.log(e);
    res.status(500).json({
      code: 'SERVER_ERROR',
      error: 'Internal Server Error.'
    });
  }
});

/**
 * @route /3rd-party/upload
 * @method DELETE
 * @description Allows a user deletes an uploaded file using a 3rd-party client.
 */
router.delete('/', isDeleteKeyValid, async (req, res) => {
  try {
    const { deleteKey } = req.body;

    /**
     * Check if uploaded file exists in database
     */
    const upload = await Upload.findOne({ deleteKey });

    if (!upload) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Upload not found.'
      });
    }

    /**
     * Check if uploaded file exists in public directory
     */
    const filePath = `${path.join(__dirname, '../../public/uploads')}/${
      upload.uploader
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
    console.log(e);
    res.status(500).json({
      code: 'SERVER_ERROR',
      error: 'Internal Server Error.'
    });
  }
});

module.exports = router;
