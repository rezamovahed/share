const mineTypes = require('../../config/mineTypes');

module.exports = async (req, res, next) => {
  if (process.env.FILE_CHECK) {
    const allowedMineTypes = mineTypes.files.concat(
      mineTypes.images.concat(mineTypes.text)
    );
    const isAllowedFile = allowedMineTypes.includes(req.files.file.mimetype);
    if (!isAllowedFile) {
      return res.status(400).json({
        auth: true,
        success: false,
        error: {
          message: 'Uploaded file is not allowed.'
        }
      });
    }
  }
  next();
};
