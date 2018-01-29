'use strict';

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let path = require('path');

let config = require(path.join(__dirname, '/config/config'));

module.exports = function () {
    let uri = ''.concat('mongodb://', config.db.host, ':', config.db.port, '/', config.db.name);
    mongoose.connect(uri);
};
