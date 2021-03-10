let User = require('../../../models/user');
let Poll = require('../../../models/poll');
let utils = require('../../../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;
}