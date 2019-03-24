const express = require('express');
const middleware = require('../middleware')
const router = express.Router();

/**
 * @route /me
 * @method GET
 * @description Displays account.
 * @access Public
*/
router.get('/', (req, res) => {
  res.send("Hello")
});
module.exports = router;
