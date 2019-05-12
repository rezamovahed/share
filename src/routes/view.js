const express = require('express');
const router = express.Router();
const Upload = require('../models/upload');

/**
 * @route /view/i/:fileName
 * @method GET
 * @description Shows a webpage with file
 * @access Private
*/

router.get('/view/i/:fileName', (req, res) => {
  let fullUrl = req.protocol + '://' + req.get('host')
  Upload.findOne({ 'fileName': req.params.fileName }, (err, uploaded) => {
    const file = {
      name: uploaded.fileName,
      size: uploaded.size,
      createdAt: uploaded.createdAt,
      fileType: uploaded.isImage ? 'image' : uploaded.isFile ? 'file' : 'text'
    }
    res.render('view/image', {
      title: `Viewing Image`,
      file,
      fullUrl
    });

  })
});

module.exports = router;
