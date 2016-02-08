var events = require('events');
var util = require('util');
var Registration = require('./libs/registration');
var Authentication = require('./libs/authentication');
var db = require('secondthought');

var Membership = function (connectData) {
    var self = this;
    events.EventEmitter.call(self);

    var authenticate = function(email, password, next) {
        db.connect(connectData, function(err, db) {
            var auth = new Authentication(db);
            self.on('authenticated', function(authResult) {
                self.emit('authenticated', authResult);
            });
            self.on('not-authenticated', function(authResult) {
                self.emit('not-authenticated', authResult);
            });
            auth.authenticate({email: email, password: password}, next);
        });
    };

    var register = function(email, password, confirm, next) {
        db.connect(connectData, function(err, db) {
            var reg = new Registration(db);
            self.on('registered', function(regResult) {
                self.emit('registered', regResult);
            });
            self.on('not-registered', function(regResult) {
                self.emit('not-registered', regResult);
            });
            reg.applyForMembership({email: email, password: password, confirm: confirm}, next);
        });
    };

    var findUserByToken = function(token, next) {
        db.connect(connectData, function(err, db) {
            assert.ok(err === null, err);
            db.users.first({authenticationToken: token}, next);
        });
    };

    return {
        authenticate: authenticate,
        register: register,
        findUserByToken: findUserByToken
    }
};

util.inherits(Membership, events.EventEmitter);
module.exports = Membership;