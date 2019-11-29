const express = require('express');

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate');

const router = express.Router();
const fs = require('fs');
const path = require('path');
const fileExists = require('file-exists');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware');
const fileExtensionCheck = require('../config/extensions');
const fileMinetypeCheck = require('../config/mineTypes');
const Upload = require('../models/upload');
const User = require('../models/user');

router
  .use();

function humanFileSize(bytes, si) {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  do {
    bytes /= thresh;
    // eslint-disable-next-line no-plusplus
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
}

/**
 * @route /api/delete/?fileName=%{filename}&key=${key}
 * @method GET
 * @description Upload a Image
 * @param ${filename} ${key}
 * @access Private
 */
router.get('/delete', (req, res) => {
  const { fileName } = req.query;
  const { key } = req.query;
  const filePath = `${path.join(__dirname, '../public')}/u/${fileName}`;
  if (req.query && !fileName && !key) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'No filename or key provided'
      }
    });
  }

  if (!req.query.fileName) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'No filename provided'
      }
    });
  }

  if (!req.query.key) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'No key provided'
      }
    });
  }

  Upload.findOne({ key: req.query.key }, (err, upload) => {
    if (upload === null) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invaid key provided'
        }
      });
    }

    fileExists(filePath, (err, exists) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: {
            message: 'Error in removing'
          }
        });
      }

      if (!exists) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No such file exists.'
          }
        });
      }

      Upload.findOneAndDelete({ fileName }, (err, upload) => {
        fs.unlink(filePath, err => {
          if (err) {
            return res.status(500).send('Error in deleteing');
          }
          res.json({
            success: true,
            message: `Deleted file ${fileName}`
          });
        });
      });
    });
  });
});

/**
 * @route /api/upload
 * @method POST
 * @description Upload a Image or file etc.
 * @access Private
 */
router.post(
  '/upload',
  middleware.isAPIKeyVaild,
  middleware.isUploaderBanned,
  (req, res) => {
    const { file } = req.files;
    const fileExtension = path.extname(file.name);
    const fileMineType = file.mimetype;
    const newFileName = generate(alphabet, 16) + fileExtension;
    const uploadPath = `${path.join(__dirname, '../public')}/u/${newFileName}`;
    const key = generate(alphabet, 16);
    const rawToken = req.headers.authorization
      .split(' ')
      .slice(1)
      .toString();
    const decoded = jwt.decode(rawToken, { complete: true });
    const auth = decoded.payload.sub;
    const fullUrl = `${req.protocol}://${req.hostname}`;
    if (!req.files) {
      return res.status(400).json({
        auth: true,
        success: false,
        error: {
          message: 'No file was provided.'
        }
      });
    }

    // Runs checks if file check is enabled and saves them
    if (process.env.FILE_CHECK) {
      const imageCheck =
        fileExtensionCheck.images.indexOf(fileExtension) === -1 ||
        fileMinetypeCheck.images.indexOf(fileMineType) === -1;
      const fileCheck =
        fileExtensionCheck.files.indexOf(fileExtension) === -1 ||
        fileMinetypeCheck.files.indexOf(fileMineType) === -1;

      // If both checks are true then that means its a invaid file.
      if (imageCheck && fileCheck) {
        return res.status(400).json({
          auth: true,
          success: false,
          error: {
            message: 'Invaid File uploaded.'
          }
        });
      }
    }

    // Logs the upload even if it fails

    User.findById(auth, (err, user) => {
      user.lastActivity = Date.now();
      user.save();
    });
    // Gets the file size and the hash of the file (Ya I know MD5 is not the best but its just its shorter.  If I get many requests for stonger hash I will add it.)
    const size = humanFileSize(file.size);
    const fileHash = file.md5;

    // Creates the object for the file to be added to the database
    const newFile = {
      uploader: auth,
      fileName: newFileName,
      fileExtension,
      fileHash,
      key,
      size
    };

    // If the file is a image then add the isImage to true.
    if (
      fileExtensionCheck.images.indexOf(fileExtension) === 0 ||
      fileMinetypeCheck.images.indexOf(fileMineType) === 0
    ) {
      newFile.isImage = true;
    }

    /**
     * Adds the file to the database with basic infomation and moves it to the folder.
     * Also adds the removel key which is added for support for sharex
     */
    Upload.create(newFile, (err, uploadedFile) => {
      if (err) {
        return res.status(500).send('Error in uploading');
      }
      file.mv(uploadPath, err => {
        if (err) {
          return res.status(500).send('Error in uploading');
        }
        res.json({
          success: true,
          file: {
            url: `${fullUrl}/u/${newFileName}`,
            delete: `${fullUrl}/api/delete?fileName=${newFileName}&key=${key}`
          }
        });
      });
    });
  }
);

// If any else is sent on the API endpoint it will return a 404
router.get('*', (req, res) => res.status(404).json({ message: 'Not found.' }));

module.exports = router;
