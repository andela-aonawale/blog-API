'use strict';

import gulp from 'gulp';
import istanbul from 'gulp-istanbul';
import mocha from 'mocha';
import models from './server/models';
import codacy from 'gulp-codacy';
import exit from 'gulp-exit';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import clean from 'gulp-clean';
import shell from 'gulp-shell';

const paths = {
  test: 'test/**/*.js',
  files: 'server/**',
  dist: 'dist'
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

gulp.task('clean-scripts', () => {
  return gulp.src(paths.dist, {read: false})
    .pipe(clean({
      force: true
    }));
});

gulp.task('build', ['clean-scripts'], () => {
  return gulp.src(paths.files)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], shell.task(['npm start']));
gulp.task('test', ['test:server', 'codacy']);
gulp.task('lint', ['eslint']);
gulp.task('clean', ['clean-scripts']);