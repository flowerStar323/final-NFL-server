const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Mat = new Schema({
  weekNum: {
    type: Number,
    default: 1
  },
  matches: [
    {
      first: {
        type: Number,
        default: 0
      },
      sec: {
        type: Number,
        default: 0
      },
      flag: {
        type: Number,
        default: 0
      }
    }
  ],
  isLocked: {
    type: Boolean,
    default: false
  },
  isOverflow: {
    type: Boolean,
    default: false
  }
},
  { collection: "matches" }
);

module.exports = mongoose.model('matches', Mat);


