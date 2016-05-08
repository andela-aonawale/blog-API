'use strict';

const models = require('./../../server/models/');
const should = require('should');

describe('Comment Model', function () {
  let mockComment, createComment, testArticle;

  before(done => {
    models.author.create({firstName: 'Ahmed', lastName: 'Ayo'})
    .then(author => {
      models.article.create({
        title: 'A good title',
        body: 'Awesome Content',
        authorId: author.id
      })
      .then(article => {
        testArticle = article;
        done();
      });
    });
  });

  after(done => {
    models.article.destroy({where: {}})
    .then(() => done());
  });

  beforeEach(done => {
    mockComment = {
      body: 'A f**king awesome comment',
      articleId: testArticle.id
    };
    createComment = models.comment.create(mockComment);
    done();
  });

  afterEach(done => {
    models.comment.destroy({where: {}})
    .then(() => done());
  });

  it('creates a comment', done => {
    createComment.then(comment => {
      should.exist(comment);
      comment.articleId.should.equal(testArticle.id);
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