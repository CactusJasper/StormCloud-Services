let mongoose = require('mongoose');

let applicationSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    first_question: {
        type: String,
        required: true
    },
    second_question: {
        type: String,
        required: true
    },
    third_question: {
        type: String,
        required: true
    },
    fourth_question: {
        type: String,
        required: true
    },
    fith_question: {
        type: String,
        required: true
    },
    sixth_question: {
        type: String
    },
    seventh_question: {
        type: String
    },
    comments: [{
        user_id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Number,
            required: true
        }
    }],
    votes: [{
        user_id: {
            type: String,
            required: true
        },
        vote: {
            type: Boolean,
            required: true
        }
    }],
    status: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
});

let Application = module.exports = mongoose.model('Application', applicationSchema);