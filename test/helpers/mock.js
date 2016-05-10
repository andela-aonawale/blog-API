'use strict';

exports.article = function () {
  return {
    title: 'A article',
    body: 'Post Content'
  };
};

exports.bulkArticlesForAuthor = function (author, count) {
  let array = [];
  for (var i=0; i < count; i++) {
    let article = this.article();
    article.authorId = author.id;
    array.push(article);
  }
  return array;
};

exports.bulkCommentsForArticle = function (article, count) {
  let array = [];
  for (var i=0; i < count; i++) {
    let comment = this.comment();
    comment.articleId = article.id;
    array.push(comment);
  }
  return array;
};

exports.bulkAuthors = function (count) {
  let array = [];
  for (var i=0; i < count; i++) {
    let author = this.author();
    array.push(author);
  }
  return array;
};

exports.author = function () {
  return {
    firstName: 'Ahmed',
    lastName: 'Ayo'
  };
};

exports.comment = function () {
  return {
    body: 'Super awesome comment'
  };
};