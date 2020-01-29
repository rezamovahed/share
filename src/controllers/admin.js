const path = require('path');
const fs = require('fs-extra');

/**
 * Load MongoDB models.
 */
const Upload = require('.././models/Upload');

/**
 * Upoloads lising mini API Controller- Takes data from lib and returns results.
 */
exports.getUploadListData = async (req, res) => {
  try {
    const sort = req.query.order === 'asc' ? 1 : -1;
    const limit = parseFloat(req.query.limit);
    const offset = parseFloat(req.query.offset);

    const uploadsData = await Upload.find({})
      .sort({ uploadedAt: sort })
      .limit(limit)
      .skip(offset)
      .select('uploaded uploadedAt fileName size type fileExtension uploader')
      .populate({ path: 'uploader', select: 'username isVerified role' });

    console.log(uploadsData);
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
        uploadedAt: data.uploadedAt,
        uploader: data.uploader.username,
        role: data.uploader.role,
        isVerified: data.uploader.isVerified
      });
    });

    const total = await Upload.countDocuments({
      uploader: req.user.id
    });

    res.json({
      total,
      rows: uploads
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Delete upload mini API - Removes a file from database and filesystem.
 */
exports.deleteSingleUpload = async (req, res) => {
  try {
    const { uploadedFile } = req.params;

    const uploadedFileExt = path.extname(uploadedFile);
    const uploadedFileName = uploadedFile.replace(uploadedFileExt, '');

    const uploadedFilePath = `${path.join(
      __dirname,
      '../public'
    )}/u/${uploadedFile}`;

    const upload = await Upload.findOneAndDelete({
      fileName: uploadedFileName
    });

    if (!upload) {
      if (req.user.streamerMode) {
        return res.status(404).json({
          message: `<strong>${uploadedFileName.substring(
            0,
            3
          )}*********************</strong> was not found.`,
          status: 404
        });
      }
      return res.status(404).json({
        message: `<strong>${uploadedFileName}</strong> was not found.`,
        status: 404
      });
    }
    fs.remove(uploadedFilePath);
    if (req.user.streamerMode) {
      return res.json({
        message: `<strong>${uploadedFileName.substring(
          0,
          3
        )}*********************</strong> has been deleted.`,
        status: 200
      });
    }
    res.json({
      message: `<strong>${uploadedFileName}</strong> has been deleted.`,
      status: 200
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
