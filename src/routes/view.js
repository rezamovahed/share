const express = require('express');
const router = express.Router();
const Upload = require('../models/upload');

/**
 * @route /view/:fileName
 * @method GET
 * @description Shows a webpage with file
 * @access Private
*/
router.get('/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const fullUrl = req.protocol + '://' + req.get('host');
  Upload.findOne({ fileName }, (err, uploaded) => {
    res.render('view/image', {
      title: `${fileName}`,
      fileName,
      fullUrl
    });
  });
});

module.exports = router;
