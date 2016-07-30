var gulp = require('gulp');
var karma = require('karma').server;
var jade = require('gulp-jade');

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/tests/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('jade', function (done) {
    var jadeFiles = [{
        src: './views/index.jade',
        dest: './views/'
    }];

    return jadeFiles.forEach(function (jf) {
        if (!jf.src || !jf.dest) return;

        gulp.src(jf.src)
            .pipe(jade())
            .pipe(gulp.dest(jf.dest))
        ;

        done();
    });
});