let mongoose = require('mongoose');

let levelRewardSchema = mongoose.Schema({
    level: {
        type: Number,
        required: true
    },
    role_id: {
        type: String,
        required: true
    }
});

let LevelReward = module.exports = mongoose.model('LevelReward', levelRewardSchema);