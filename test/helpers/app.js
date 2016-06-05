'use strict';

import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import controllers from './../../server/controllers';

module.exports = (function () {
  let app = express();
  app.use(bodyParser.json());

  controllers(app);

  fs.readdirSync(`${__dirname}/../../server/serializers`)
  .forEach(file => require(`${__dirname}/../../server/serializers/${file}`));

  return request(app);
}());