let mongoose = require('mongoose');

let userDataSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    xp: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    last_rewarded: {
        type: Number,
        default: Math.floor(new Date().getTime() / 1000.0)
    }
});

let UserData = module.exports = mongoose.model('UserData', userDataSchema);