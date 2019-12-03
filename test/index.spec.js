/* eslint-disable no-undef */
const supertest = require('supertest');
// const assert = require('assert');

const app = require('../src/index');

describe('GET /', () => {
  it('it should has status code 200', done => {
    supertest(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        // eslint-disable-next-line prefer-destructuring
        const cookie = res.headers['set-cookie'][0]
          .split(',')
          .map(item => item.split(';')[0])
          .join(';');
        done();
      });
  });
});
