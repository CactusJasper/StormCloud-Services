let User = require('../../../models/user');
let ServerEvent = require('../../../models/server_event');
let utils = require('../../../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    socket.on('approveEvent', (data) => {
        User.findOne({ _id: userId }, (err, user) => {
            if(err)
            {
                socket.emit('approveEventCb', {
                    status: 500,
                    message: 'Internal Server Error'
                });
            }
            else
            {
                if(user)
                {
                    if(utils.isSuperuser(user) || utils.isEventManager(user))
                    {
                        ServerEvent.findOne({ _id: data.eventId }, (err, event) => {
                            if(err)
                            {
                                socket.emit('approveEventCb', {
                                    status: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            else
                            {
                                if(event)
                                {
                                    event.approved = true;
                                    event.markModified('approved');

                                    event.save((err) => {
                                        if(err)
                                        {
                                            socket.emit('approveEventCb', {
                                                status: 500,
                                                message: 'Internal Server Error'
                                            });
                                        }
                                        else
                                        {
                                            socket.emit('approveEventCb', {
                                                status: 200,
                                            });
                                        }
                                    });
                                }
                                else
                                {
                                    socket.emit('approveEventCb', {
                                        status: 900,
                                        message: 'No Event'
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        socket.emit('approveEventCb', {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
                else
                {
                    socket.emit('approveEventCb', {
                        status: 900,
                        message: 'Unauthorised'
                    });
                }
            }
        });
    });

    socket.on('disapproveEvent', (data) => {
        User.findOne({ _id: userId }, (err, user) => {
            if(err)
            {
                socket.emit('disapproveEventCb', {
                    status: 500,
                    message: 'Internal Server Error'
                });
            }
            else
            {
                if(user)
                {
                    if(utils.isSuperuser(user) || utils.isEventManager(user))
                    {
                        ServerEvent.deleteOne({ _id: data.eventId }, (err) => {
                            if(err)
                            {
                                socket.emit('disapproveEventCb', {
                                    status: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            else
                            {
                                socket.emit('disapproveEventCb', {
                                    status: 200
                                });
                            }
                        });
                    }
                    else
                    {
                        socket.emit('disapproveEventCb', {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
                else
                {
                    socket.emit('disapproveEventCb', {
                        status: 900,
                        message: 'Unauthorised'
                    });
                }
            }
        });
    });
}