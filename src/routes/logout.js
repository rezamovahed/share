const express = require('express');
const router = express.Router();

/**
 * @route /logout
 * @method GET
 * @description Signs out the user
 * @access Public
*/
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
