let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        default: 'discord'
    },
    highest_role: {},
    event_manager: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    superuser: {
        type: Boolean,
        default: false
    },
    discordId: {
        type: String
    },
    theme: {
        type: String,
        default: 'dark'
    },
    discord: {}
});

let User = mongoose.model('User', userSchema);
module.exports = User;