const express = require('express');

const router = express.Router();

/**
 * Routes
 */
const uploadRoutes = require('./upload');

/**
 * @api {get} /api//v1/ List Available routes on the api endpoint.
 * @apiName Shows routes
 * @apiGroup Endpoints
 * @apiVersion 4.0.0
 *
 * @apiSuccess {Object} Path Route Paths
 */
router.get('/', (req, res) => {
  res.json({
    endpoints: [
      { method: 'GET', path: '/' },
      { method: 'POST', path: '/api/v1/upload' }
    ],
    status: 200
  });
});

router.use('/upload', uploadRoutes);
/**
 *
 * @api {get} /api/v1/upload/delete Remove a uploaded file.
 * @apiName Remove a uploaded file.
 * @apiGroup Upload
 * @apiVersion 4.0.0
 *
 * @apiParam (query) {String} key Delete key for upload.
 *
 * @apiSuccess {Object} Path Route Paths
 */

/**
 *
 * @api {get} /api/v1/upload/view Lists all uploaded files.
 * @apiName Lists all uploaded files.
 * @apiGroup Upload
 * @apiVersion 4.0.0
 *
 * @apiSuccess {Object} Path Route Paths
 */

/**
 *
 * @api {get} /api/v1/upload/limits VIew your upload limits.
 * @apiName VIew your upload limits.
 * @apiGroup Upload
 * @apiVersion 4.0.0
 *
 * @apiSuccess {Object} Path Route Paths
 */
module.exports = router;
