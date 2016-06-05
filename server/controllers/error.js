'use strict';

import { Sequelize } from './../models';

exports.errors = (error, res) => {
  let code;
  switch (error.name) {
  case new Sequelize.ValidationError().name:
    code = 403;
    break;
  case new Sequelize.UniqueConstraintError().name:
    code = 409;
    break;
  case new Sequelize.ForeignKeyConstraintError().name:
    code = 409;
    break;
  case new Sequelize.DatabaseError(error).name:
    code = 403;
    break;
  default:
    code = 404;
    break;
  }
  res.status(code).json(error);
};

exports.sendError = function (code, req, res, message) {
  var status, detail;

  switch (code) {
  case 403:
    status = 'Unprocessable_entity';
    detail = 'Forbidden - unsupported request to create a resource.';
    break;
  case 404:
    status = 'Not Found';
    break;
  default:
    status = 'Something went wrong';
  }

  var error = {
    'errors': [
      {
        id: null,
        title: message,
        detail: detail,
        href: null,
        code: code,
        source: {
          'pointer': req.originalUrl
        },
        links: null,
        status: status
      }
    ]
  };
  res.status(code).send(error);
};