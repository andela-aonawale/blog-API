'use strict';

import fs from 'fs';
import path from 'path';
import cors from 'cors';
import winston from 'winston';
import bugsnag from 'bugsnag';
import winstonBugsnag from 'winston-bugsnag';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import controllers from './controllers';
import models from './models';
import config from './config';
import methodOverride from 'method-override';
// import middlewares from './middlewares';

bugsnag.register(process.env.BUGSNAG_API_KEY);
winston.add(winstonBugsnag);

global._ = require('lodash');
global.t = require('moment');

export function start() {
  // Initialize express app
  const app = express();

  // configure express app
  app.locals.title = 'blog API';
  app.set('port', process.env.PORT || 3000);
  app.set('env', process.env.NODE_ENV || 'development');

  // Request body parsing middleware should be above methodOverride
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(bodyParser.json({type: 'application/vnd.api+json'}));
  app.use(methodOverride());

  // Create router
  const router = express.Router();

  // Enable CORS for allowed origins
  const corsOptions = {
    origin: (origin, callback) => {
      var originIsWhitelisted = config.allowedOrigins.split(',').indexOf(origin) > -1;
      callback(null, originIsWhitelisted);
    }
  };
  app.use(cors(corsOptions));

  /*
    Disable X-Powered-By header. Attackers can use this header (which is enabled by default) to detect apps running Express and then launch specifically-targeted attacks.
  */
  app.disable('x-powered-by');

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

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // glob serializers
  fs.readdirSync(path.normalize(`${path.basename(__dirname)}/serializers`))
  .forEach(file => require(`./serializers/${file}`));

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