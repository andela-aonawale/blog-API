'use strict';

import gulp from 'gulp';
import istanbul from 'gulp-istanbul';
import mocha from 'mocha';
import models from './server/models';
import nodemon from 'gulp-nodemon';
import codacy from 'gulp-codacy';
import exit from 'gulp-exit';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import logger from 'winston';

let paths = {
  test: 'test/**/*.js',
  files: 'server/**'
};

gulp.task('db:sync', () => {
  return models.sequelize.sync().then(exit());
});

gulp.task('eslint', () => {
  return gulp.src(paths.files)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('coverage-setup', () => {
  return gulp.src(['./app/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hooqkRequire());
});

gulp.task('codacy', ['test:server'], () => {
  return gulp
    .src(['./test/coverage/lcov.info'], { read: false })
    .pipe(codacy({
      token: 'fUtjimzDRlq2pKnH6VIX'
    }))
    .pipe(exit());
});

gulp.task('test:server', ['db:sync', 'coverage-setup'], () => {
  return gulp.src(paths.test)
    .pipe(mocha({
      timeout: 30000,
      reporter: 'spec'
    }))
    .pipe(istanbul.writeReports({
      dir: './test/coverage'
    }));
});

gulp.task('build', () => {
  return gulp.src(paths.files)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('nodemon', ['build'], () => {
  nodemon({
    script: 'dist/index.js',
    ext: 'js',
    ignore: ['public/**', 'app/**', 'node_modules/**']
  })
  .on('restart', () => {
    logger.log('>> node restart');
  });
});

gulp.task('default', ['nodemon']);
gulp.task('test', ['test:server', 'codacy']);
gulp.task('lint', ['eslint']);