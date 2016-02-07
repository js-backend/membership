var User = require('../models/user');
var Application = require('../models/application');
var db = require('secondthought');
var assert = require('assert');
var bCrypt = require('bcrypt-nodejs');
var Log = require('../models/log');
var Emitter = require('events').EventEmitter;
var util = require('util');

var RegResult = function() {
    var result = {
        success: false,
        message: null,
        user: null
    };
    return result;
};

var Registration  = function(db) {

    Emitter.call(this);
    var self = this;
    continueWith = null;

    var validateInputs = function(app) {
        if (!app.email || !app.password) {
            app.setInvalid('Email and password are required');
            self.emit('invalid', app);
        } else if(app.password !== app.confirm) {
            app.setInvalid('Passwords do not match');
            self.emit('invalid', app);
        } else {
            app.validate();
            self.emit('validated', app);
        }
    };

    var checkIfUserExists = function(app) {
        db.users.exists({email: app.email}, function(err, exists) {
            assert.ok(err === null, err);
            if (exists) {
                app.setInvalid('This email already exists');
                self.emit('invalid', app);
            } else {
                self.emit('user-does-not-exists', app);
            }
        });
    };

    var createUser = function(app) {
        var user = new User(app);
        user.status = 'approved';
        user.signInCount = 1;
        user.hashedPassword = bCrypt.hashSync(app.password);
        db.users.save(user, function(err, newUser) {
            assert.ok(err === null, err);
            app.user = newUser;
            self.emit('user-created', app);
        });
    };

    var addLogEntry = function(app) {
        var log = new Log({
            subject: 'Registration',
            userId: app.user.id,
            entry: 'Successfully Registered'
        });
        db.logs.save(log, function(err, newLog) {
            app.log = newLog;
            self.emit('log-created', app);
        });
    };

// var args = {email: 'email@mail.com', password: 'password'}
    var applyForMembership = function(args, next) {
        continueWith = next;
        var app = new Application(args);
        self.emit('application-received', app);
    };

    var registrationOk = function(app) {
        var regResult = new RegResult;
        regResult.success = true;
        regResult.message = 'Welcome!';
        regResult.user = app.user;
        regResult.log = app.log;
        continueWith && continueWith(null, regResult);
    };

    var registrationNotOk = function(app) {
        var regResult = new RegResult;
        regResult.success = false;
        regResult.message = app.message;
        continueWith && continueWith(null, regResult);
    };
    // event wiring
    self.on('application-received', validateInputs);
    self.on('validated', checkIfUserExists);
    self.on('user-does-not-exists', createUser);
    self.on('user-created', addLogEntry);
    self.on('log-created', registrationOk);

    self.on('invalid', registrationNotOk);

    return {
        applyForMembership: applyForMembership
    };
};

util.inherits(Registration, Emitter);
module.exports = Registration;