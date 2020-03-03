const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate');
const fs = require('fs-extra');
const path = require('path');
const filesize = require('filesize');
const moment = require('moment');
const mineTypes = require('../../../config/mineTypes');

/**
 * Load MongoDB models.
 */
const User = require('../../../models/User');
const Upload = require('../../../models/Upload');

/**
 * Upload file Controler - Allows users upload a file or image using there API Key
 * This returns the URL where the file is hosted and a delete link.
 */
module.exports.uploadFile = async (req, res, next) => {
  try {
    // TODO add vaildation file check
    // TODO add check for file or image or text and then set the type in res.locals.type
    const { file } = req.files;
    const fileExtension = path.extname(file.name);
    const fileMineType = file.mimetype;
    const fileName = generate(alphabet, 32);
    const fileNameWithExt = fileName + fileExtension;
    const filePath = `${path.join(
      __dirname,
      '../../../public'
    )}/u/${fileName}${fileExtension}`;
    // Delete key is fileName the delete URL via the get request
    const deleteKey = generate(alphabet, 32);

    const size = filesize(file.size);

    // Image check to label as image.
    const isImage = mineTypes.images.includes(fileMineType);
    const isText = mineTypes.text.includes(fileMineType);

    // Sets type based on above.
    const type = isImage ? 'image' : isText ? 'text' : 'file';

    /**
     * Adds the file to the database with basic infomation plus a
     * deleteKey which allows users to remove the file with one click
     */
    const upload = await new Upload({
      uploader: req.user.id,
      fileName,
      fileExtension,
      deleteKey,
      size,
      type
    });

    // Log the upload in lastUpload.
    const user = await User.findById(req.user.id);
    user.lastUpload = moment();
    await user.save();
    await upload.save();

    // Move th file to a public directory in u folder for express
    await file.mv(filePath);

    res.json({
      auth: true,
      success: true,
      file: {
        name: fileName,
        ext: fileExtension,
        size,
        url: `${process.env.FULL_DOMAIN}/u/${fileNameWithExt}`,
        delete: `${process.env.FULL_DOMAIN}/api/v1/delete?key=${deleteKey}`,
        deleteKey
      },
      status: 200
    });
  } catch (err) {
    console.error(err);
    res.status(500).json();
  }
};
