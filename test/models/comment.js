'use strict';

const
  should = require('should'),
  mock   = require('./../helpers/mock'),
  models = require('./../../server/models/');

describe('Comment Model', function () {
  let mockComment, createComment, article;

  before(done => {
    models.author.create(mock.author())
    .then(author => {
      let mockArticle = mock.article();
      mockArticle.authorId = author.id;
      models.article.create(mockArticle)
      .then(createdArticle => {
        article = createdArticle;
        done();
      });
    });
  });

  after(done => {
    models.article.truncate({cascade: true})
    .then(() => done());
  });

  beforeEach(done => {
    mockComment = mock.comment();
    mockComment.articleId = article.id;
    createComment = models.comment.create(mockComment);
    done();
  });

  afterEach(done => {
    models.comment.truncate({cascade: true})
    .then(() => done());
  });

  it('creates a comment', done => {
    createComment.then(comment => {
      should.exist(comment);
      comment.articleId.should.equal(article.id);
      done();
    });
  });

  it('finds a comment', done => {
    createComment.then(createdComment => {
      models.comment.findById(createdComment.id)
      .then(comment => {
        should.exist(comment);
        comment.id.should.equal(createdComment.id);
        done();
      });
    });
  });

  it('updates a comment', function (done) {
    createComment.then(comment => {
      const newTitle = 'Stupid title';
      comment.title = newTitle;
      comment.save().then(comment => {
        should.exist(comment);
        comment.title.should.not.equal(mockComment.title);
        comment.title.should.equal(newTitle);
        done();
      });
    });
  });

  it('deletes a comment', function (done) {
    createComment.then(comment => {
      comment.destroy().then(() => {
        models.comment.findById(comment.id)
        .then(comment => {
          should.not.exist(comment);
          done();
        });
      });
    });
  });

});