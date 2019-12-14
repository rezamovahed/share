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
        if (err) done(err);
        done();
      });
  });
});
