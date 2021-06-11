let mongoose = require('mongoose');

let chatLogSchema = mongoose.Schema({
    channelId: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    },
    chatMessage: {
        type: String
    },
    authorId: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    attachments: []
});

let ChatLog = mongoose.model('ChatLog', chatLogSchema);
module.exports = ChatLog;