'use strict';

import * as articles from './article';
import * as comments from './comment';
import * as authors from './author';

export default function (router) {
  router.route('/articles')
  .get(articles.index)
  .post(articles.create);

  router.route('/articles/:id')
  .get(articles.read)
  .patch(articles.update)
  .delete(articles.destroy);

  router.route('/articles/:article_id/comments')
  .get(comments.index)
  .post(comments.create);

  router.route('/comments/:id')
  .get(comments.read)
  .patch(comments.update)
  .delete(comments.destroy);

  router.route('/authors')
  .get(authors.index)
  .post(authors.create);

  router.route('/authors/:id')
  .get(authors.read)
  .patch(authors.update)
  .delete(authors.destroy);

  router.route('/authors/:id/articles')
  .get(authors.readArticles)
  .delete(authors.destroyArticles);
}