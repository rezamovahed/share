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

/**
 * @route /testing
 * @method GET
 * @description TESTING ROUTE This is only enabled
 * @access Private
*/
if (process.env.NODE_ENV !== 'production') {
  router.get('/test', (req, res) => {
    const emailTemplates = require('../config/emailTemplates')
    let html = emailTemplates.activateAccount(req.headers.host, 'testestjnetjjhkte')
    res.send(html.html);
  });
};
module.exports = router;
