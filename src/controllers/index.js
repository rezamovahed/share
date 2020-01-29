/* eslint-disable indent */
const moment = require('moment');
/**
 * Load MongoDB models.
 */
const Upload = require('.././models/Upload');

/**
 * Upoloads lising mini API Controller- Takes data from lib and returns results.
 */
exports.UploadsListMiniAPI = async (req, res) => {
  // order: asc;
  // offset: 10;
  // limit: 10;

  const sort = req.query.order === 'asc' ? 1 : -1;
  const limit = parseFloat(req.query.limit);
  const offset = parseFloat(req.query.offset);

  const uploadsData = await Upload.find({ uploader: req.user.id })
    .sort({ createdAt: sort })
    .limit(limit)
    .skip(offset)
    .select('uploaded uploadedAt fileName size type fileExtension');

  // eslint-disable-next-line prefer-const
  let uploads = [];
  let id = 0;
  uploadsData.map(data => {
    uploads.push({
      id: (id += 1),
      file: data.fileName,
      extension: data.fileExtension,
      type: data.type,
      size: data.size,
      uploadedAt: moment(data.uploadedAt).fromNow()
    });
  });

  const total = await Upload.countDocuments({
    uploader: req.user.id
  });

  res.json({
    total,
    rows: uploads
  });
};
