var Registration = require('../libs/registration');
var TestHelper = require('./test-helper');
var config = require('./config');
var UserModel = require('../schemas/user');


describe('Registration', function() {
    var reg = {};
    before(function(done) {
        TestHelper.connectDb(config.storage.database, function() {
            reg = new Registration();
            done();
        });
    });

    describe('a valid application', function() {
        var regResult = {};
        before(function(done) {
            UserModel.remove({}, function () {
                reg.applyForMembership(
                    {email: 'reg-test@test.com', password: 'password', confirm: 'password'},
                    function(err, result) {
                        regResult = result;
                        done();
                    }
                );
            });
        });
        it('is successful', function() {
            regResult.success.should.equal(true);
        });
        it('creates a user', function() {
            regResult.user.should.be.defined;
        });
        it('creates a log entry', function() {
            regResult.log.should.be.defined;
        });
        it('sets the user status to approved', function() {
            regResult.user.status.should.equal('approved');
        });
        it('offers a welcome message', function() {
            regResult.message.should.equal('Welcome!');
        });
        it('increments the signInCount', function() {
            regResult.user.signInCount.should.equal(1);
        });
    });

    describe('an empty or null email', function() {
        var regResult = {};
        before(function(done) {
            UserModel.remove({}, function () {
                reg.applyForMembership(
                    {email: '', password: 'password', confirm: 'password'},
                    function(err, result) {
                        regResult = result;
                        done();
                    }
                );
            });
        });
        it('is not successful', function () {
            regResult.success.should.equal(false);
        });
        it('tells user that email is required', function () {
            regResult.message.should.equal('Email and password are required');
        });
    });

    describe('empty or null password', function() {
        var regResult = {};
        before(function(done) {
            UserModel.remove({}, function () {
                reg.applyForMembership(
                    {email: 'reg-test@test.com', password: '', confirm: ''},
                    function(err, result) {
                        regResult = result;
                        done();
                    }
                );
            });
        });
        it('is not successful', function() {
            regResult.success.should.equal(false);
        });
        it('tells user that password is required', function() {
            regResult.message.should.equal('Email and password are required');
        });
    });

    describe('password and confirm mismatch', function() {
        var regResult = {};
        before(function(done) {
            UserModel.remove({}, function () {
                reg.applyForMembership(
                    {email: 'reg-test@test.com', password: 'password1', confirm: 'password2'},
                    function(err, result) {
                        regResult = result;
                        done();
                    }
                );
            });
        });
        it('is not successful', function() {
            regResult.success.should.equal(false);
        });
        it('tells user that passwords do not match', function() {
            regResult.message.should.equal('Passwords do not match');
        });
    });

    describe('email already exists', function() {
        var regResult = {};
        before(function(done) {
            UserModel.remove({}, function () {
                var credentials = {email: 'reg-test@test.com', password: 'password', confirm: 'password'};
                reg.applyForMembership(credentials,
                    function() {
                        reg.applyForMembership(credentials, function(err, result) {
                            regResult = result;
                            done();
                        });
                    }
                );
            });
        });
        it('is not successful', function()  {
            regResult.success.should.equal(false);
        });
        it('tells user that email already exists', function()  {
            regResult.message.should.equal('This email already exists');
        });
    });
});
