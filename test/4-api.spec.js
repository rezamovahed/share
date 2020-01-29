/* eslint-disable no-undef */
const supertest = require('supertest');
// const assert = require('assert');

const app = require('../src/index');

describe('GET /api', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/api')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /api/v1', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/api/v1')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
