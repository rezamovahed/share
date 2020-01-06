const express = require('express');

const router = express.Router();

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate');
const fs = require('fs-extra');
const path = require('path');
const fileUpload = require('express-fileupload');

router.use(
  fileUpload({
    safeFileNames: true,
    preserveExtension: true,
    useTempFiles: true,
    tempFileDir: '../../../tmp/',
    limits: {
      fileSize: process.env.UPLOAD_LIMIT || 100000000
    },
    abortOnLimit: true
  })
);

/**
 * Load Middleware
 */
const isTokenVaild = require('../../../middleware/api/isTokenVaild');

/**
 * Load Controllers
 */
const uploadController = require('../../../controllers/api/upload');

/**
 * Load Validation
 */
const uploadValidation = require('../../../validation/api/upload');

/**
 *
 * @api {post} /api/v1/upload Uploads a file.
 * @apiName Uploads a file.
 * @apiGroup Upload
 * @apiVersion 4.0.0
 *
 * @apiParam (query) {String} key Delete key for upload.
 *
 * @apiSuccess {Object} Path Route Paths
 */
router.post('/', isTokenVaild, uploadValidation, uploadController.uploadFile);

module.exports = router;
