/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../src/index');

let userCookie = null;

describe('LOGIN as user for user tests.', () => {
  it('it should has status code 200', done => {
    supertest
      .agent(app)
      .post('/login/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: 'user@mrdemonwolf.github.io',
        password: 'user@mrdemonwolf.github.io'
      })
      .expect(302)
      .expect('Location', '/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        userCookie = res.header['set-cookie'];
        done();
      });
  });
});

describe('GET /', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/')
      .set('Cookie', userCookie)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});

describe('GET /gallery', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/gallery/')
      .set('Cookie', userCookie)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
describe('GET /tokens', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/tokens/')
      .set('Cookie', userCookie)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /account', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/account/')
      .set('Cookie', userCookie)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
