const express = require('express');

const router = express.Router();

/**
 * Load MongoDB models.
 */
const Upload = require('../models/Upload');

/**
 * @route /
 * @method GET
 * @description Displays landing page or
 *  users uploads if they are logged inn
 * @access Public/Private
 */
router.get('/i/:fileName', async (req, res) => {
  const upload = await Upload.findOne({
    fileName: req.params.fileName,
    type: 'image'
  });

  console.log(upload);

  if (!upload) {
    res.status(404).send('Not found');
  }

  res.render('view/image', {
    pageTitle: `Viewing ${upload.name || upload.fileName}`,
    pageDesc: process.env.DESC,
    upload,
    pageName: 'viewImage'
  });
});

module.exports = router;
