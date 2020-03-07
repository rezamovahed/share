/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../src/index');

let userCookie = null;
let adminCookie = null;

describe('Punishment', () => {
  describe('LOGIN as user', () => {
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
  describe('LOGIN as admin', () => {
    it('it should has status code 200', done => {
      supertest
        .agent(app)
        .post('/login/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'admin@mrdemonwolf.github.io',
          password: 'admin@mrdemonwolf.github.io'
        })
        .expect(302)
        .expect('Location', '/')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          adminCookie = res.header['set-cookie'];
          done();
        });
    });
  });
  describe('GET / (With user that is banned)', () => {
    it('it should has status code 401', done => {
      supertest(app)
        .get('/')
        .set('Cookie', userCookie)
        .expect(401)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
