const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate');
const fs = require('fs-extra');
const path = require('path');

module.exports.uploadFile = async (req, res, next) => {
  const { file } = req.files;
  const fileExtension = path.extname(file.name);
  const fileMineType = file.mimetype;
  const newFileName = generate(alphabet, 24) + fileExtension;
  const uploadPath = `${path.join(
    __dirname,
    '../../public'
  )}/u/i/${newFileName}`;
  // Delete key is for the delete URL via the get request
  const deleteKey = generate(alphabet, 24);
};
