let User = require('../../models/user');
let ServerEvent = require('../../models/server_event');
let moment = require('moment');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    socket.on('getPlannerEvents', (data) => {
        ServerEvent.find({ approved: true}, (err, events) => {
            if(err)
            {
                socket.emit('getPlannerEventsCb', {
                    status: 500,
                    message: 'Internal Server Error'
                });
            }
            else
            {
                if(events.length > 0)
                {
                    socket.emit('getPlannerEventsCb', {
                        status: 200,
                        events: events
                    });
                }
                else
                {
                    socket.emit('getPlannerEventsCb', {
                        status: 900,
                        message: 'No Events'
                    });
                }
            }
        });
    });

    socket.on('getEventData', (data) => {
        if(typeof data.eventId !== "undefined")
        {
            ServerEvent.findOne({ _id: data.eventId }, (err, event) => {
                if(err)
                {
                    socket.emit('getEventDataCb', {
                        status: 500,
                        message: 'Internal Server Error'
                    });
                }
                else
                {
                    if(event)
                    {
                        socket.emit('getEventDataCb', {
                            status: 200,
                            event: event
                        });
                    }
                    else
                    {
                        socket.emit('getEventDataCb', {
                            status: 900,
                            message: 'No Event'
                        });
                    }
                }
            });
        }
        else
        {
            socket.emit('getEventDataCb', {
                status: 900,
                message: 'No Event'
            });
        }
    });
}