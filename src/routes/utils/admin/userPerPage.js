/**
 * @param req
 * Express Req.
 * @param res
 * Express res.
 * @param page
 * is the page number.
 * @param model
 * What model to use for counting and returning the data per page.
 * @param limit
 * Is the limit per page.
 */
module.exports = async (req, res, page, model, limit) => {
  const data = await model
    .find({})
    .skip(limit * page - limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  const count = await model.countDocuments();
  return { data, count };
};
