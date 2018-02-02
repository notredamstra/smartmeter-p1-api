'use strict';

let mongoose = require('mongoose');
let Snapshot = mongoose.model('Snapshot');
let moment = require('moment');

let PATH = '/v1/snapshots';

module.exports = function (server) {
    server.post({path: PATH}, createDocuments);
    server.get({path: PATH}, getDocuments);

    function createDocuments(req, res, next) {
        let snapshots = req.body.items.map(function (item) {
            return new Snapshot({
                meter_model: item.meter_model,
                meter_id: item.meter_id,
                offpeak_consumption: item.offpeak_consumption,
                peak_consumption: item.peak_consumption,
                offpeak_redelivery: item.offpeak_redelivery,
                peak_redelivery: item.peak_redelivery,
                live_usage: item.live_usage,
                live_redelivery: item.live_redelivery,
                gas_consumption: item.gas_consumption,
                tst_reading_electricity: moment(item.tst_reading_electricity, "YYMMDDHHmmss").valueOf(),
                tst_reading_gas: moment(item.tst_reading_gas, "YYMMDDHHmmss").valueOf()
            });
        });

        Snapshot.insertMany(snapshots)
            .then(function (entry) {
                res.send(201, {items: entry});
            })
            .catch(function (error) {
                if (error) {
                    console.log(error);
                    res.send(error);
                }
            });
    }

    function getDocuments(req, res, next) {
        res.set("Content-Type", "application/json");

        // get data every 60 seconds instead of 1
        let stream = Snapshot.aggregate([
            {
                $match: {
                    "tst_reading_electricity": {
                        $mod: [60000, 0]
                    }
                }
            },
            {
                $group: {
                    _id: "$tst_reading_electricity",
                    offpeak_consumption: {$first: "$offpeak_consumption"},
                    peak_consumption: {$first: "$peak_consumption"},
                    offpeak_redelivery: {$first: "$offpeak_redelivery"},
                    peak_redelivery: {$first: "$peak_redelivery"},
                    live_usage: {$first: "$live_usage"},
                    live_redelivery: {$first: "$live_redelivery"},
                    gas_consumption: {$first: "$gas_consumption"},
                    tst_reading_electricity: {$first: "$tst_reading_electricity"},
                    tst_reading_gas: {$first: "$tst_reading_gas"},
                }
            },
            {
                $project: {
                    _id: 0,
                    offpeak_consumption: 1,
                    peak_consumption: 1,
                    offpeak_redelivery: 1,
                    peak_redelivery: 1,
                    live_usage: 1,
                    live_redelivery: 1,
                    gas_consumption: 1,
                    tst_reading_electricity: 1,
                    tst_reading_gas: 1
                }
            },
            {
                $sort: {
                    "tst_reading_electricity": -1
                }
            }
        ]).cursor({batchSize: 100}).exec().stream();

        stream.on('data', function (item) {
            res.write(JSON.stringify(item));
        });

        stream.on('end', function () {
            res.end();
        })


        // return Snapshot.aggregate([
        //     {
        //         $match: {
        //             "tst_reading_electricity": {
        //                 $mod: [15, 0]
        //             }
        //         }
        //     }
        // ], function (err, result) {
        //     if (err) {
        //         next(err);
        //     }
        //     else {
        //         res.send(200, {items: result});
        //     }
        // });
        //
        // return Snapshot.find({}, {_id: 0, updatedAt: 0, createdAt: 0, __v: 0}, function (err, snapshots) {
        //     res.send(200, {items: snapshots});
        // });
    }
};
