'use strict';

import { article, author } from './../../server/models';
import mock from './../helpers/mock';
import httpMocks from 'node-mocks-http';
import * as articleController from './../../server/controllers/article';

describe('Article Controller Test', () => {

  let res, testAuthor, testArticle;

  before(done => {
    author.create(mock.author())
    .then(createdAuthor => {
      testAuthor = createdAuthor;
      done();
    });
  });

  after(done => {
    author.truncate({cascade: true})
    .then(() => done());
  });

  beforeEach(done => {
    res = httpMocks.createResponse(httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    }));
    let articles = mock.bulkArticlesForAuthor(testAuthor, 5);
    article.bulkCreate(articles)
    .then(createdArticles => {
      testArticle = createdArticles[0];
      done();
    });
  });

  afterEach(done => {
    article.truncate({cascade: true})
    .then(() => done());
  });

  describe('index', () => {
    it('returns all articles', done => {
      let req = httpMocks.createRequest();
      articleController.index(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.have.length(5);
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('creates an article', done => {
      let article = mock.article();
      article.authorId = testAuthor.id;
      let req = httpMocks.createRequest({
        body: article
      });
      articleController.create(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.be.ok;
        res.statusCode.should.equal(201);
        done();
      });
    });

    it('returns all articles belonging to an author with the correct id', done => {
      let req = httpMocks.createRequest({
        query: {
          authorId: testAuthor.id
        }
      });
      articleController.index(req, res);
      res.on('end', () => {
        var data = JSON.parse(res._getData());
        data.should.be.instanceof(Array);
        res.statusCode.should.equal(200);
        done();
      });
    });
  });

  describe('read', () => {
    it('returns an article with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: testArticle.id
        }
      });
      articleController.read(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.be.ok;
        data.title.should.equal(testArticle.title);
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
      articleController.read(req, res);
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
      articleController.read(req, res);
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
          id: testArticle.id
        },
        body: updatedArticle
      });
      articleController.update(req, res);
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
      articleController.update(req, res);
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
          id: testArticle.id
        }
      });
      articleController.destroy(req, res);
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
      articleController.destroy(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

});