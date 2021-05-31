let User = require('../../../models/user');
let ServerEvent = require('../../../models/server_event');
let utils = require('../../../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;
    let perPage = 20;

    socket.on('getEvents', (data) => {
        User.find({ _id: userId }, (err, user) => {
            if(err)
            {
                socket.emit('getEventsCb', {
                    status: 500,
                    message: 'Internal Server Error'
                });
            }
            else
            {
                if(user)
                {
                    if(data.getMaxPages == true)
                    {
                        ServerEvent.find({}, (err, events) => {
                            if(err)
                            {
                                socket.emit('getEventsCb', {
                                    status: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            else
                            {
                                if(events.length > 0)
                                {
                                    socket.emit('getEventsCb', {
                                        status: 200,
                                        message: 'MaxPages',
                                        maxPages: Math.ceil(events.length / perPage)
                                    });
                                }
                                else
                                {
                                    socket.emit('getEventsCb', {
                                        status: 900,
                                        message: 'No Events'
                                    });
                                }
                            }
                        });
                    }
                    else if(data.page > 0 && typeof data.page !== "undefined")
                    {
                        ServerEvent.find({}).skip((perPage * data.page) - perPage).limit(perPage).exec((err, events) => {
                            if(err)
                            {
                                socket.emit('getEventsCb', {
                                    status: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            else
                            {
                                if(events.length > 0)
                                {
                                    socket.emit('getEventsCb', {
                                        status: 200,
                                        message: 'Pagination',
                                        pageNum: data.page,
                                        events: events
                                    });
                                }
                                else
                                {
                                    socket.emit('getEventsCb', {
                                        status: 900,
                                        message: 'No Events'
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        ServerEvent.find({}, (err, events) => {
                            if(err)
                            {
                                socket.emit('getEventsCb', {
                                    status: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            else
                            {
                                if(events.length > 0)
                                {
                                    socket.emit('getEventsCb', {
                                        status: 200,
                                        message: 'All Events',
                                        events: events
                                    });
                                }
                                else
                                {
                                    socket.emit('getEventsCb', {
                                        status: 900,
                                        message: 'No Events'
                                    });
                                }
                            }
                        });
                    }
                }
                else
                {
                    socket.emit('getEventsCb', {
                        status: 900,
                        message: 'Unauthorised'
                    });
                }
            }
        });
    });
}