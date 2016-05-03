'use strict';

let env = process.env.NODE_ENV || 'development';
module.exports = require('./' + env);