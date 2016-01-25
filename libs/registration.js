var User = require('../models/user');
var Application = require('../models/application');
var mongoose = require('mongoose');
var assert = require('assert');
var UserModel = require('../models/userModel');

var RegResult = function() {
    var result = {
        success: false,
        message: null,
        user: null
    };
    return result;
};

var Registration  = function(db) {

    var validateInputs = function(app) {
        if (!app.email || !app.password) {
            app.setInvalid('Email and password are required');
        } else if(app.password !== app.confirm) {
            console.log('val  - ' + app.email  + ' ' + app.password);
            app.setInvalid('Passwords do not match');
        } else {
            app.validate();
        }
    };

    var checkIfUserExists = function(app, next) {
        UserModel.findOne({email: app.email}, function(err, user) {
            if (err)
                next(err, null);
            next(null, user !== null);
        });
    };

// var args = {email: 'email@mail.com', password: 'password'}
    var applyForMembership = function(args, next) {
        var regResult = new RegResult;
        var app = new Application(args);

        // validate inputs
        validateInputs(app);

        // check to see if email exists
        checkIfUserExists(app, function(err, exists) {
            console.log(exists);
            assert.ok(err === null, err);
            if (!exists) {
                // create a new user
                // hash a password
                // create log entry
                regResult.success = true;
                regResult.message = 'Welcome!';

                regResult.user = new User(args);
            }
            next(null, regResult);
        });

    };

    return {
        applyForMembership: applyForMembership
    };
};

module.exports = Registration;