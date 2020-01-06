const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate');
const fs = require('fs-extra');
const path = require('path');
const filesize = require('filesize');

/**
 * Load MongoDB models.
 */
const Upload = require('../../models/Upload');

/**
 * Upload file Controler - Allows users upload a file or image using there API Key
 * This returns the URL where the file is hosted and a delete link.
 */
module.exports.uploadFile = async (req, res, next) => {
  const { file } = req.files;
  const fileExtension = path.extname(file.name);
  const fileMineType = file.mimetype;
  const fileName = generate(alphabet, 24);
  const fileNameWithExt = fileName + fileExtension;
  const uploadPath = `${path.join(__dirname, '../../public')}/u/i/${fileName}`;
  // Delete key is fileName the delete URL via the get request
  const deleteKey = generate(alphabet, 32);

  const size = filesize(file.size);

  const upload = new Upload({
    uploader: req.user.id,
    fileName,
    fileExtension,
    deleteKey,
    size
  });

  res.json(upload);
};
