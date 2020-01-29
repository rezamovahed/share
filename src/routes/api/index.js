/* eslint-disable object-curly-newline */
const express = require('express');

const router = express.Router();

/**
 * @api {get} /api//v1/ List Available API Versions that are still active.
 * @apiName Show Available API Versions
 * @apiGroup Versions
 * @apiVersion 4.0.0
 *
 * @apiSuccess {Object} Path Route Paths
 */
router.get('/', (req, res) => {
  res.json({
    endpoints: [
      { deprecated: false, removed: false, version: '1.0.0', path: '/api/v1' },
      { deprecated: true, removed: true, version: '0.0.0', path: '/api/v0' }
    ],
    status: 200
  });
});

/**
 * Add API Versions routes to this file
 * this will auto add the /api to each one
 * so you just need to do the versions
 */
const v1Route = require('./v1');

router.use('/v1', v1Route);

module.exports = router;
