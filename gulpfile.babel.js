'use strict';

import gulp from 'gulp';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';
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
  dist: 'dist',
  coverage: 'test/coverage'
};

gulp.task('db:sync', () => models.sequelize.sync().then(() => exit()));

gulp.task('eslint', () => {
  return gulp.src(paths.files)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('clean:coverage', () => {
  return gulp.src(paths.coverage, {read: false})
    .pipe(clean({
      force: true
    }));
});

gulp.task('coverage:setup', ['clean:coverage'], () => {
  return gulp.src([`${paths.dist}/**/*.js`])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('codacy', ['test:server'], () => {
  return gulp
    .src(['./test/coverage/lcov.info'], { read: false })
    .pipe(codacy({
      token: 'fUtjimzDRlq2pKnH6VIX'
    }))
    .pipe(exit());
});

gulp.task('test:server', ['db:sync', 'coverage:setup'], () => {
  return gulp.src(paths.test)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(mocha({
      timeout: 30000,
      reporter: 'spec',
      compilers: [
        'js:babel-core/register'
      ],
      require: ['babel-polyfill']
    }))
    .pipe(istanbul.writeReports({
      dir: paths.coverage
    }));
});

gulp.task('clean:dist', () => {
  return gulp.src(paths.dist, {read: false})
    .pipe(clean({
      force: true
    }));
});

gulp.task('build', ['clean:dist'], () => {
  return gulp.src(paths.files)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], shell.task(['npm run dev']));
gulp.task('test', ['test:server', 'codacy']);
gulp.task('lint', ['eslint']);
gulp.task('clean', ['clean:dist']);