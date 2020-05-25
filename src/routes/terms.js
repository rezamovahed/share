const express = require('express');

const router = express.Router();

/**
 * Load MongoDB models.
 */
const Term = require('../models/Term');

/**
 * @route /
 * @method GET
 * @description
 * @access Public/Private
 */
router.get('/', async (req, res) => {
  const terms = await Term.findOne({});
  res.render('terms/index', {
    pageTitle: 'Terms of service',
    pageDesc: process.env.DESC,
    pageName: 'terms',
    terms
  });
});

module.exports = router;
