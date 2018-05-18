const mongoose = require('mongoose');

var connStr = 'mongodb://localhost:27017/mongoose-bcrypt-test';

var connectDB = (callback) => {
    mongoose.connect(connStr, function(err) {
        if (err) throw err;
        callback();
})};

module.exports = {
    connectDB
};