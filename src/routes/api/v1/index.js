const express = require('express');

const router = express.Router();

/**
 * Routes
 */
const uploadRoutes = require('./upload');
const deleteRoutes = require('./delete');

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
      { method: 'POST', path: '/api/v1/upload' },
      { method: 'GET', path: '/api/v1/delete' }
    ],
    status: 200
  });
});

router.use('/upload', uploadRoutes);
router.use('/delete', deleteRoutes);

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
