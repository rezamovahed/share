const request = require('supertest');

const { authenticator } = require('otplib');
const server = require('../index');
const User = require('../models/User');

/**
 * Load Configs
 */
const testAccounts = require('./data/testAccounts.json');

/**
 * Create a empty object for creds to be used later
 */
const creds = {
  user: {
    accessToken: '',
    refreshToken: ''
  },
  extra: {
    account: {
      accessToken: '',
      refreshToken: ''
    }
  }
};

let sessions = [];

describe('🗄 Sessions:', () => {
  it('should login as user', done => {
    request(server)
      .post('/auth/login')
      .send({
        email: testAccounts.extra.account.ec,
        password: testAccounts.extra.account.password2
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }
        try {
          creds.user.accessToken = res.body.access_token;
          creds.user.refreshToken = res.body.refresh_token;
          done();
        } catch (err) {
          return done(err);
        }
      });
  });

  it('should return a array of all current sessions', done => {
    request(server)
      .get('/session')
      .set('Authorization', `Bearer ${creds.user.accessToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }
        sessions = res.body.sessions;
        done();
      });
  });

  it('should revoke current session', done => {
    request(server)
      // eslint-disable-next-line no-underscore-dangle
      .delete(`/session/${sessions[0]._id}`)
      .set('Authorization', `Bearer ${creds.user.accessToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should login as user to revoke all', done => {
    request(server)
      .post('/auth/login')
      .send({
        email: testAccounts.extra.account.ec,
        password: testAccounts.extra.account.password2
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }
        try {
          creds.user.accessToken = res.body.access_token;
          creds.user.refreshToken = res.body.refresh_token;
          done();
        } catch (err) {
          return done(err);
        }
      });
  });

  it('should login as user to revoke all 2', done => {
    request(server)
      .post('/auth/login')
      .send({
        email: testAccounts.extra.account.ec,
        password: testAccounts.extra.account.password2
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }
        try {
          creds.user.accessToken = res.body.access_token;
          creds.user.refreshToken = res.body.refresh_token;
          done();
        } catch (err) {
          return done(err);
        }
      });
  });

  it('should revoke all session', done => {
    request(server)
      .delete('/session')
      .set('Authorization', `Bearer ${creds.user.accessToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
