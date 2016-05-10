'use strict';

const
  should = require('should'),
  mock   = require('./../helpers/mock'),
  models = require('./../../server/models/');

describe('Article Model', function () {

  let mockArticle, createArticle, testAuthor;

  before(done => {
    models.author.create(mock.author())
    .then(author => {
      testAuthor = author;
      done();
    });
  });

  after(done => {
    models.author.truncate({cascade: true})
    .then(() => done());
  });

  beforeEach(done => {
    mockArticle = mock.article();
    mockArticle.authorId = testAuthor.id;
    createArticle = models.article.create(mockArticle);
    done();
  });

  afterEach(done => {
    models.article.truncate({cascade: true})
    .then(() => done());
  });

  it('creates an article', done => {
    createArticle.then(article => {
      should.exist(article);
      article.authorId.should.equal(testAuthor.id);
      done();
    });
  });

  it('finds an article', done => {
    createArticle.then(createdArticle => {
      models.article.findById(createdArticle.id)
      .then(article => {
        should.exist(article);
        article.id.should.equal(createdArticle.id);
        done();
      });
    });
  });

  it('updates an article', function (done) {
    createArticle.then(article => {
      const newTitle = 'Stupid title';
      article.title = newTitle;
      article.save().then(article => {
        should.exist(article);
        article.title.should.not.equal(mockArticle.title);
        article.title.should.equal(newTitle);
        done();
      });
    });
  });

  it('deletes an article', function (done) {
    createArticle.then(article => {
      article.destroy().then(() => {
        models.article.findById(article.id)
        .then(article => {
          should.not.exist(article);
          done();
        });
      });
    });
  });

});