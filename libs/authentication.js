var events = require('events');
var util = require('util');
var assert = require('assert');
var bCrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Log = require('../models/log');

var AuthResult = function(credentials) {
    var result = {
        credentials: credentials,
        success: false,
        message: 'Invalid email or password',
        user: null,
        log: null
    };
    return result;
};

var Authentication = function (db, next) {
    var self = this;
    var continueWith = null;
    events.EventEmitter.call(this);

    var validateCredentials = function(authResult) {
        if (authResult.credentials.email && authResult.credentials.password) {
            self.emit('credentials-ok', authResult);
        } else {
            self.emit('invalid', authResult);
        }
    };

    var findUser = function(authResult) {
        db.users.first({email: authResult.credentials.email}, function(err, foundUser) {
            assert.ok(err === null, err);
            if (foundUser) {
                authResult.user = new User(foundUser);
                self.emit('user-found', authResult);
            } else {
                self.emit('invalid', authResult);
            }
        });
    };

    var comparePassword = function(authResult) {
        var matched = bCrypt.compareSync(authResult.credentials.password, authResult.user.hashedPassword);
        if (matched) {
            self.emit('password-accepted', authResult);
        } else {
            self.emit('invalid', authResult);
        }
    };

    var updateUserStats = function(authResult) {
        var user = authResult.user;
        user.signInCount += 1;
        user.lastLoginAt = user.currentLoginAt;
        user.currentLoginAt = new Date();

        // now save them
        var updates = {
            signInCount: user.signInCount,
            lastLoginAt: user.lastLoginAt,
            currentLoginAt: user.currentLoginAt
        };

        db.users.updateOnly(updates, user.id, function(err, updates) {
            assert.ok(err === null, err);
            self.emit('stats-updated', authResult);
        });
    };

    var createLog = function(authResult) {
        var log = new Log({
            subject: 'Authentication',
            userId: authResult.user.id,
            entry: 'Successfully logged in'
        });

        db.logs.save(log, function(err, newLog) {
            authResult.log = newLog;
            self.emit('log-created', authResult);
        });
    };

    var authOk = function(authResult) {
        authResult.success = true;
        authResult.message = 'Welcome!';
        self.emit('authenticated', authResult);
        self.emit('completed', authResult);
        continueWith && continueWith(null, authResult);
    };

    var authNotOk = function(authResult) {
        authResult.success = false;
        self.emit('not-authenticated', authResult);
        self.emit('completed', authResult);
        continueWith && continueWith(null, authResult);
    };

    // happy path
    self.on('login-received', validateCredentials);
    self.on('credentials-ok', findUser);
    self.on('user-found', comparePassword);
    self.on('password-accepted', updateUserStats);
    self.on('stats-updated', createLog);
    self.on('log-created', authOk);

    // sad path
    self.on('invalid', authNotOk);

    self.authenticate = function(credentials, next) {
        continueWith = next;
        var authResult = new AuthResult(credentials);
        self.emit('login-received', authResult);
    };
};

util.inherits(Authentication, events.EventEmitter);
module.exports = Authentication;