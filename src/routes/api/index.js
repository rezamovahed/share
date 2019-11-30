const express = require('express');

const router = express.Router();

/**
 * @api {get} /v1/ Shows routes on the api endpoint.
 * @apiName Shows routes on the api endpoint.
 * @apiGroup Endpoints
 * @apiVersion 4.0.0
 *
 * @apiSuccess {Object} Available routes
 */
router.get('/', (req, res) => {
  res.json({ routes: ['/'], status: 200 });
});

module.exports = router;
