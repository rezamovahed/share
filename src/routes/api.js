const express = require('express');
const middleware = require('../middleware');
const nanoid = require('nanoid');
const generate = require('nanoid/generate')
const crypto = require('crypto')
const router = express.Router();
const fs = require('fs');
const path = require('path');
const fileExists = require('file-exists');
const fileUpload = require('express-fileupload');
const fileExtensionCheck = require('../config/extensions')

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
/**
 * @route /api/upload/image
 * @method POST
 * @description Upload a Image
 * @access Private
*/
router.post('/upload/image', middleware.isAPIKeyVaild, (req, res) => {
  const file = req.files.file;
  const fileExtension = path.extname(file.name);
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
  const newFileName = generate(alphabet, 12) + fileExtension;
  const uploadPath = `${path.join(__dirname, '../public')}/u/i/${newFileName}`;
  const buf = crypto.randomBytes(16);
  const key = buf.toString('hex')
  if (!req.files) {
    res.status(400).json({
      success: false,
      error: {
        message: 'No file was provided.'
      }
    });
    return;
  }
  if (process.env.EXTENSION_CHECK && fileExtensionCheck.images.indexOf(fileExtension) == -1) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invaid File Extension uploaded.'
      }
    });
    return;
  }
  // if(file)
  res.send(file)
  // file.mv(uploadPath, err => {
  // if (err) { return res.status(500).send('Error in uploading') }
  // res.json({
  // success: true,
  // file: {
  // url: `${process.env.URL || `http://localhost:${process.env.PORT || 1234}`}/u/i/${newFileName}`,
  // delete_url: `${process.env.URL || `http://localhost:${process.env.PORT || 1234}`}/delete?fileName=${newFileName}&key=${key}`
  // }
  // });
  // });
});

module.exports = router;
