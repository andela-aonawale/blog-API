'use strict';

import winston from 'winston';
import bugsnag from 'bugsnag';
import winstonBugsnag from 'winston-bugsnag';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import controllers from './controllers';
import models from './models';
// import middlewares from './middlewares';

bugsnag.register(process.env.BUGSNAG_API_KEY);
winston.add(winstonBugsnag);

global._ = require('lodash');
global.t = require('moment');

export function start() {
  var app = express();

  // Create router
  const router = express.Router();

  app.use((req, res, next) => {
    req.getUrl = () => {
      return `${req.protocol} :// ${req.get('host')} ${req.originalUrl}`;
    };
    // onto the next one
    next();
  });

  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/vnd.api+json');
    // onto the next one
    next();
  });

  app.set('port', process.env.PORT || 3000);
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.json({
    type: 'application/vnd.api+json'
  }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  models.sequelize.sync().then(() => {
    // initialize middlewares
    // middlewares(app);
    // initialize controller
    controllers(router);
    app.use('/api/v1', router);
    // start the server
    app.listen(app.get('port'), () => {
      winston.info('Listening on port %d', app.get('port'));
    });
  });
}