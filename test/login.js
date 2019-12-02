const superagent = require('superagent');

const agent = superagent.agent();
const theAccount = {
  username: 'nacho',
  password: 'iamtheluchadore'
};

exports.login = (request, done) => {
  request
    .post('/login')
    .send(theAccount)
    .end((err, res) => {
      if (err) {
        throw err;
      }
      agent.saveCookies(res);
      done(agent);
    });
};
