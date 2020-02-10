const express = require('express');

const router = express.Router();

/**
 * Load Middleware
 */
const isDeleteKeyVaild = require('../../../middleware/api/isDeleteKeyVaild');

/**
 * Load Controllers
 */
const deleteController = require('../../../controllers/api/v1/delete');

/**
 * Load Validation
 */
const deleteValidation = require('../../../validation/api/v1/delete');

/**
 *
 * @api {post} /api/v1/delete Uploads a file.
 * @apiName Uploads a file.
 * @apiGroup Upload
 * @apiVersion 4.0.0
 *
 * @apiParam (query) {String} key Delete key for upload.
 *
 * @apiSuccess {Object} Path Route Paths
 */
router.get(
  '/',
  deleteValidation,
  isDeleteKeyVaild,
  deleteController.deleteFile
);

module.exports = router;
