const Upload = require('../../../models/upload');

/**
 * @param req
 * Express Req.
 * @param res
 * Express res.
 * @param page
 * is the page number.
 * @param limit
 * Is the limit per page.
 * @param populate
 * Set to true to populate the data.
 * This is set to false by defult
 * @param what to populate in to the data.
 */

module.exports = async (req, res, page, limit, populate, populateType) => {
  const count = await Upload.countDocuments();
  if (populate) {
    const data = await Upload.find({})
      .skip(limit * page - limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate(populateType);
    return { data, count };
  }
  const data = await Upload.find({})
    .skip(limit * page - limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  return { data, count };
};
