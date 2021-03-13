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