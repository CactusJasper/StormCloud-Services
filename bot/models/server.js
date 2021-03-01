let mongoose = require('mongoose');

let serverSchema = mongoose.Schema({
    server_name: {
        type: String,
        required: true
    },
    api_id: {
        type: String,
        required: true
    },
    api_token: {
        type: String,
        required: true
    },
});

let Server = module.exports = mongoose.model('Server', serverSchema);