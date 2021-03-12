let User = require('../models/user');
let Poll = require('../models/poll');
let utils = require('../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    socket.on('getPoll', (data) => {
        if(data.pollId !== undefined)
        {
            Poll.findOne({ _id: data.pollId }, (err, poll) => {
                if(err)
                {
                    console.error(err);
                    socket.emit('getPollCb', {
                        status: 500
                    });
                }
                else
                {
                    if(poll)
                    {
                        if(poll.state != 0)
                        {
                            socket.emit('getPollCb', {
                                status: 200,
                                poll: poll,
                                currentUser: userId
                            });
                        }
                        else
                        {
                            socket.emit('getPollCb', {
                                status: 900,
                                message: 'Unauthorised'
                            });
                        }
                    }
                    else
                    {
                        socket.emit('getPollCb', {
                            status: 900,
                            message: 'Invalid Poll Id'
                        });
                    }
                }
            });
        }
        else
        {
            socket.emit('getPollCb', {
                status: 900,
                message: 'Invalid Poll Id'
            });
        }
    });

    socket.on('castVote', (data) => {
        if(data.pollId !== undefined)
        {
            if(data.option !== undefined)
            {
                Poll.findOne({ _id: data.pollId }, (err, poll) => {
                    if(err)
                    {
                        socket.emit('castVoteCb', {
                            status: 500
                        });
                    }
                    else
                    {
                        if(poll)
                        {
                            if(Number(data.option) > 0 && Number(data.option) <= poll.options.length)
                            {
                                let vote = {
                                    user_id: userId,
                                    option: data.option
                                };

                                let hasVoted = false;

                                if(poll.votes.length > 0)
                                {
                                    for(let i = 0; i < poll.votes.length; i++)
                                    {
                                        if(poll.votes[i].user_id == userId)
                                        {
                                            hasVoted = true;
                                            return;
                                        }
                                    }
                                }

                                if(hasVoted == false)
                                {
                                    poll.votes.push(vote);
                                    poll.markModified('votes');

                                    poll.save((err, poll) => {
                                        if(err)
                                        {
                                            socket.emit('castVoteCb', {
                                                status: 500
                                            });
                                        }
                                        else
                                        {
                                            io.emit(`voteCast:${poll._id}`, {
                                                poll: poll
                                            });
                                            socket.emit(`castVoteCb`, {
                                                status: 200,
                                                poll: poll
                                            });
                                        }
                                    });
                                }
                                else
                                {
                                    socket.emit('castVoteCb', {
                                        status: 900,
                                        message: 'Already voted'
                                    });
                                }
                            }
                            else
                            {
                                socket.emit('castVoteCb', {
                                    status: 900,
                                    message: 'Invalid Vote Option'
                                });
                            }
                        }
                        else
                        {
                            socket.emit('castVoteCb', {
                                status: 900,
                                message: 'Invalid Poll Id'
                            });
                        }
                    }
                });
            }
            else
            {
                socket.emit('castVoteCb', {
                    status: 900,
                    message: 'No Vote Option'
                });
            }
        }
        else
        {
            socket.emit('castVoteCb', {
                status: 900,
                message: 'Invalid Poll Id'
            });
        }
    });

    socket.on('getPollData', (data) => {
        if(data.pollId !== undefined)
        {
            Poll.findOne({ _id: data.pollId }, (err, poll) => {
                if(err)
                {
                    socket.emit('getPollDataCb', {
                        status: 500
                    });
                }
                else
                {
                    if(poll)
                    {
                        socket.emit('getPollDataCb', {
                            status: 200,
                            poll: poll
                        });
                    }
                    else
                    {
                        socket.emit('getPollDataCb', {
                            status: 900,
                            message: 'Invalid Poll Id'
                        });
                    }
                }
            });
        }
        else
        {
            socket.emit('getPollDataCb', {
                status: 900,
                message: 'Invalid Poll Id'
            });
        }
    });
}