/**
 * Load MongoDB models.
 */
const Link = require('../models/Link');

/**
 * Get link Controler- gets the link from the database
 */
exports.getLink = async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.link });
    if (!link) {
      return res.status(404).send('Not found.');
    }
    res.redirect(link.url);
    link.clicks += 1;
    await link.save();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};