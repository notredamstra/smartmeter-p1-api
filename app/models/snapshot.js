'use strict';

let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let snapshotSchema = new Schema({
    model_number: {type: String, required: true},
    model_id: {type: String, required: true},
    offpeak_consumption: {type: String, required: true},
    peak_consumption: {type: String, required: true},
    offpeak_redelivery: {type: String, required: true},
    peak_redelivery: {type: String, required: true},
    live_usage: {type: String, required: true},
    live_redelivery: {type: String, required: true},
    gas_consumption: {type: String, required: true},
    tst_reading: {type: String, required: true}
});

snapshotSchema.set('timestamps', true);

snapshotSchema.plugin(uniqueValidator);

let Snapshot = mongoose.model('Snapshot', snapshotSchema);

module.exports = Snapshot;
