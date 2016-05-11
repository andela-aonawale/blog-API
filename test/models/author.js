'use strict';

import should from 'should';
import mock from './../helpers/mock';
import { author } from './../../server/models';

describe('Author Model', function () {
  let createAuthor, mockAuthor;

  beforeEach(done => {
    mockAuthor = mock.author();
    createAuthor = author.create(mockAuthor);
    done();
  });

  afterEach(done => {
    author.truncate({cascade: true})
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
      author.findById(createdAuthor.id)
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
    createAuthor.then(createdAuthor => {
      createdAuthor.destroy().then(() => {
        author.findById(createdAuthor.id)
        .then(author => {
          should.not.exist(author);
          done();
        });
      });
    });
  });

});