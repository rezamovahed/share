/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../src/index');
const User = require('../src/models/User');

describe('Auth Routes', () => {
  describe('GET /login', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .get('/login/')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('GET /signup', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .get('/signup/')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('GET /user/forgot-password', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .get('/user/forgot-password/')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  // describe('GET /user/reset-password', () => {
  //   it('it should has status code 200', done => {
  //     supertest(app)
  //       .get('/user/reset-password')
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         done();
  //       });
  //   });
  // });

  describe('POST /signup (user)', () => {
    it('it should has status code 302', done => {
      supertest(app)
        .post('/signup/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          username: 'user@mrdemonwolf.github.io',
          email: 'user@mrdemonwolf.github.io',
          password: 'user@mrdemonwolf.github.io'
        })
        .expect(302)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          const user = await User.findOne({
            email: 'user@mrdemonwolf.github.io'
          });
          user.emailVerified = true;
          user.emailVerificationToken = undefined;
          user.emailVerificationTokenExpire = undefined;
          await user.save();
          done();
        });
    });
  });

  describe('POST /signup (admin)', () => {
    it('it should has status code 302', done => {
      supertest(app)
        .post('/signup/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          username: 'admin@mrdemonwolf.github.io',
          email: 'admin@mrdemonwolf.github.io',
          password: 'admin@mrdemonwolf.github.io'
        })
        .expect(302)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          const user = await User.findOne({
            email: 'admin@mrdemonwolf.github.io'
          });
          user.emailVerified = true;
          user.emailVerificationToken = undefined;
          user.emailVerificationTokenExpire = undefined;
          user.role = 'admin';
          await user.save();
          done();
        });
    });
  });

  describe('POST /login (user)', () => {
    it('it should has status code 200', done => {
      supertest
        .agent(app)
        .post('/login/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'user@mrdemonwolf.github.io',
          password: 'user@mrdemonwolf.github.io'
        })
        .expect('Location', '/')
        .expect('set-cookie', /sessionId/)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
});
