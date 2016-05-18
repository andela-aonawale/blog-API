'use strict';

import { sendError, errors } from './error';
import { article, comment, author } from './../models';

export function index(req, res) {
  const options = req.query.authorId ? {where: {authorId: req.query.authorId}} : {};
  options.include = [author];
  article.findAll(options)
  .then(articles => res.status(200).json(article.serialize(articles)))
  .catch(err => errors(err, res));
}

export function create(req, res) {
  article.create(req.body)
  .then(article => res.status(201).json(article.serialized()))
  .catch(err => errors(err, res));
}

export function read(req, res) {
  article.findById(req.params.id, {include: [comment, author]})
  .then(article => {
    if (!article) return sendError(404, req, res);
    res.status(200).json(article.serialized());
  })
  .catch(err => errors(err, res));
}

export function update(req, res) {
  article.update(req.body, {where: {id: req.params.id}, returning: true})
  .then(row => {
    if (!row[1][0]) sendError(404, req, res);
    res.status(200).json(row[1][0].serialized());
  })
  .catch(err => errors(err, res));
}

export function destroy(req, res) {
  article.destroy({where: {id: req.params.id}})
  .then(() => res.sendStatus(204))
  .catch(err => errors(err, res));
}