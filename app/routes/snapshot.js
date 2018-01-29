'use strict';

let mongoose = require('mongoose');
let Snapshot = mongoose.model('Snapshot');

let PATH = '/snapshots';

module.exports = function (server) {
    server.post({path: PATH}, createDocuments);

    function createDocuments(req, res, next) {
        let snapshots = req.body.items.map(function (item) {
            return new Snapshot({
                model_number: item.model_number,
                model_id: item.model_id,
                offpeak_consumption: item.offpeak_consumption,
                peak_consumption: item.peak_consumption,
                offpeak_redelivery: item.offpeak_redelivery,
                peak_redelivery: item.peak_redelivery,
                live_usage: item.live_usage,
                live_redelivery: item.live_redelivery,
                gas_consumption: item.gas_consumption,
                tst_reading: item.tst_reading
            });
        });

        snapshots.insertMany(snapshots)
            .then(function (entry) {
                res.status(201).json(entry);
            })
            .catch(function (error) {
                if (error) {
                    res.status(500).json(error);
                }
            });
    }
};
