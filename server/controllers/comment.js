'use strict';

import { comment } from './../models';

export function index(req, res) {
  comment.findAll({where: {articleId: req.params.id}})
  .then(comment => {
    res.status(200).json(comment);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function create(req, res) {
  comment.create(req.body)
  .then(comment => {
    res.status(201).json(comment);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function read(req, res) {
  comment.findOne({where: {id: req.params.id}})
  .then(comment => {
    res.status(200).json(comment);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function update(req, res) {
  comment.update(req.body, {where: {id: req.params.id}, returning: true})
  .then(row => {
    res.status(200).json(row[1][0]);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

export function destroy(req, res) {
  comment.destroy({where: {id: req.params.id}})
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}