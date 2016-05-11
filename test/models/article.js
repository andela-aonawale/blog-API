'use strict';

import should from 'should';
import mock from './../helpers/mock';
import { author, article } from './../../server/models';

describe('Article Model', () => {

  let mockArticle, createArticle, testAuthor;

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
    mockArticle = mock.article();
    mockArticle.authorId = testAuthor.id;
    createArticle = article.create(mockArticle);
    done();
  });

  afterEach(done => {
    article.truncate({cascade: true})
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
      article.findById(createdArticle.id)
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
    createArticle.then(createdArticle => {
      createdArticle.destroy().then(() => {
        article.findById(createdArticle.id)
        .then(article => {
          should.not.exist(article);
          done();
        });
      });
    });
  });

});