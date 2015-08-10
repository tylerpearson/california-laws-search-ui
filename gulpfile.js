// gulpfile.js

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('build', function () {
    browserify({
        entries: 'src/react/index.jsx',
        extensions: ['.jsx'],
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('js/index.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
