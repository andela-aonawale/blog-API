'use strict';

const
  models             = require('./../../server/models/'),
  mock               = require('./../helpers/mock'),
  httpMocks          = require('node-mocks-http'),
  controller = require('./../../server/controllers/author');

describe('Author Controller Test', () => {

  let res, author;

  beforeEach(done => {
    res = httpMocks.createResponse(httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    }));
    const authors = mock.bulkAuthors(5);
    models.author.bulkCreate(authors)
    .then(createdAuthors => {
      author = createdAuthors[0];
      done();
    });
  });

  afterEach(done => {
    models.author.truncate({cascade: true})
    .then(() => done());
  });

  describe('index', () => {
    it('returns all authors', done => {
      let req = httpMocks.createRequest();
      controller.index(req, res);
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
      controller.create(req, res);
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
          id: author.id
        }
      });
      controller.read(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.be.ok;
        data.name.should.equal(author.name);
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
      controller.read(req, res);
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
      controller.read(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('returns all articles belonging to an author with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: author.id
        }
      });
      controller.readArticles(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.be.instanceof(Array);
        res.statusCode.should.equal(200);
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
          id: author.id
        },
        body: updatedAuthor
      });
      controller.update(req, res);
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
      controller.update(req, res);
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
          id: author.id
        }
      });
      controller.destroy(req, res);
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
      controller.destroy(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('deletes all articles belonging to an author with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: author.id
        }
      });
      controller.destroyArticles(req, res);
      res.on('end', () => {
        res.statusCode.should.equal(200);
        done();
      });
    });
  });

});