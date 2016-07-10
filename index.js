var events = require('events');
var util = require('util');
var Registration = require('./libs/registration');
var Authentication = require('./libs/authentication');
var mongoose = require('mongoose');
var UserModel = require('./schemas/user');

var Membership = function (connectData) {
    var self = this;
    events.EventEmitter.call(self);

    var connectDb = function(database, success) {
        if (mongoose.connection.readyState == 1) {
            success();
        }
        mongoose.connect(database, function (err, res) {
            if (err) {
                console.log ('ERROR connecting to: ' + database + '. ' + err);
            } else {
                console.log ('Succeeded connected to: ' + database);
                success();
            }
        });
    };

    var authenticate = function(email, password, next) {
        connectDb(connectData, function() {
            var auth = new Authentication();
            self.on('authenticated', function(authResult) {
                self.emit('authenticated', authResult);
            });
            self.on('not-authenticated', function(authResult) {
                self.emit('not-authenticated', authResult);
            });
            auth.authenticate({email: email, password: password}, next);
        });
        /*db.connect(connectData, function(err, db) {
            var auth = new Authentication(db);
            self.on('authenticated', function(authResult) {
                self.emit('authenticated', authResult);
            });
            self.on('not-authenticated', function(authResult) {
                self.emit('not-authenticated', authResult);
            });
            auth.authenticate({email: email, password: password}, next);
        });*/
    };

    var register = function(email, password, confirm, next) {
        connectDb(connectData, function() {
            var reg = new Registration();
            self.on('registered', function(regResult) {
                self.emit('registered', regResult);
            });
            self.on('not-registered', function(regResult) {
                self.emit('not-registered', regResult);
            });
            reg.applyForMembership({email: email, password: password, confirm: confirm}, next);
        });
        /*db.connect(connectData, function(err, db) {
            var reg = new Registration(db);
            self.on('registered', function(regResult) {
                self.emit('registered', regResult);
            });
            self.on('not-registered', function(regResult) {
                self.emit('not-registered', regResult);
            });
            reg.applyForMembership({email: email, password: password, confirm: confirm}, next);
        });*/
    };

    var findUserByToken = function(token, next) {
        connectDb(connectData, function() {
            assert.ok(err === null, err);
            UserModel.findOne({authenticationToken: token}, next);
        });
        /*db.connect(connectData, function(err, db) {
            assert.ok(err === null, err);
            db.users.first({authenticationToken: token}, next);
        });*/
    };

    return {
        authenticate: authenticate,
        register: register,
        findUserByToken: findUserByToken
    }
};

util.inherits(Membership, events.EventEmitter);
module.exports = Membership;