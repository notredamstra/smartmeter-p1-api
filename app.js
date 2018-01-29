'use strict';

let restify = require('restify');
let path = require('path');

let config = require(path.join(__dirname, '/config/config'));
let models = require(path.join(__dirname, '/app/models/'));
let routes = require(path.join(__dirname, '/app/routes/'));
let dbConnection = require(path.join(__dirname, '/db-connection'));

dbConnection();

let server = restify.createServer({
    name: config.app.name
});

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
server.pre(restify.pre.sanitizePath());
server.use(
    function crossOrigin(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        return next();
    }
);

server.on('uncaughtException', function (req, res, route, err) {
    if (!res.headersSent) {
        return res.send(500, {ok: false});
    }
    res.write('\n');
    res.end();
});

models();
routes(server);

server.get('/', function (req, res, next) {
    res.send(config.app.name);
    return next();
});

server.listen(config.app.port, function () {
    console.log("Application listening on " + config.app.address + ":" + config.app.port);
});
