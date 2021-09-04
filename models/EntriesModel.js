const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Entry = new Schema({
    userID: {
        type: String
    },
    entryname: {
        type: String
    },
    isOut: {
        type: Boolean
    }
},
    { collection: "entries" }
);

module.exports = mongoose.model('entries', Entry);


