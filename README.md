# blog-API

This README outlines the details of collaborating on this Express application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* Install PostgreSQL (http://www.postgresql.org/download/macosx/)

## Setup your database

- Open psql

- Create a DB User
  `CREATE USER postgres WITH PASSWORD 'password';`

- Create a Dev Database
  `CREATE DATABASE blog-api-dev;`

- Create a Test Database
  `CREATE DATABASE blog-api-test;`

## Directory Layout

    server/               --> all the backend files
      config/             --> config files
      controllers/        --> backend controllers
      lib/
        aws/              --> node modules to integrate with AWS services (e.g. SQS)
        firebase/         --> node modules to authenticate server with Firebase
        redis/            --> node modules to access Redis data store
      middlewares/        --> Express app middlewares
      models/             --> backend data models (uses Sequelize ORM)
      workers/
    test/                 --> test files
      server/             --> backend unit specs/tests
    index.js              --> node server

## Installation

* `git clone <repository-url>`
* change into the new directory
* run `npm install`

## Setup

* Set NODE_ENV to development in your environment variables.

## Running / Development

* `gulp`
* Visit the app at [http://localhost:3000](http://localhost:3000).

### Running Tests

* `gulp test`
- `NODE_ENV=test gulp test` runs all tests

### Deploying

Specify what it takes to deploy your app.

## License
(The MIT License)

Copyright (c) 2016 Ahmed Onawale

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
