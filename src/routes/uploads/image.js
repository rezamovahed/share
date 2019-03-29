const express = require('express');
const middleware = require('../middleware');
const router = express.Router();
const Uploads = require('../../models/upload');

/**
 * @route /u/i/:fileName
 * @method GET
 * @description Shows a webpage with file
 * @access Private
*/

router.get('/:fileName', (req, res) => {

});

module.exports = router;
