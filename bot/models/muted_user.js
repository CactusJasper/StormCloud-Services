let mongoose = require('mongoose');

let mutedUserSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    }
});

let MutedUser = mongoose.model('MutedUser', mutedUserSchema);
module.exports = MutedUser;