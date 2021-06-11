let User = require('../../../models/user');
let Poll = require('../../../models/poll');
let utils = require('../../../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    socket.on('getNeedApproval', (data) => {
        User.findOne({ _id: userId }, (err, user) => {
            if(err)
            {
                socket.emit('needApprovalList', {
                    status: 500
                });
            }
            else
            {
                if(user)
                {
                    if(utils.isSuperuser(user))
                    {
                        Poll.schema.statics.findByState(0, (err, polls) => {
                            if(err)
                            {
                                socket.emit('needApprovalList', {
                                    status: 500
                                });
                            }
                            else
                            {
                                if(polls.length > 0)
                                {
                                    socket.emit('needApprovalList', {
                                        status: 200,
                                        polls: polls
                                    });
                                }
                                else
                                {
                                    socket.emit('needApprovalList', {
                                        status: 900,
                                        message: 'No Polls'
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        socket.emit('needApprovalList', {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
                else
                {
                    socket.emit('needApprovalList', {
                        status: 900,
                        message: 'Unauthorised'
                    });
                }
            }
        });
    });
}