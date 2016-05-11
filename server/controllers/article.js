'use strict';

import { article, comment, author } from './../models';

export function index(req, res) {
  const options = req.query.authorId ? {where: {authorId: req.query.authorId}} : {};
  article.findAll(options)
  .then(articles => {
    res.status(200).json(articles);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function create(req, res) {
  article.create(req.body)
  .then(article => {
    res.status(201).json(article);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function read(req, res) {
  article.findById(req.params.id, {include: [comment, {model: author, as: 'createdBy'}]})
  .then(article => {
    res.status(200).json(article);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function update(req, res) {
  article.update(req.body, {where: {id: req.params.id}, returning: true})
  .then(row => {
    res.status(200).json(row[1][0]);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function destroy(req, res) {
  article.destroy({where: {id: req.params.id}})
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}