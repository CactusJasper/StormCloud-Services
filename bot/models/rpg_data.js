let mongoose = require('mongoose');

let rpgDataSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    coins: {
        type: Number,
        default: 0
    },
    skills: [{
        skill_id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            default: 0
        },
        max_level: {
            type: Number,
            required: true
        },
        xp: {
            type: Number,
            default: 0
        }
    }]
});

let RPGData = mongoose.model('RpgData', rpgDataSchema);
module.exports = RPGData;