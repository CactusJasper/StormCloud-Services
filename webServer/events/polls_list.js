let Poll = require('../models/poll');
let User = require('../models/user');
let utils = require('../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    socket.on('getPollList', (data) => {
        let pollList = []

        Poll.schema.statics.findByState(1, (err, polls) => {
            if(!err)
            {
                if(polls.length > 0)
                {
                    for(let i = 0; i < polls.length; i++)
                    {
                        pollList.push(polls[i]);
                    }
                }

                Poll.schema.statics.findByState(2, (err, polls) => {
                    if(!err)
                    {
                        if(polls.length > 0)
                        {
                            for(let i = 0; i < polls.length; i++)
                            {
                                pollList.push(polls[i]);
                            }
                        }

                        if(pollList.length > 0)
                        {
                            pollList.sort((a, b) => {
                                return b.created_timestamp - a.created_timestamp;
                            });

                            socket.emit('getPollListCb', {
                                status: 200,
                                polls: pollList
                            });
                        }
                        else
                        {
                            socket.emit('getPollListCb', {
                                status: 900,
                                message: 'No Polls'
                            });
                        }
                    }
                });
            }
        });
    });
}