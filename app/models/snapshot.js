'use strict';

let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let snapshotSchema = new Schema({
    meter_model: {type: String, required: true},
    meter_id: {type: String, required: true},
    offpeak_consumption: {type: Number, required: true},
    peak_consumption: {type: Number, required: true},
    offpeak_redelivery: {type: Number, required: true},
    peak_redelivery: {type: Number, required: true},
    live_usage: {type: Number, required: true},
    live_redelivery: {type: Number, required: true},
    gas_consumption: {type: Number, required: true},
    tst_reading_electricity: {type: Number, required: true},
    tst_reading_gas: {type: Number, required: true}
});

snapshotSchema.set('timestamps', true);

snapshotSchema.plugin(uniqueValidator);

let Snapshot = mongoose.model('Snapshot', snapshotSchema);

module.exports = Snapshot;
