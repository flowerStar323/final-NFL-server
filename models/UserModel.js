const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let User = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    countANDpay: [
        {
            count: {
                type: Number
            },
            pay: {
                type: Number
            }
        }
    ],
    status: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: "user"
    }


},
    { collection: "users" }
);

module.exports = mongoose.model('users', User);


