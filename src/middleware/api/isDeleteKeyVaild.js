const Upload = require('../../models/Upload');

module.exports = async (req, res, next) => {
  const isVaildKey = await Upload.findOne({ deleteKey: req.query.key });

  if (!isVaildKey) {
    return res.status(401).json({
      auth: false,
      success: false,
      errors: 'Delete Key is invaild.',
      status: 401
    });
  }
  next();
};
