const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = (req, res, next) => {
  // eslint-disable-next-line prefer-const
  let errors = {};
  const { supportedUploader, sharexType } = req.body;
  const sharexTypes = ['FileUploader', 'ImageUploader', 'TextUploader'];
  const supportedUploaders = ['sharex'];

  if (!supportedUploaders.includes(supportedUploader)) {
    req.flash('error', 'Not a vaild supported uploader.');
    return res.redirect('/config');
  }

  switch (supportedUploader) {
    case 'sharex':
      if (sharexType === undefined) {
        errors = 'Share Type is required.';
      }
      if (!sharexTypes.some(data => sharexType.includes(data))) {
        req.flash('error', 'Not a vaild ShareX Type');
        return res.redirect('/config');
      }
      break;
    default:
      req.flash('error', 'Not a vaild supported uploader.');
      res.redirect('/config');
      break;
  }

  if (!isEmpty(errors)) {
    req.flash('error', errors);
    return res.redirect('/cpmfog');
  }
  next();
};
