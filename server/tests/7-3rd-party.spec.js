const request = require('supertest');
const path = require('path');

const server = require('../index');

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
  }
};

/**
 * Uploaded File details
 */
let file = {};

const testFile = `${path.join(__dirname, './data')}/test.jpg`;

/**
 * API Key
 */
let apikey = '';

describe('3rd Party:', () => {
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

  it('should create API Key', done => {
    request(server)
      .post('/apikey')
      .set('Authorization', `Bearer ${creds.user.accessToken}`)
      .field('expires', 'day')
      .expect(201)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }
        apikey = res.body.api_key;
        done();
      });
  });

  it('should upload a file', done => {
    request(server)
      .post('/3rd-party/upload')
      .set('Authorization', `Bearer ${apikey}`)
      .field('stoage', 'local')
      .field('displayName', 'Test File')
      .attach('file', testFile)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }
        file = res.body.file;
        done();
      });
  });

  it('should delete a file', done => {
    request(server)
      .delete(`/3rd-party/upload/${file.name}`)
      .field('deleteToken', file.deleteToken)
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
