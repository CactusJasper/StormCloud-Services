let mongoose = require('mongoose');
let RPGItem = require('./rpg_item');

let rpgDataSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    money: {
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
    }],
    inventory_size: {
        type: Number,
        default: 9
    },
    inventory: [RPGItem]
});

let RPGData = mongoose.model('RpgData', rpgDataSchema);
module.exports = RPGData;

/*
SKILL ID'S:
> Mining = 1
> Woodcutting = 2
*/