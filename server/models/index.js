'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from './../config';
import serializer from './../serializers';
require('sequelize-values')();

let
  db = {},
  sequelize,
  options = {
    logging: false,
    dialect: 'postgres',
    define: {
      classMethods: {
        serialize: function (models, options) {
          const name = this.getTableName();
          return serializer.serialize(name, Sequelize.getValues(models), options);
        }
      },
      instanceMethods: {
        serialized: function (options) {
          const name = this.Model.getTableName();
          return serializer.serialize(name, this.getValues(), options);
        }
      }
    }
  };

if (process.env.NODE_ENV === 'production') {
  options.dialectOptions = {
    ssl: true
  };
}

sequelize = new Sequelize(config.databaseURL, options);

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function (file) {
    let model = sequelize.import(path.join(__dirname, file));
    if (Array.isArray(model)) {
      model.forEach(function (table) {
        db[table.name] = table;
      });
    } else {
      db[model.name] = model;
    }
  });

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;