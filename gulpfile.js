var gulp = require('gulp');
var karma = require('karma').Server;
var jade = require('gulp-jade');

gulp.task('test', function (done) {
    new karma({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('jade', function (done) {
    var jadeFiles = [{
        src: './views/index.jade',
        dest: './views/'
    }, {
        src: './views/apriori.jade',
        dest: './views/'
    }];

    return jadeFiles.forEach(function (jf) {
        if (!jf.src || !jf.dest) return;

        gulp.src(jf.src)
            .pipe(jade())
            .pipe(gulp.dest(jf.dest))
        ;
    });
});