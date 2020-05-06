const express = require('express');

const router = express.Router();

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

router.post(
  '/',
  isTokenVaild,
  uploadValidation,
  fileCheck,
  uploadController.uploadFile
);

module.exports = router;
