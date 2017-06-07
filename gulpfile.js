var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

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

gulp.task('browser', function(cb){

    var port = 2200;
    var wb = browserSync.create('browser1');

    var wbOpt = {
        server:'./dist',
        ui: {
            port: port + 1,
            weinre: {
                port: port + 2
            }
        },
        //观察文件变化，自动刷新，去掉不会刷新
        files: ['./dist/**'],
        port: port,
        open: false,// "external",
        //startPath: '/demo/box.html'
        startPath: 'index.html'
    };
    snippetOptions = snippetOptions && snippetOptions.enabled ? snippetOptions : null;
    if (snippetOptions)
        wbOpt.snippetOptions = snippetOptions;
    //console.log('wbOpt', wbOpt);
    wb.init(wbOpt,cb); //end site.init

});

var tsBrowserProject = ts.createProject('tsconfig-browser.json'),
    tsBrowserSrc = ['src/*.ts','src/testing/*.ts'];
gulp.task('tsc-browser', function () {
    return gulp.src(tsBrowserSrc)
        .pipe(sourcemaps.init())
        .pipe(tsBrowserProject())
        .js.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/browser'));
});

gulp.task('watch-browser', function(){
    gulp.watch(tsBrowserSrc, function(){
        gulp.start('tsc-browser');
    });
});


gulp.task('default', function () {
    gulp.start('tsc-browser', 'watch-browser');
});


gulp.task('temp', function () {
    return gulp.src(['src/*.ts','src/testing/*.ts'])
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