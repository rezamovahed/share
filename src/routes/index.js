const express = require('express');
const router = express.Router();

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
  res.status(403).render('index')
});

module.exports = router;
