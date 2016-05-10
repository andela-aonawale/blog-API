'use strict';

const
  should             = require('should'),
  models             = require('./../../server/models/'),
  server             = require('./../helpers/app'),
  mock               = require('./../helpers/mock');

let author;

describe('Author API endpoints: ', () => {

  beforeEach(done => {
    author = mock.author();
    done();
  });

  afterEach(done => {
    models.author.truncate({cascade: true})
    .then(() => done());
  });

  describe('GET /authors', () => {
    it('fetch all authors', done => {
      server
      .get('/authors')
      .expect('Content-Type', /json/)
      .expect(200, done)
      .expect(res => {
        should.exist(res.body);
        res.body.should.be.instanceof(Array);
      }, done);
    });

    it('fetch an author with the specified id param', done => {
      models.author.create(author).then(author => {
        server
        .get('/authors/' + author.id)
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(res => {
          should.exist(res.body);
          res.body.should.be.instanceof(Object);
        }, done);
      });
    });
  });

  describe('POST /authors', () => {
    it('creates a new author', done => {
      server
      .post('/authors')
      .set('Content-Type', 'application/json')
      .send(author)
      .expect('Content-Type', /json/)
      .expect(201, done)
      .expect(res => {
        should.exist(res.body);
        res.body.should.be.instanceof(Object);
      }, done);
    });
  });

  describe('PATCH /api/v1/authors', () => {
    it('updates an author', done => {
      models.author.create(author).then(author => {
        server
        .patch('/authors/' + author.id)
        .set('Content-Type', 'application/json')
        .send({firstName: 'Dab'})
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(res => {
          should.exist(res.body);
          res.body.should.have.property('firstName', 'Dab');
        }, done);
      });
    });
  });

  describe('DELETE /authors', () => {
    it('deletes an author', done => {
      models.author.create(author).then(author => {
        server
          .delete('/authors/' + author.id)
          .expect(200, done());
      });
    });
  });

  describe('GET /authors/:id/articles', () => {
    it('fetch all articles belonging to an author', done => {
      models.author.create(author).then(author => {
        let articles = mock.bulkArticlesForAuthor(author, 5);
        models.article.bulkCreate(articles).then(createdArticles => {
          server
          .get('/authors/' + author.id + '/articles')
          .expect('Content-Type', /json/)
          .expect(200, done)
          .expect(res => {
            should.exist(res.body);
            res.body.should.be.instanceof(Array);
            res.body.should.have.length(createdArticles.length);
          }, done);
        });
      });
    });
  });

  describe('DELETE /authors/:id/articles', () => {
    it('delete all articles belonging to an author', done => {
      models.author.create(author).then(author => {
        let articles = mock.bulkArticlesForAuthor(author, 5);
        models.article.bulkCreate(articles).then(() => {
          server
          .delete('/authors/' + author.id + '/articles')
          .expect('Content-Type', /json/)
          .expect(200, done());
        });
      });
    });
  });

});