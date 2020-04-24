const rateLimit = require('express-rate-limit');

/**
 * Upoloads lising mini API Controller- Takes data from lib and returns results.
 */
exports.spaceUsed = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    message: 'Too many reqeusts.',
    status: 429
  }
});
