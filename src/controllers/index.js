/* eslint-disable indent */
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
    const uploadsData = await Upload.find({ uploader: req.user.id })
      .sort({ uploadedAt: sort })
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
        uploadedAt: data.uploadedAt
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

    const isOwner = await Upload.findOne({
      fileName: uploadedFileName,
      uploader: req.user.id
    });

    if (!isOwner) {
      return res.status(404).json({
        message: `You don't own this upload.`,
        status: 401
      });
    }

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
    await fs.remove(uploadedFilePath);
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

/**
 * Delete all uploads - Remove all files  rom database and filesystem uplaoded by the user.
 */
exports.deleteAllUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({
      uploader: req.user.id
    });

    if (uploads.length === 0) {
      req.flash('error', 'You have not uploaded any files.');
      return res.redirect('/');
    }

    uploads.map(async data => {
      try {
        const uploadedFileExt = data.fileExtension;
        const uploadedFileName = data.fileName;

        const uploadedFilePath = `${path.join(
          __dirname,
          '../public'
        )}/u/${uploadedFileName + uploadedFileExt}`;

        await Upload.findOneAndDelete({
          fileName: uploadedFileName
        });
        await fs.remove(uploadedFilePath);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    });
    req.flash('success', 'All your uploads have been removed.');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
