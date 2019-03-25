const express = require('express');
const middleware = require('../middleware')
const router = express.Router();

router.get('/', (req, res) => {
  res.send('ADMIN')
});
module.exports = router;
