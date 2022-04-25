const mineTypes = require('./minetype.json');

module.exports = async (req, res, next) => {
  try {
    const fileCheck = process.env.FILE_CHECK === 'true';

    if (fileCheck) {
      const allowedMineTypes = mineTypes.files.concat(
        mineTypes.images.concat(mineTypes.text)
      );
      const isAllowedFile = allowedMineTypes.includes(req.files.file.mimetype);
      if (!isAllowedFile) {
        return res.status(400).json({
          error: {
            file: 'This type of file is not allowed.'
          }
        });
      }
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};
