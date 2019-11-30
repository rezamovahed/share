const express = require('express');

const router = express.Router();

/**
 * @api {get} /v1 Shows routes on the api endpoint.
 *
 * @apiDescription Shows routes on the api endpoint.
 * @apiVersion 1.0.0
 * @apiName Endpoints
 *
 * @apiSuccess {json} object Available routes
 *
 * @apiError (Unauthorized 401) Unauthorized Only authenticated Users can access the data
 */
router.get('/', (req, res) => {
  res.json({ routes: ['/'], status: 200 });
});

module.exports = router;
