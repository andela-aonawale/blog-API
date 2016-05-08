'use strict';

import { author, article } from './../models';

export function index(req, res) {
  author.findAll()
  .then(author => {
    res.status(200).json(author);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function create(req, res) {
  author.create(req.body)
  .then(author => {
    res.status(201).json(author);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function read(req, res) {
  author.findById(req.params.id)
  .then(author => {
    res.status(200).json(author);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function update(req, res) {
  author.update(req.body, {where: {id: req.params.id}, returning: true})
  .then(row => {
    res.status(200).json(row[1][0]);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function destroy(req, res) {
  author.destroy({where: {id: req.params.id}})
  .then(count => {
    res.status(200).json(count);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function readArticles(req, res) {
  article.findAll({where: {authorId: req.params.id}})
  .then(count => {
    res.status(200).json(count);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function destroyArticles(req, res) {
  article.destroy({where: {authorId: req.params.id}})
  .then(count => {
    res.status(200).json(count);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}