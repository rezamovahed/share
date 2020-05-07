/**
 * Load vaildation middleware
 */
const isEmpty = require('../validation/isEmpty');

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

/**
 * Links lising mini API Controller- Takes data from lib and returns results.
 */
exports.getLinksListData = async (req, res) => {
  try {
    // Simple query params used by table to sort,limit, and offet.
    const sort = req.query.order === 'asc' ? 1 : -1;
    const limit = parseFloat(req.query.limit);
    const offset = parseFloat(req.query.offset);

    const search = req.query.search !== undefined && !isEmpty(req.query.search);

    const linksSelect = 'url code clicks limit tags createdAt updatedAt';
    let linksData = [];

    if (search) {
      linksData = await Link.find({
        creator: req.user.id,
        $text: { $search: req.query.search }
      })
        .sort({ uploadedAt: sort })
        .limit(limit)
        .skip(offset)
        .select(linksSelect);
    } else {
      linksData = await Link.find({ creator: req.user.id })
        .sort({ uploadedAt: sort })
        .limit(limit)
        .skip(offset)
        .select(linksSelect);
    }

    // eslint-disable-next-line prefer-const
    let links = [];
    let id = 0;
    linksData.map(data => {
      links.push({
        id: (id += 1),
        url: data.url,
        code: data.code,
        clicks: data.clicks,
        limit: data.limit,
        updatedAt: data.updatedAt,
        createdAt: data.createdAt,
        tags: data.tags
      });
    });

    const total = linksData.length;

    res.json({
      total,
      rows: links
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
