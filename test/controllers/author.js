'use strict';

import { author } from './../../server/models';
import mock from './../helpers/mock';
import httpMocks from 'node-mocks-http';
import * as authorController from './../../server/controllers/author';

describe('Author Controller Test', () => {

  let res, testAauthor;

  beforeEach(done => {
    res = httpMocks.createResponse(httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    }));
    const authors = mock.bulkAuthors(5);
    author.bulkCreate(authors)
    .then(createdAuthors => {
      testAauthor = createdAuthors[0];
      done();
    });
  });

  afterEach(done => {
    author.truncate({cascade: true})
    .then(() => done());
  });

  describe('index', () => {
    it('returns all authors', done => {
      let req = httpMocks.createRequest();
      authorController.index(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.have.length(5);
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('creates an author', done => {
      let req = httpMocks.createRequest({
        body: mock.author()
      });
      authorController.create(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.be.ok;
        res.statusCode.should.equal(201);
        done();
      });
    });
  });

  describe('read', () => {
    it('returns an author with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: testAauthor.id
        }
      });
      authorController.read(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.be.ok;
        data.name.should.equal(testAauthor.name);
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('returns 404 for author with an incorrect id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: 'a5b335bc-0508-47e7-81ed-8959c1450fa0'
        }
      });
      authorController.read(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('returns 404 for author with an id that is not UUIDv4', done => {
      let req = httpMocks.createRequest({
        params: {
          id: '01'
        }
      });
      authorController.read(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

  describe('update', () => {
    const updatedAuthor = {
      name: 'Updated Author'
    };
    it('updates and returns an author with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: testAauthor.id
        },
        body: updatedAuthor
      });
      authorController.update(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.be.ok;
        data.firstName.should.be.equal('Updated');
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('returns 404 when updating author with an id that is not UUIDv4', done => {
      let req = httpMocks.createRequest({
        params: {
          id: '01'
        }
      });
      authorController.update(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

  describe('delete', () => {
    it('deletes an author with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: testAauthor.id
        }
      });
      authorController.destroy(req, res);
      res.on('end', () => {
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('returns 404 when deleting author with an id that is not UUIDv4', done => {
      let req = httpMocks.createRequest({
        params: {
          id: '01'
        }
      });
      authorController.destroy(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

});