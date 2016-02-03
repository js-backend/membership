var gulp = require('gulp');
var db = require('secondthought');
var assert = require('assert');
var config = require('./config');

gulp.task('install-db', function(done) {
    console.log('install db');
    db.connect(config.connectData, function(err, db) {
        console.log('install db ' + err + ' ' + db);
        /*db.install(['users', 'logs', 'sessions'], function(err, tableResult) {
            assert.ok(err === null, err);
            console.log('DB Installed: ' + tableResult);
            done();
        });*/
    });
});