const Upload = require('../../models/Upload');

module.exports = async (req, res, next) => {
  const isVaildUploadKey = await Upload.findOne({ deleteKey: req.query.key });
  const isVaildlinkKey = await Upload.findOne({ deleteKey: req.query.key });

  if (!isVaildUploadKey || !isVaildlinkKey) {
    return res.status(401).json({
      auth: false,
      success: false,
      errors: 'Delete Key is invaild.',
      status: 401
    });
  }
  next();
};
