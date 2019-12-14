const express = require('express');

const router = express.Router();
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate');
const fs = require('fs-extra');
const path = require('path');
const jwt = require('jsonwebtoken');

/**
 * @api {get} /api//v1/ List Available routes on the api endpoint.
 * @apiName Shows routes
 * @apiGroup Endpoints
 * @apiVersion 4.0.0
 *
 * @apiSuccess {Object} Path Route Paths
 */
router.get('/', (req, res) => {
  res.json({ routes: ['/'], status: 200 });
});

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
 * @api {post} /api/v1/upload Uploads a file.
 * @apiName Uploads a file.
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
