'use strict';

export default {
  databaseURL: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/blog-api-test',
  bugsnagAPIKey: process.env.BUGSNAG_API_KEY || 'fdba9851e26486a7431672cc5d3ac5c4'
};