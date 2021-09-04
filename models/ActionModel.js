const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Action = new Schema({
    selectTeamNo: {
        type: Number
    },
    userID: {
        type: String,
        required: true
    },
    entryname: {
        type: String,
        required: true
    },
    weekNo: {
        type: Number,
        required: true
    },
    isOut: {
        type: Number,
        default: 0
    }


},
    { collection: "actions" }
);

module.exports = mongoose.model('actions', Action);


