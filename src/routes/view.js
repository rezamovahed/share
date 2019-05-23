const express = require('express');
const router = express.Router();
const Upload = require('../models/upload');

/**
 * @route /view/i/:fileName
 * @method GET
 * @description Shows a webpage with file
 * @access Private
*/

router.get('/view//:fileName', (req, res) => {
  let fullUrl = req.protocol + '://' + req.get('host');
  Upload.findOne({ 'fileName': req.params.fileName }, (err, uploaded) => {
    res.render('view/image', {
      title: `Viewing Image`,
      fullUrl
    });
  })
});

module.exports = router;
