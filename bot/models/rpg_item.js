let mongoose = require('mongoose');

let rpgItemSchema = mongoose.Schema({
    item_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});