const isDeleteKeyValid = require('../../../utils/is-delete-key-valid');

module.exports = async (req, res, next) => {
  try {
    const deleteKeyValid = await isDeleteKeyValid(req.body.deleteKey, 'upload');
    /**
     * If it's valid then move on.
     */
    if (deleteKeyValid) {
      return next();
    }
    res.status(401).send('Unauthorized');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      code: 'SERVER_ERROR',
      error: 'Internal Server Error.'
    });
  }
};
