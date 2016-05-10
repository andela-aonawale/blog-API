'use strict';

const
  should = require('should'),
  mock   = require('./../helpers/mock'),
  models = require('./../../server/models/');

describe('Author Model', function () {
  let createAuthor, mockAuthor;

  beforeEach(done => {
    mockAuthor = mock.author();
    createAuthor = models.author.create(mockAuthor);
    done();
  });

  afterEach(done => {
    models.author.truncate({cascade: true})
    .then(() => done());
  });

  it('creates an author', done => {
    createAuthor.then(author => {
      should.exist(author);
      done();
    });
  });

  it('finds an author', done => {
    createAuthor.then(createdAuthor => {
      models.author.findById(createdAuthor.id)
      .then(author => {
        should.exist(author);
        done();
      });
    });
  });

  it('updates an author', function (done) {
    createAuthor.then(author => {
      const newFirstName = 'Whatever';
      author.firstName = newFirstName;
      author.save().then(author => {
        should.exist(author);
        author.firstName.should.not.equal(mockAuthor.title);
        author.firstName.should.equal(newFirstName);
        done();
      });
    });
  });

  it('deletes an author', function (done) {
    createAuthor.then(author => {
      author.destroy().then(() => {
        models.author.findById(author.id)
        .then(author => {
          should.not.exist(author);
          done();
        });
      });
    });
  });

});