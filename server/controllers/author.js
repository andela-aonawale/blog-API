'use strict';

import { sendError, errors } from './error';
import { author, article } from './../models';

export function index(req, res) {
  author.findAll()
  .then(authors => res.status(200).json(author.serialize(authors)))
  .catch(err => errors(err, res));
}

export function create(req, res) {
  author.create(req.body)
  .then(author => res.status(201).json(author.serialized()))
  .catch(err => errors(err, res));
}

export function read(req, res) {
  author.findById(req.params.id, {include: [article]})
  .then(author => {
    if (!author) return sendError(404, req, res);
    res.status(200).json(author.serialized());
  })
  .catch(err => errors(err, res));
}

export function update(req, res) {
  author.update(req.body, {where: {id: req.params.id}, returning: true})
  .then(row => {
    if (!row[1][0]) sendError(404, req, res);
    res.status(200).json(row[1][0].serialized());
  })
  .catch(err => errors(err, res));
}

export function destroy(req, res) {
  author.destroy({where: {id: req.params.id}})
  .then(() => res.sendStatus(204))
  .catch(err => errors(err, res));
}