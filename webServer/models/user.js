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
    discordId: {
        type: String
    },
    theme: {
        type: String,
        default: 'dark'
    },
    discord: {}
});

let User = module.exports = mongoose.model('User', userSchema);