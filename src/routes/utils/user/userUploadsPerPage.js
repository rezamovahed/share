const Upload = require('../../models/upload');

/**
 * @param req
 * Express Req.
 * @param res
 * Express res.
 * @param page
 * is the page number.
 * @param user
 * What user to look up.
 * @param limit
 * Is the limit per page.
 * @param render
 * Is the render.
 * @param title
 * Page title for render.
 * @param populate
 * Set to true to populate the data.
 * This is set to false by defult
 * @param what to populate in to the data.
 */
module.exports = async (req, res, page, user, limit) => {
  const data = (await Upload.find({ 'uploader': user }).skip((limit * page) - limit).limit(limit).sort({ createdAt: -1 }));
  const count = (await Upload.find({ 'uploader': user }).countDocuments());
  return { data, count }
};
