let mongoose = require('mongoose');

let statSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    history: [{
        epoch_time: {
            type: Number,
            required: true
        },
        stat: {
            type: Number,
            required: true
        }
    }]
});

let Stat = module.exports = mongoose.model('Stat', statSchema);