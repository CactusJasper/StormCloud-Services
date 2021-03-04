let UserData = require('../models/user_data');
let User = require('../models/user');
let utils = require('../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport;

    // Get the leaderboard
    socket.on('getLeaderboard', (data) => {
        UserData.find({}, (err, docs) => {
            if(err)
            {
                console.error(err);
                socket.emit('', {
                    status: 500,
                    message: 'Internal Server Error'
                });
            }
            else
            {
                if(docs.length > 0)
                {
                    socket.emit('leaderboardData', {
                        status: 200,
                        data: docs
                    });
                }
                else
                {
                    socket.emit('leaderboardData', {
                        status: 200,
                        message: 'No Leaderboard Data'
                    });
                }
            }
        });
    });
}