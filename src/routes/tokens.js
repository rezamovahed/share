const express = require('express');

const router = express.Router();

/**
 * Load MongoDB models.
 */
const Token = require('.././models/Token');

/**
 * @route /tokens
 * @method GET
 * @description Displays a users tokens for uploading with a link to the docs
 * @access Private
 */
router.get('/', async (req, res) => {
  const tokens = await Token.find({ user: req.user.id }).populate('tokens');

  res.render('tokens/index', {
    pageTitle: 'My Tokens',
    pageDesc: process.env.DESC,
    pageName: 'tokens',
    tokens
  });
});
/**
 * @route /tokens/edit/:token_id
 * @method GET
 * @description Displays form to create new tokens
 * @access Private
 */
// router.get('/new', async (req, res) => {
//   const token = await Token.findById(req.params.token_id);
//   res.render('tokens/edit', {
//     pageTitle: 'Edit Token',
//     pageDesc: process.env.DESC,
//     pageName: 'editToken'
//   });
// });
/**
 * @route /tokens/new
 * @method GET
 * @description Displays form to create new tokens
 * @access Private
 */
router.get('/new', (req, res) => {
  res.render('tokens/new', {
    pageTitle: 'New Token',
    pageDesc: process.env.DESC,
    pageName: 'newToken'
  });
});

module.exports = router;
