let mongoose = require('mongoose');

let customRoleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    permissions: [String]
});

let CustomRole = mongoose.model('CustomRole', customRoleSchema);
module.exports = CustomRole;
