/**
 * Load MongoDB models.
 */
const Link = require('../models/Link');

module.exports = async (req, res, next) => {
  const link = await Link.findOne({ code: req.params.link });
  const clicks = link.clicks + 1;

  console.log(link);
  console.log(clicks);
  if (link.limit < clicks) {
    res.status(404).send('Not found.');
  }
  next();
};
