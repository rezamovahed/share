const fs = require('fs');
const path = require('path');

module.exports.file = (fileName, cb) => {
  let base = `${path.join(__dirname, '../../public')}/u/${fileName}`
  fs.unlink(base, err => {
    if (err) {
      cb(false);
    } else {
      cb(true);
    }
  });
}
module.exports.database = (fileName, cb) => {
  Upload.findOneAndDelete({ fileName }, err => {
    if (err) {
      cb(false);
    } else {
      cb(true);
    }
  });
}
