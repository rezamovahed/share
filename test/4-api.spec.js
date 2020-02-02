/* eslint-disable no-undef */
const supertest = require('supertest');
// const assert = require('assert');

const app = require('../src/index');

describe('API Routes', () => {
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
  describe('API Version 1', () => {
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
  });
});
