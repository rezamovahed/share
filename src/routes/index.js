const express = require('express');
const router = express.Router();
const middleware = require('../middleware');

/**
 * @route /
 * @method GET
 * @description Displays a not allowed message
 * @access Public
*/
router.get('/', middleware.isAlreadyLoggedIn, (req, res) => {
  res.render('index');
});

module.exports = router;
