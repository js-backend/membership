var mongoose = require('mongoose');

var TestHelper = function () {

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

    var deleteAllUsers = function (done) {
        UserModel.remove({}, done)
    };

    return {
        connectDb: connectDb,
        deleteAllUsers: deleteAllUsers
    }
};

module.exports = new TestHelper;