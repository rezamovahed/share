const express = require('express');
const router = express.Router();
const middleware = require('../middleware')

/**
 * @route /
 * @method GET
 * @description Displays a not allowed message
 * @access Public
*/
router.get('/', (req, res) => {
  // res.render('index', {
  //   title: 'Home'
  // });
  res.status(403).send('YOUR NOT ALLOWED TO BE HERE')
});

module.exports = router;
