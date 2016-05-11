'use strict';

import models from './../../server/models';
import mock from './../helpers/mock';
import httpMocks from 'node-mocks-http';
import * as commentController from './../../server/controllers/comment';

describe('Comment Controller Test', () => {

  let res, comment, article;

  before(done => {
    models.author.create(mock.author())
    .then(createdAuthor => {
      let mockArticle = mock.article();
      mockArticle.authorId = createdAuthor.id;
      models.article.create(mockArticle)
      .then(createdArticle => {
        article = createdArticle;
        done();
      });
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
    let comments = mock.bulkCommentsForArticle(article, 5);
    models.comment.bulkCreate(comments)
    .then(createdComments => {
      comment = createdComments[0];
      done();
    });
  });

  afterEach(done => {
    models.comment.truncate({cascade: true})
    .then(() => done());
  });

  describe('index', () => {
    it('returns all comments belonging to an article', done => {
      let req = httpMocks.createRequest({
        query: {
          articleId: article.id
        }
      });
      commentController.index(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.have.length(5);
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('creates an comment', done => {
      let comment = mock.comment();
      comment.articleId = article.id;
      let req = httpMocks.createRequest({
        body: comment
      });
      commentController.create(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.be.ok;
        res.statusCode.should.equal(201);
        done();
      });
    });
  });

  describe('read', () => {
    it('returns a comment with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: comment.id
        }
      });
      commentController.read(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.be.ok;
        data.body.should.equal(comment.body);
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('returns 404 for comment with an incorrect id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: 'a5b335bc-0508-47e7-81ed-8959c1450fa0'
        }
      });
      commentController.read(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('returns 404 for comment with an id that is not UUIDv4', done => {
      let req = httpMocks.createRequest({
        params: {
          id: '01'
        }
      });
      commentController.read(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

  describe('update', () => {
    const updatedComment = {
      body: 'Updated Comment'
    };
    it('updates and returns a comment with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: comment.id
        },
        body: updatedComment
      });
      commentController.update(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.be.ok;
        data.body.should.be.equal('Updated Comment');
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('returns 404 when updating comment with an id that is not UUIDv4', done => {
      let req = httpMocks.createRequest({
        params: {
          id: '01'
        }
      });
      commentController.update(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

  describe('delete', () => {
    it('deletes a comment with the correct id', done => {
      let req = httpMocks.createRequest({
        params: {
          id: comment.id
        }
      });
      commentController.destroy(req, res);
      res.on('end', () => {
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('returns 404 when deleting comment with an id that is not UUIDv4', done => {
      let req = httpMocks.createRequest({
        params: {
          id: '01'
        }
      });
      commentController.destroy(req, res);
      res.on('end', () => {
        let data = JSON.parse(res._getData());
        data.should.not.be.ok;
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

});