let mongoose = require('mongoose');

let rpgItemSchema = mongoose.Schema({
    item_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    stats: [{
        stat_id: {
            type: Number,
            required: true
        },
        stat_name: {
            type: String,
            required: true
        },
        effect_on_stat: {
            type: Number,
            default: 1
        },
        debuf: {
            type: Boolean,
            default: false
        }
    }],
    buy_price: {
        type: Number,
        default: 0
    },
    sell_price: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
    min_skill: {
        skill_id: {
            type: Number
        },
        min_level: {
            type: Number
        }
    },
    xp_reward: {
        min_reward: {
            type: Number
        },
        max_reward: {
            type: Number
        }
    }
});

module.exports = rpgItemSchema;