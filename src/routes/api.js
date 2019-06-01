const express = require('express');
const middleware = require('../middleware');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate')
const crypto = require('crypto')
const router = express.Router();
const fs = require('fs');
const path = require('path');
const fileExists = require('file-exists');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const fileExtensionCheck = require('../config/extensions')
const fileMinetypeCheck = require('../config/mineTypes')
const Upload = require('../models/upload');

router.use(fileUpload({
  safeFileNames: true,
  preserveExtension: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: {
    fileSize: process.env.UPLOAD_LIMIT || 100000000
  },
  abortOnLimit: true
}));

function humanFileSize(bytes, si) {
  var thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
}

/**
 * @route /api/delete/?fileName=%{filename}&key=${key}
 * @method GET
 * @description Upload a Image
 * @param ${filename} ${key}
 * @access Private
*/
router.get('/delete', (req, res) => {
  const fileName = req.query.fileName;
  const key = req.query.key;
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
    } else {
      fileExists(filePath, (err, exists) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: {
              message: 'Error'
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
            if (err) { return res.status(500).send('Error in deleteing') }
            res.json({
              success: true,
              message: "Deleted file " + fileName
            });
          });
        })
      });
    }
  });
});

/**
 * @route /api/upload
 * @method POST
 * @description Upload a Image or file etc.
 * @access Private
*/
router.post('/upload', middleware.isAPIKeyVaild, (req, res) => {
  const file = req.files.file;
  const fileExtension = path.extname(file.name);
  const fileMineType = file.mimetype;
  const newFileName = generate(alphabet, 16) + fileExtension;
  const uploadPath = `${path.join(__dirname, '../public')}/u/${newFileName}`;
  const key = crypto.randomBytes(16).toString('hex')
  const rawToken = req.headers['authorization'].split(" ").slice(1).toString();
  const decoded = jwt.decode(rawToken, { complete: true });
  const auth = decoded.payload.sub;
  const fullUrl = req.protocol + '://' + req.hostname
  if (!req.files) {
    res.status(400).json({
      auth: true,
      success: false,
      error: {
        message: 'No file was provided.'
      }
    });
    return;
  }
  const imageCheck = fileExtensionCheck.images.indexOf(fileExtension) == -1 || fileMinetypeCheck.images.indexOf(fileMineType) == -1;
  const fileCheck = fileExtensionCheck.files.indexOf(fileExtension) == -1 || fileMinetypeCheck.files.indexOf(fileMineType) == -1;
  if (process.env.FILE_CHECK && imageCheck && fileCheck) {
    res.status(400).json({
      auth: true,
      success: false,
      error: {
        message: 'Invaid File uploaded.'
      }
    });
    return;
  }
  const size = humanFileSize(file.size)
  const fileHash = file.md5
  let newFile = {
    uploader: auth,
    fileName: newFileName,
    fileExtension,
    fileHash,
    key,
    size
  }
  if (fileExtensionCheck.images.indexOf(fileExtension) === 0 || fileMinetypeCheck.images.indexOf(fileMineType) === 0) {
    newFile.isImage = true
  }

  Upload.create(newFile, (err, uploadedFile) => {
    if (err) { return res.status(500).send('Error in uploading') };
    file.mv(uploadPath, err => {
      if (err) { return res.status(500).send('Error in uploading') }
      res.json({
        success: true,
        file: {
          url: `${fullUrl}/u/${newFileName}`,
          delete: `${fullUrl}/api/delete?fileName=${newFileName}&key=${key}`
        }
      });
    });
  });
});

router.get('*', function (req, res) {
  res.status(404).json({message: 'Not found.'});
});

module.exports = router;
