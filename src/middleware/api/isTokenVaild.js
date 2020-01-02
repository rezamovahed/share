const moment = require('moment');
const sha512 = require('js-sha512');
const Token = require('../../models/Token');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(400)
      .json({ error: 'API Token must be provided', status: 400 });
  }
  const token = authorization
    .split(' ')
    .slice(1)
    .toString();

  const tokenHash = sha512(token);
  console.log(tokenHash);
  const tokenUser = await Token.findOne({
    tokens: {
      hash: tokenHash,
      expireAt: {
        $gt: moment()
      }
    }
  }).populate('user');

  if (!tokenUser) {
    return res.status(401).json({
      error: 'API Token is either expired or is invaild.',
      status: 401
    });
  }

  res.locals.user = tokenUser;
  next();
};
