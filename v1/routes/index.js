const express = require('express');

const router = express.Router();
const passport = require('passport');
const middleware = require('../middleware');
/**
 * @route /
 * @method GET
 * @description Displays a not allowed message
 * @access Public
*/
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Welcome'
  });
});

module.exports = router;
