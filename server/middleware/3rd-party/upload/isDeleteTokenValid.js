const isdeleteTokenValid = require('../../../utils/is-delete-key-valid');

module.exports = async (req, res, next) => {
  try {
    const deleteTokenValid = await isdeleteTokenValid(
      req.body.deleteToken,
      'upload'
    );
    /**
     * If it's valid then move on.
     */
    if (deleteTokenValid) {
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
