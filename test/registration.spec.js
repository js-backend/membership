var Registration = require('../libs/registration');
var mongoose = require('mongoose');

describe('Registration', function() {
    var reg = {};
    before(function(done) {
        var db = mongoose.connect('mongodb://admin:admin@ds049935.mongolab.com:49935/membership');
        reg = new Registration(db);
        done();
    });
    describe('a valid application', function() {
        var regResult = {};
        before(function(done) {
            reg.applyForMembership(
                {email: 'test-user@email.com', password: 'pass-word', confirm: 'pass-word'},
                function(err, result) {
                    regResult = result;
                    done();
                }
            );
        });
        it('is successful', function() {
            regResult.success.should.equal(true);
        });
        it('creates a user', function() {
            regResult.user.should.be.defined;
        });
        it('creates a log entry');
        it('sets the user status to approved');
        it('offers a welcome message');
    });

    describe('an empty or null email', function() {
        it('is not successful');
        it('tells user that email is required');
    });

    describe('empty or null password', function() {
        it('is not successful');
        it('tells user that password is required');
    });

    describe('password and confirm mismatch', function() {
        it('is not successful');
        it('tells user that passwords do not match');
    });

    describe('email already exists', function() {
        it('is not successful');
        it('tells user that email already exists');
    });
});