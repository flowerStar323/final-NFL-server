const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Teamname = new Schema({
  No: {
    type: Number,
    required: true,
  },
  Teamname: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  }
},
  { collection: "teamnames" }
);

module.exports = mongoose.model('teamnames', Teamname);


