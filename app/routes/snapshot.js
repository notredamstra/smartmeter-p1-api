'use strict';

let mongoose = require('mongoose');
let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));
let Snapshot = mongoose.model('Snapshot');

let PATH = '/snapshots';
let VERSION = '1.0.0';

module.exports = function (server) {
    server.post({path: PATH, version: VERSION}, createDocument);

    function createDocument(req, res, next) {
        let snapshot = new Snapshot({
            model_number: req.body.model_number,
            model_id: req.body.model_id,
            offpeak_consumption: req.body.offpeak_consumption,
            peak_consumption: req.body.peak_consumption,
            offpeak_redelivery: req.body.offpeak_redelivery,
            peak_redelivery: req.body.peak_redelivery,
            live_usage: req.body.live_usage,
            live_redelivery: req.body.live_redelivery,
            gas_consumption: req.body.gas_consumption,
            tst_reading: req.body.tst_reading
        });

        snapshot.save(function (error, snapshot, numAffected) {
            if (error) {
                return next(error);
            } else {
                res.send(201);
                return next();
            }
        });
    }
};
