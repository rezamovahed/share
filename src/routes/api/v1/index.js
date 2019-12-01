const express = require('express');

const router = express.Router();

/**
 * @api {get} /v1/ List Available routes on the api endpoint.
 * @apiName Shows routes
 * @apiGroup Endpoints
 * @apiVersion 4.0.0
 *
 * @apiSuccess {Object} Path Route Paths
 */
router.get('/', (req, res) => {
  res.json({ routes: ['/'], status: 200 });
});

module.exports = router;
