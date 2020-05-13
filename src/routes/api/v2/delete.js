const express = require('express');

const router = express.Router();

/**
 * Load Middleware
 */
const isDeleteKeyVaild = require('../../../middleware/api/isDeleteKeyVaild');

/**
 * Load Controllers
 */
const deleteController = require('../../../controllers/api/v2/delete');

/**
 * Load Validation
 */
const deleteValidation = require('../../../validation/api/v2/delete');

router.get(
  '/',
  deleteValidation,
  isDeleteKeyVaild,
  deleteController.delete
);

module.exports = router;
