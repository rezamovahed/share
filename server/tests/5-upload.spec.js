const request = require('supertest');
const path = require('path');

const server = require('../index');

/**
 * Load Configs
 */
const testAccounts = require('./data/testAccounts.json');
const { get } = require('../config/smtp');

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

describe('📁  Upload:', () => {
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

  it('should get all current uploads', done => {
    request(server)
      .get('/upload')
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
  it('should upload a file', done => {
    request(server)
      .post('/upload')
      .set('Authorization', `Bearer ${creds.user.accessToken}`)
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
  it('should get a single upload details', done => {
    request(server)
      .get(`/upload/${file.name}`)
      .set('Authorization', `Bearer ${creds.user.accessToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async err => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
  it('should update a single upload details', done => {
    request(server)
      .put(`/upload/${file.name}`)
      .set('Authorization', `Bearer ${creds.user.accessToken}`)
      .field('displayName', 'Test File')
      .field('tags', '["test", "update"]')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async err => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
  it('should get raw bytes of single upload', done => {
    request(server)
      .get(`/upload/${file.name}/raw`)
      .set('Authorization', `Bearer ${creds.user.accessToken}`)
      .expect(200)
      .expect('Content-Type', /image\/jpeg/)
      .end(async err => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should delete a single upload', done => {
    request(server)
      .delete(`/upload/${file.name}`)
      .set('Authorization', `Bearer ${creds.user.accessToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async err => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
