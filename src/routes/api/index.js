const express = require('express');

const router = express.Router();

/**
 * Add API Versions routes to this file
 * this will auto add the /api to each one 
 * so you just need to do the versions
 */
const v1Route = require('./v1');

router.use('/v1', v1Route);

module.exports = router;
