const express = require('express');

const router = express.Router();

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate');
const fs = require('fs-extra');
const path = require('path');

/**
 * Load Middleware
 */
const isTokenVaild = require('../../../middleware/api/isTokenVaild');
const fileCheck = require('../../../middleware/api/fileCheck');

/**
 * Load Controllers
 */
const uploadController = require('../../../controllers/api/v1/upload');

/**
 * Load Validation
 */
const uploadValidation = require('../../../validation/api/v1/upload');

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
router.post(
  '/',
  isTokenVaild,
  uploadValidation,
  fileCheck,
  uploadController.uploadFile
);

module.exports = router;
