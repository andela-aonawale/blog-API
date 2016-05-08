'use strict';

const models = require('./../../server/models/');
const should = require('should');

describe('Author Model', function () {
  let createAuthor, mockAuthor;

  beforeEach(done => {
    mockAuthor = {firstName: 'Ahmed', lastName: 'Ayo'};
    createAuthor = models.author.create(mockAuthor);
    done();
  });

  afterEach(done => {
    models.author.destroy({where: {}})
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