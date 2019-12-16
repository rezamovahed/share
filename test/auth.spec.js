/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../src/index');

describe('GET /login', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/login')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});

describe('GET /signup', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/signup')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});


describe('GET /user/forgot-password', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/user/forgot-password')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});

describe('GET /user/reset-password', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/user/reset-password')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});

// describe('POST /signup', () => {
//   it('it should has status code 200', done => {
//     supertest(app)
//       .post('/signup')
//       .send({
//         username: 'testing',
//         email: 'test@example.com',
//         password: 'test@example.com'
//       })
//       .set('Content-Type', 'application/x-www-form-urlencoded')
//       .expect(200)
//       .end((err, res) => {
//         done();
//       });
//   });
// });

// describe('POST /login', () => {
//   it('it should has status code 200', done => {
//     agent
//       .post('/login')
//       .send({ email: 'test@example.com', password: 'test@example.com' })
//       .set('Content-Type', 'application/x-www-form-urlencoded')
//       .expect(302)
//       .expect('Location', '/')
//       .expect('set-cookie', /sessionId/)
//       .end((err, res) => {
//         if (err) return done(err);
//         done();
//       });
//   });
// });
