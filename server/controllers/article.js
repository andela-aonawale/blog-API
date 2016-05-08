'use strict';

import { article } from './../models';

export function index(req, res) {
  article.findAll()
  .then(article => {
    res.status(200).json(article);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function create(req, res) {
  article.create(req.body)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function read(req, res) {
  article.findById(req.params.id)
  .then(post => {
    res.status(200).json(post);
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
    res.status(200);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}