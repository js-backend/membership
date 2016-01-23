var Registration = require('../libs/registration');

describe('Registration', function() {

    var regResult = {};

    describe('a valid application', function() {
        before(function() {
            regResult = Registration.applyForMembership({email: 'test-user@email.com', password: 'pass-word', confirm: 'pass-word'});
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