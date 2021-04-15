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
    }]
});

module.exports = rpgItemSchema;