'use strict';

const
  models             = require('./../../dist/models/'),
  mock               = require('./../helpers/mock'),
  httpMocks          = require('node-mocks-http'),
  controller = require('./../../server/controllers/article');

describe('Article Controller Test', () => {

  let res, author, article;

  before(done => {
    models.author.create(mock.author())
    .then(createdAuthor => {
      author = createdAuthor;
      done();
    });
  });

  after(done => {
    models.author.truncate({cascade: true})
    .then(() => done());
  });

  beforeEach(done => {
    res = httpMocks.createResponse(httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    }));
    let articles = mock.bulkArticlesForAuthor(author, 5);
    models.article.bulkCreate(articles)
    .then(createdArticles => {
      article = createdArticles[0];
      done();
    });
  });

  afterEach(done => {
    models.article.truncate({cascade: true})
    .then(() => done());
  });

  describe('index', () => {
    it('returns all articles', done => {
      let req = httpMocks.createRequest();
      controller.index(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.have.length(5);
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('creates an article', done => {
      let article = mock.article();
      article.authorId = author.id;
      let req = httpMocks.createRequest({
        body: article
      });
      controller.create(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.be.ok;
        res.statusCode.should.equal(201);
        done();
      });
    });
  });

  describe('read', () => {
    it('returns an article with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: article.id
        }
      });
      controller.read(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.be.ok;
        data.title.should.equal(article.title);
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('returns 404 for article with an incorrect id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: 'a5b335bc-0508-47e7-81ed-8959c1450fa0'
        }
      });
      controller.read(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('returns 404 for article with an id that is not UUIDv4', done => {
      let req = httpMocks.createRequest({
        params: {
          id: '01'
        }
      });
      controller.read(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

  describe('update', () => {
    const updatedArticle = {
      title: 'Updated Article'
    };
    it('updates and returns an article with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: article.id
        },
        body: updatedArticle
      });
      controller.update(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.be.ok;
        data.title.should.be.equal('Updated Article');
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('returns 404 when updating article with an id that is not UUIDv4', done => {
      let req = httpMocks.createRequest({
        params: {
          id: '01'
        }
      });
      controller.update(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

  describe('delete', () => {
    it('deletes an article with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: article.id
        }
      });
      controller.destroy(req, res);
      res.on('end', () => {
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('returns 404 when deleting article with an id that is not UUIDv4', done => {
      let req = httpMocks.createRequest({
        params: {
          id: '01'
        }
      });
      controller.destroy(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

});