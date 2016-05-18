'use strict';

import should from 'should';
import mock from './../helpers/mock';
import models from './../../server/models';
import server from './../helpers/app';

let article, author, createArticle;

describe('Article API endpoints: ', () => {

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
    article = mock.article();
    article.authorId = author.id;
    createArticle = models.article.create(article);
    done();
  });

  afterEach(done => {
    models.article.truncate({cascade: true})
    .then(() => done());
  });

  describe('GET /articles', () => {
    it('fetch all articles', done => {
      server
      .get('/articles')
      .expect('Content-Type', /json/)
      .expect(200, done)
      .expect(res => {
        should.exist(res.body.data);
        res.body.data.should.be.instanceof(Array);
      }, done);
    });

    it('fetch an article with the specified id param', done => {
      createArticle.then(article => {
        server
        .get('/articles/' + article.id)
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(res => {
          should.exist(res.body.data);
          res.body.data.should.be.instanceof(Object);
        }, done);
      });
    });

    it('fetch all articles belonging to an author', done => {
      models.author.create(mock.author()).then(newAuthor => {
        let articles = mock.bulkArticlesForAuthor(newAuthor, 15);
        models.article.bulkCreate(articles).then(createdArticles => {
          server
          .get('/articles?authorId=' + newAuthor.id)
          .expect('Content-Type', /json/)
          .expect(200, done)
          .expect(res => {
            should.exist(res.body.data);
            res.body.data.should.be.instanceof(Array);
            res.body.data.should.have.length(createdArticles.length);
          }, done);
        });
      });
    });
  });

  describe('POST /articles', () => {
    it('creates a new article', done => {
      server
      .post('/articles')
      .set('Content-Type', 'application/json')
      .send(article)
      .expect('Content-Type', /json/)
      .expect(201, done)
      .expect(res => {
        should.exist(res.body.data);
        res.body.data.should.be.instanceof(Object);
      }, done);
    });

    it('does not create an article without an author', done => {
      server
      .post('/articles')
      .set('Content-Type', 'application/json')
      .send(mock.article())
      .expect('Content-Type', /json/)
      .expect(403, done);
    });
  });

  describe('PATCH /api/v1/articles', () => {
    it('updates an article', done => {
      createArticle.then(article => {
        server
        .patch('/articles/' + article.id)
        .set('Content-Type', 'application/json')
        .send({title: 'Updated Title'})
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(res => {
          should.exist(res.body.data);
          res.body.data.attributes.should.have.property('title', 'Updated Title');
        }, done);
      });
    });
  });

  describe('DELETE /articles', () => {
    it('deletes an article', done => {
      createArticle.then(article => {
        server
        .delete('/articles/' + article.id)
        .expect(204, done());
      });
    });
  });

});