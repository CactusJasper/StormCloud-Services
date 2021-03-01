let mongoose = require('mongoose');

let modRoleSchema = mongoose.Schema({
    level: {
        type: String,
        required: true
    },
    role_id: {
        type: String,
        required: true
    }
});

let ModRole = module.exports = mongoose.model('ModRole', modRoleSchema);