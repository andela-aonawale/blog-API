'use strict';

const
  should             = require('should'),
  models             = require('./../../server/models/'),
  server             = require('./../helpers/app'),
  mock               = require('./../helpers/mock');

let comment, article, createComment;

describe('Comment API endpoints: ', () => {

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

  describe('GET /articles/:id/comments', () => {
    it('fetch all comments that belongs to an article', done => {
      server
      .get('/articles/' + article.id + '/comments')
      .expect('Content-Type', /json/)
      .expect(200, done)
      .expect(res => {
        should.exist(res.body);
        res.body.should.be.instanceof(Array);
      }, done);
    });

    it('fetch a comment with the specified id param', done => {
      createComment.then(comment => {
        server
        .get('/comments/' + comment.id)
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(res => {
          should.exist(res.body);
          res.body.should.be.instanceof(Object);
        }, done);
      });
    });
  });

  describe('POST /articles/:id/comments', () => {
    it('creates a new comment', done => {
      server
      .post('/articles/' + article.id + '/comments')
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
      .post('/articles/' + article.id + '/comments')
      .set('Content-Type', 'application/json')
      .send(mock.comment())
      .expect(404, done);
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
          res.body.should.have.property('body', 'Updated Body');
        }, done);
      });
    });
  });

  describe('DELETE /comments', () => {
    it('deletes a comment', done => {
      createComment.then(comment => {
        server
        .delete('/comments/' + comment.id)
        .expect(200, done());
      });
    });
  });

});