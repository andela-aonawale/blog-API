'use strict';

export default {
  databaseURL: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/blog-api-dev',
  bugsnagAPIKey: process.env.BUGSNAG_API_KEY || ''
};