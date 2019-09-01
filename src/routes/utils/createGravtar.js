/**
 *  param email
 * Email of the user.
 */
module.exports = (email) => {
  return gravatar.url(email, {
    s: '100',
    r: 'x',
    d: 'retro'
  }, true);
};
