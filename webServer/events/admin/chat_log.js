let ChatLog = require('../../models/chat_log');
let axios = require('axios');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    socket.on('getChannels', (data) => {

    });

    socket.on('getChannelMessages', (data) => {

    });
}