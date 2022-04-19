const Upload = require('../models/Upload');

/**
 * @deleteToken String delete key for share
 * @type String valid types are 'upload' and 'link'
 */

module.exports = async (deleteToken, type) => {
  try {
    let isdeleteTokenValid;

    /**
     * Check if the delete key is valid depending on share type
     */
    if (type === 'upload') {
      isdeleteTokenValid = await Upload.findOne({
        deleteToken
      });
    }

    if (isdeleteTokenValid) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};
