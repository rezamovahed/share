/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../src/index');

let adminCookie = null;

before(done => {
  supertest
    .agent(app)
    .post('/login/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      email: 'admin@mrdemonwolf.github.io',
      password: 'admin@mrdemonwolf.github.io'
    })
    .end((err, res) => {
      adminCookie = res.header['set-cookie'];
      done();
    });
});

describe('GET /admin', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/admin/')
      .set('Cookie', adminCookie)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
