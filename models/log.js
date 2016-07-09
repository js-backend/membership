var assert = require('assert');
var LogModel = require('../schemas/log');

var Log = function(args) {
    assert.ok(args.subject && args.entry && args.userId, 'Need subject, entry and userId');
    var log = new LogModel({});
    log.subject = args.subject;
    log.entry = args.entry;
    log.createdAt = new Date();
    log.userId = args.userId;

    return log;
};

module.exports = Log;