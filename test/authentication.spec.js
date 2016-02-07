var Registration = require('../libs/registration');
var db = require('secondthought');
var config = require('../config');
assert = require('assert');
var Authentication = require('../libs/authentication');
var should = require('should');

describe('Authentication', function() {

    var reg = {};
    var auth = {};
    before(function(done) {
        db.connect(config.connectData, function(err, db) {
            reg = new Registration(db);
            auth = new Authentication(db);
            db.users.destroyAll(function(err, result) {
                reg.applyForMembership({email: 'test@test.com', password: 'password', confirm: 'password'},
                    function(err, regResult) {
                        assert.ok(regResult.success);
                        done();
                    }
                );
            });
        });
    });

    describe('a valid login', function() {
        var authResult = {};
        before(function(done) {
            // log them in...
            auth.authenticate({email: 'test@test.com', password: 'password'},
                function(err, result) {
                    assert.ok(err === null, err);
                    authResult = result;
                    done();
                });
        });
        it('is successful', function () {
            authResult.success.should.equal(true);
        });
        it('returns a user', function() {
            should.exist(authResult.user);
        });
        it('creates a log entry', function() {
            should.exist(authResult.log);
        });
        it('updates the user stats', function() {
            authResult.user.signInCount.should.equal(2);
        });
        it('updates the signOn dates', function() {
            should.exist(authResult.user.lastLoginAt);
            should.exist(authResult.user.currentLoginAt);
        });
    });

    describe('empty email', function() {
        var authResult = {};
        before(function(done) {
            // log them in...
            auth.authenticate({email: null, password: 'password'},
                function(err, result) {
                    assert.ok(err === null, err);
                    authResult = result;
                    done();
                });
        });
        it('is not successful', function () {
            authResult.success.should.equal(false);
        });
        it('returns a message saying "Invalid  Login"', function() {
            authResult.message.should.equal('Invalid email or password');
        });
    });

    describe('empty password', function() {
        var authResult = {};
        before(function(done) {
            // log them in...
            auth.authenticate({email: 'test@test.com', password: null},
                function(err, result) {
                    assert.ok(err === null, err);
                    authResult = result;
                    done();
                });
        });
        it('is not successful', function () {
            authResult.success.should.equal(false);
        });
        it('returns a message saying "Invalid  Login"', function() {
            authResult.message.should.equal('Invalid email or password');
        });
    });

    describe('password does not match', function() {
        var authResult = {};
        before(function(done) {
            // log them in...
            auth.authenticate({email: 'test@test.com', password: 'foo'},
                function(err, result) {
                    assert.ok(err === null, err);
                    authResult = result;
                    done();
                });
        });
        it('is not successful', function () {
            authResult.success.should.equal(false);
        });
        it('returns a message saying "Invalid  Login"', function() {
            authResult.message.should.equal('Invalid email or password');
        });
    });

    describe('email not found', function() {
        var authResult = {};
        before(function(done) {
            // log them in...
            auth.authenticate({email: 'xxxxxxx@test.com', password: 'foo'},
                function(err, result) {
                    assert.ok(err === null, err);
                    authResult = result;
                    done();
                });
        });
        it('is not successful', function () {
            authResult.success.should.equal(false);
        });
        it('returns a message saying "Invalid  Login"', function() {
            authResult.message.should.equal('Invalid email or password');
        });
    });
});