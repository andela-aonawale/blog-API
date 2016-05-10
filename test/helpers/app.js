'use strict';

const
  express            = require('express'),
  bodyParser         = require('body-parser'),
  request            = require('supertest'),
  controllers        = require('./../../dist/controllers');

module.exports = (function () {
  let app = express();
  app.use(bodyParser.json());

  controllers.default(app);

  return request(app);
}());