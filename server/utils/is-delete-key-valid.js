const dayjs = require('dayjs');

const Upload = require('../models/Upload');

/**
 * @deleteKey String delete key for share
 * @type String valid types are 'upload' and 'link'
 */

module.exports = async (deleteKey, type) => {
  try {
    let isDeleteKeyValid;

    /**
     * Check if the delete key is valid depending on share type
     */
    if (type === 'upload') {
      isDeleteKeyValid = await Upload.findOne({
        deleteKey
      });
    }

    if (isDeleteKeyValid) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};
