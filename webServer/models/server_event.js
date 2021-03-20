let mongoose = require('mongoose');

let serverEventSchema = mongoose.Schema({
    hostId: {
        type: String,
        required: true
    },
    eventTitle: {
        type: String,
        required: true
    },
    eventDesc: {
        type: String,
        required: true
    },
    voiceCall: {
        type: String,
        required: true
    },
    game: {
        type: String
    },
    eventTime: {
        type: Number,
        required: true
    },
    createAt: {
        type: Number,
        default: Math.floor(new Date().getTime() / 1000.0)
    },
    approved: {
        type: Boolean,
        default: false
    }
});

let ServerEvent = mongoose.model('ServerEvent', serverEventSchema);

module.exports = ServerEvent;

/* Example Server Event

{
    hostId: '217387293571284992',
    eventTitle: 'A Test Event',
    eventDesc: 'This is a simple event that tests the capability of the event system',
    voiceCall: 'General 1',
    game: 'Minecraft',
    eventTime: 1616049999,
    createdAt: 1616040591,
    approved: false
}

*/