'use strict';

import should from 'should';
import mock from './../helpers/mock';
import models from './../../server/models';
import server from './../helpers/app';

let comment, article, createComment;

describe('Comment Route Tests: ', () => {

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
    .then(() => {
      models.article.truncate({cascade: true})
      .then(() => done());
    });
  });

  beforeEach(done => {
    comment = mock.comment();
    comment.articleId = article.id;
    createComment = models.comment.create(comment);
    done();
  });

  afterEach(done => {
    models.comment.truncate()
    .then(() => done());
  });

  describe('GET /comments', () => {
    it('fetch all comments that belongs to an article', done => {
      server
      .get('/comments?articleId=' + article.id)
      .expect('Content-Type', /json/)
      .expect(200, done)
      .expect(res => {
        should.exist(res.body.data);
        res.body.data.should.be.instanceof(Array);
      }, done);
    });

    it('fetch a comment with the specified id param', done => {
      createComment.then(comment => {
        server
        .get('/comments/' + comment.id)
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(res => {
          should.exist(res.body.data);
          res.body.data.should.be.instanceof(Object);
        }, done);
      });
    });

    it('returns no comment when the articleId query is missing', done => {
      server
      .get('/comments')
      .expect('Content-Type', /json/)
      .expect(200, done)
      .expect(res => {
        should.exist(res.body.data);
        res.body.data.should.have.length(0);
      }, done);
    });
  });

  describe('POST /comments', () => {
    it('creates a new comment', done => {
      server
      .post('/comments')
      .set('Content-Type', 'application/json')
      .send(comment)
      .expect('Content-Type', /json/)
      .expect(201, done)
      .expect(res => {
        should.exist(res.body);
        res.body.should.be.instanceof(Object);
      }, done);
    });

    it('does not create a comment without an article', done => {
      server
      .post('/comments')
      .set('Content-Type', 'application/json')
      .send(mock.comment())
      .expect(403, done);
    });
  });

  describe('PATCH /comments', () => {
    it('updates an existing comment', done => {
      createComment.then(comment => {
        server
        .patch('/comments/' + comment.id)
        .set('Content-Type', 'application/json')
        .send({body: 'Updated Body'})
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(res => {
          should.exist(res.body);
          res.body.data.attributes.should.have.property('body', 'Updated Body');
        }, done);
      });
    });
  });

  describe('DELETE /comments', () => {
    it('deletes a comment', done => {
      createComment.then(comment => {
        server
        .delete('/comments/' + comment.id)
        .expect(204, done());
      });
    });
  });

});