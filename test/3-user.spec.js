/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../src/index');

let userCookie = null;

describe('LOGGED IN (user)', () => {
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

  describe('GET /upload-data (This is used for the / route for manging the upload list) (asc)', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .get('/upload-data?order=asc&offset=0&limit=10')
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

  describe('GET /upload-data (This is used for the / route for manging the upload list) (desc)', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .get('/upload-data?order=desc&offset=0&limit=10')
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
        .get('/gallery')
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
        .get('/tokens')
        .set('Cookie', userCookie)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('GET /tokens-data (This is used for the / route for manging the upload list) (asc)', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .get('/tokens-data?order=asc&offset=0&limit=10')
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

  describe('GET /tokens-data (This is used for the / route for manging the upload list) (desc)', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .get('/tokens-data?order=desc&offset=0&limit=10')
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

  describe('POST /tokens (this will create a token which we will save and use later)', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .post('/tokens')
        .set('Cookie', userCookie)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          label: 'user@mrdemonwolf.github.io test token',
          expire: '1'
        })
        .expect(302)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          module.exports.token = {
            jwt: res.header['api-token'],
            id: res.header['api-token-id']
          };
          done();
        });
    });
  });

  describe('POST /tokens (this create a token that be removed.', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .post('/tokens')
        .set('Cookie', userCookie)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          label: 'To be removed',
          expire: '1'
        })
        .expect(302)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          module.exports.tokenRemovel = res.header['api-token-id'];

          done();
        });
    });
  });

  describe('DELETE /tokens', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .delete(`/tokens/${this.tokenRemovel}`)
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

  describe('PUT /token (renaming token)', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .put(`/tokens/${this.token.id}`)
        .set('Cookie', userCookie)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          label: 'user@mrdemonwolf.github.io'
        })
        .expect(302)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('GET /account', () => {
    it('it should has status code 200', done => {
      supertest(app)
        .get('/account')
        .set('Cookie', userCookie)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
});

describe('User actions', () => {
  describe('GET /user/forgot-password', () => {
    it('it should return status 302.', done => {
      supertest(app)
        .get('/user/forgot-password')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
  describe('POST /user/forgot-password', () => {
    it('it should return status 302.', done => {
      supertest(app)
        .post('/user/forgot-password')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'user@mrdemonwolf.github.io'
        })
        .expect(302)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
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
