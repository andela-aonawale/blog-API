'use strict';

import should from 'should';
import mock from './../helpers/mock';
import models from './../../server/models';
import server from './../helpers/app';

let author;

describe('Author Route Tests: ', () => {

  beforeEach(done => {
    author = mock.author();
    done();
  });

  afterEach(done => {
    models.author.truncate({cascade: true})
    .then(() => done());
  });

  describe('GET /authors', () => {
    it('fetch all authors', done => {
      server
      .get('/authors')
      .expect('Content-Type', /json/)
      .expect(200, done)
      .expect(res => {
        should.exist(res.body);
        res.body.should.be.instanceof(Array);
      }, done);
    });

    it('fetch an author with the specified id param', done => {
      models.author.create(author).then(author => {
        server
        .get('/authors/' + author.id)
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(res => {
          should.exist(res.body);
          res.body.should.be.instanceof(Object);
        }, done);
      });
    });
  });

  describe('POST /authors', () => {
    it('creates a new author', done => {
      server
      .post('/authors')
      .set('Content-Type', 'application/json')
      .send(author)
      .expect('Content-Type', /json/)
      .expect(201, done)
      .expect(res => {
        should.exist(res.body);
        res.body.should.be.instanceof(Object);
      }, done);
    });
  });

  describe('PATCH /authors', () => {
    it('updates an author', done => {
      models.author.create(author).then(author => {
        server
        .patch('/authors/' + author.id)
        .set('Content-Type', 'application/json')
        .send({firstName: 'Dab'})
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(res => {
          should.exist(res.body);
          res.body.should.have.property('firstName', 'Dab');
        }, done);
      });
    });
  });

  describe('DELETE /authors', () => {
    it('deletes an author', done => {
      models.author.create(author).then(author => {
        server
          .delete('/authors/' + author.id)
          .expect(200, done());
      });
    });
  });

});