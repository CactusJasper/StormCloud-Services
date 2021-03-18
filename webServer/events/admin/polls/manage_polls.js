let User = require('../../../models/user');
let Poll = require('../../../models/poll');
let utils = require('../../../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    socket.on('getManagePollsList', (data) => {
        User.findOne({ _id: userId }, (err, user) => {
            if(err)
            {
                socket.emit('managePollsList', {
                    status: 500
                });
            }
            else
            {
                if(user)
                {
                    if(utils.isWolfy(user) || utils.isJasper(user))
                    {
                        Poll.find({}, (err, polls) => {
                            if(err)
                            {
                                socket.emit('managePollsList', {
                                    status: 500
                                });
                            }
                            else
                            {
                                if(polls.length > 0)
                                {
                                    socket.emit('managePollsList', {
                                        status: 200,
                                        polls: polls
                                    });
                                }
                                else
                                {
                                    socket.emit('managePollsList', {
                                        status: 900,
                                        message: 'No Polls'
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        socket.emit('managePollsList', {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
                else
                {
                    socket.emit('managePollsList', {
                        status: 900,
                        message: 'Unauthorised'
                    });
                }
            }
        });
    });
}