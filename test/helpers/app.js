'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import controllers from './../../server/controllers';

module.exports = (function () {
  let app = express();
  app.use(bodyParser.json());

  controllers(app);

  return request(app);
}());