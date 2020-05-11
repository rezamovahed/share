const express = require('express');

const router = express.Router();

/**
 * Load Middleware
 */
const isDeleteKeyVaild = require('../../../middleware/api/isDeleteKeyVaild');
const isTokenVaild = require('../../../middleware/api/isTokenVaild');

/**
 * Load Controllers
 */
const linkController = require('../../../controllers/api/v2/link');

/**
 * Load Validation
 */
const linkValidation = require('../../../validation/api/v2/link');

// router.get(
//   '/',
// );

router.post(
  '/',
  isTokenVaild,
  linkValidation,
  linkController.createLink
);

module.exports = router;
