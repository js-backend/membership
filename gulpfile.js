var gulp = require('gulp');
var db = require('secondthought');
var assert = require('assert');

gulp.task('install-db', function(done) {
    console.log('install db' );

    var connectData = {
        host: 'ec2-52-28-64-17.eu-central-1.compute.amazonaws.com',
        port: 28015,
        db: 'membership'
    };

    db.connect(connectData, function(err, db) {
        db.install(['users', 'logs', 'sessions'], function(err, tableResult) {
            assert.ok(err === null, err);
            console.log('DB Installed: ' + tableResult);
            done();
        });
    });
});