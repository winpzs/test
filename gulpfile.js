var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', function () {
    return gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({
            noImplicitAny: true,
            experimentalDecorators:true,
            "target": "es3",
            module:'amd',
            out: 'index.js'
        }))
        .js.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('default-bak', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            experimentalDecorators:true,
            "target": "es3",
            module:'amd',
            out: 'index.js'
        }))
        .pipe(gulp.dest('dist/scripts'));
});
