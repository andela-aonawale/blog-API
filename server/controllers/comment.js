'use strict';

import { sendError, errors } from './error';
import { comment } from './../models';

export function index(req, res) {
  comment.findAll({where: {articleId: req.query.articleId}})
  .then(comments => res.status(200).json(comment.serialize(comments)))
  .catch(err => errors(err, res));
}

export function create(req, res) {
  comment.create(req.body)
  .then(comment => res.status(201).json(comment.serialized()))
  .catch(err => errors(err, res));
}

export function read(req, res) {
  comment.findById(req.params.id)
  .then(comment => {
    if (!comment) return sendError(404, req, res);
    res.status(200).json(comment.serialized());
  })
  .catch(err => errors(err, res));
}

export function update(req, res) {
  comment.update(req.body, {where: {id: req.params.id}, returning: true})
  .then(row => {
    if (!row[1][0]) sendError(404, req, res);
    res.status(200).json(row[1][0].serialized());
  })
  .catch(err => errors(err, res));
}

export function destroy(req, res) {
  comment.destroy({where: {id: req.params.id}})
  .then(() => res.sendStatus(204))
  .catch(err =>  errors(err, res));
}