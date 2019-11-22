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

/**
 * @route /testing
 * @method GET
 * @description TESTING ROUTE This is only enabled
 * @access Private
*/
if (process.env.NODE_ENV !== 'production') {
  router.get('/test', (req, res) => {
  });
}
module.exports = router;
