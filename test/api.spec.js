var config = require('./config');
var Membership = require('../index');
var TestHelper = require('./test-helper');

describe('Main API', function() {
    var membership = {};
    before(function(done) {
        membership = new Membership(config.storage.database);
        TestHelper.connectDb(config.storage.database, function() {
            TestHelper.deleteAllUsers(function () {
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

        it('gets by id', function(done) {
            membership.findUserById(newUser.id, function(err, result) {
                result.should.be.defined;
                done();
            });
        });

        it('gets users', function(done) {
            membership.getUsers(1, 3, function(err, results) {
                results.should.be.defined;
                done()
            });
        });
    });
});
