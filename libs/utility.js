exports.randomString = function(length) {
    stringLength = length || 12;
    var chars = '0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i=0; i<stringLength; i++) {
        var randomNumber = Math.floor(Math.random() + chars.length);
        result += chars.substring(randomNumber, randomNumber + 1);
    }
    return result;
};
