'use strict';

import { author, article } from './../models';

export function index(req, res) {
  author.findAll()
  .then(authors => {
    res.status(200).json(authors);
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
  author.findById(req.params.id, {include: [article]})
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
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}