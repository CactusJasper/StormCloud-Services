let mongoose = require('mongoose');

let userGameDataSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    game2048: {
        highScore: {
            type: Number,
            default: 0
        },
        saveGame: {
            score: {
                type: Number,
            },
            width: {
                type: Number,
            },
            size: {
                type: Number,
            },
            cells: [{
                value: {
                    type: Number
                },
                x: {
                    type: Number,
                    required: true
                },
                y: {
                    type: Number,
                    required: true
                }
            }]
        }
    }
});

let UserGameData = mongoose.model('UserGameData', userGameDataSchema);

module.exports = UserGameData;