var db = require('secondthought');
var config = require('./config');
var Membership = require('../index');
var should = require('should');

describe('Main API', function() {
    var membership = {};
    before(function(done) {
        membership = new Membership(config.connectData);
        db.connect(config.connectData, function(err, db) {
            db.users.destroyAll(function(err, result) {
                done();
            });
        });
    });

    describe('authentication', function() {
        var newUser = {};
        before(function(done) {
            membership.register('test@test.com', 'password', 'password', function(err, result) {
                newUser = result.user;
                assert.ok(result.success, 'Cannot register');
                done();
            });
        });

        it('authenticates', function(done) {
            membership.authenticate('test@test.com', 'password', function(err, result) {
                result.success.should.equal(true);
                done();
            });
        });

        it('gets by token', function(done) {
            membership.findUserByToken(newUser.authenticationToken, function(err, result) {
                result.should.be.defined;
                done();
            });
        });
    });
});