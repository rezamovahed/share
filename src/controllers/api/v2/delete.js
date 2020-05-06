/* eslint-disable no-case-declarations */
const fs = require('fs-extra');
const path = require('path');

/**
 * Load MongoDB models.
 */
const Upload = require('../../../models/Upload');
const Link = require('../../../models/Link');

/**
 * Delete  Controler - Allows users upload a file or image or link using there API Key
 * This returns the URL where the file is hosted and a delete link.
 */
module.exports.delete = async (req, res, next) => {
  try {
    switch (req.query.type) {
      case 'upload':
        const upload = await Upload.findOne({ deleteKey: req.query.key });

        const filePath = `${path.join(__dirname, '../../../public')}/u/${
          upload.fileName
        }${upload.fileExtension}`;
        await fs.remove(filePath);
        await upload.remove();
        res.json({
          success: true,
          message: `Deleted file ${upload.fileName}`
        });
        break;
      case 'link':
        const link = await Link.findOneAndRemove({ deleteKey: req.query.key });
        res.json({
          success: true,
          message: `Deleted link ${link.code}`
        });
        break;
      default:
        res.status(404).json({
          success: false,
          message: 'Not found',
          status: 404
        });
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json();
  }
};
