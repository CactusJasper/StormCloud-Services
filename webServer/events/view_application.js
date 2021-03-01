let Application = require('../models/application');
let User = require('../models/user');
let utils = require('../utils');

module.exports = (socket, io) => {
    // Get the data for a Moderation Application
    socket.on('getApplication', (data) => {
        if(data.applicationId !== undefined)
        {
            User.findOne({ discordId: data.userId }, (err, usr) => {
                if(err)
                {
                    socket.emit(`applicationData`, {
                        status: 500,
                        message: 'Internal Server Error'
                    });
                }
                else
                {
                    if(usr)
                    {
                        let user = usr;
                        Application.findOne({ _id: data.applicationId }, (err, application) => {
                            if(err)
                            {
                                socket.emit(`applicationData`, {
                                    status: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            else
                            {
                                if(application)
                                {
                                    utils.isAdmin(user).then((admin) => {
                                        if(utils.isWolfy(user) /*|| utils.isJasper(user)*/)
                                        {
                                            socket.emit(`applicationData`, {
                                                status: 200,
                                                creator: false,
                                                admin: true,
                                                wolfy: true,
                                                application: application
                                            });
                                        }
                                        else if(admin || utils.isJasper(user))
                                        {
                                            socket.emit(`applicationData`, {
                                                status: 200,
                                                creator: false,
                                                admin: true,
                                                wolfy: false,
                                                application: application
                                            });
                                        }
                                        else if(application.user_id == user.discordId)
                                        {
                                            if(application.username !== user.username)
                                            {
                                                application.username = user.username;
                                                application.save((err, application) => {
                                                    if(err)
                                                    {
                                                        console.error(err);
                                                        socket.emit(`applicationData`, {
                                                            status: 500,
                                                            message: 'Internal Server Error'
                                                        });
                                                    }
                                                    else
                                                    {
                                                        socket.emit(`applicationData`, {
                                                            status: 200,
                                                            creator: true,
                                                            admin: false,
                                                            wolfy: false,
                                                            application: application
                                                        });
                                                    }
                                                });
                                            }
                                            else
                                            {
                                                socket.emit(`applicationData`, {
                                                    status: 200,
                                                    creator: true,
                                                    admin: false,
                                                    wolfy: false,
                                                    application: application
                                                });
                                            }
                                        }
                                        else
                                        {
                                            socket.emit(`applicationData`, {
                                                status: 900,
                                                message: 'Unauthorised'
                                            });
                                        }
                                    }).catch((err) => {
                                        console.error(err);
                                        socket.emit(`applicationData`, {
                                            status: 500,
                                            message: 'Internal Server Error'
                                        });
                                    });
                                }
                                else
                                {
                                    socket.emit(`applicationData`, {
                                        status: 900,
                                        message: 'Invalid Application ID'
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        socket.emit(`applicationData`, {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
            });
        }
        else
        {
            socket.emit(`applicationData`, {
                status: 900,
                message: 'No Application ID Provided'
            });
        }
    });

    // Approve Vote
    socket.on('approveVote', (data) => {
        if(data.applicationId !== undefined)
        {
            User.findOne({ discordId: data.user_id }, (err, usr) => {
                if(err)
                {
                    console.error(err);
                    socket.emit(`approveVoteRes`, {
                        status: 500,
                        message: 'Internal Server Error'
                    });
                }
                else
                {
                    if(usr)
                    {
                        let user = usr;
                        Application.findOne({ _id: data.applicationId }, (err, application) => {
                            if(err)
                            {
                                console.error(err);
                                socket.emit(`approveVoteRes`, {
                                    status: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            else
                            {
                                if(application)
                                {
                                    if(application.status == 0)
                                    {
                                        utils.isAdmin(user).then((admin) => {
                                            if(admin || utils.isJasper(user))
                                            {
                                                let hasVoted = false;

                                                for(let i = 0; i < application.votes.length; i++)
                                                {
                                                    if(application.votes[i].user_id == user.discordId)
                                                    {
                                                        hasVoted = true;
                                                    }
                                                }

                                                if(hasVoted)
                                                {
                                                    socket.emit(`approveVoteRes`, {
                                                        status: 200,
                                                        message: 'Already Voted',
                                                        application: application
                                                    });
                                                }
                                                else
                                                {
                                                    application.votes.push({
                                                        user_id: user.discordId,
                                                        vote: true
                                                    });

                                                    application.markModified('votes');
                                                    application.save((err, application) => {
                                                        if(err)
                                                        {
                                                            console.error(err);
                                                            socket.emit(`approveVoteRes`, {
                                                                status: 500,
                                                                message: 'Internal Server Error'
                                                            });
                                                        }
                                                        else
                                                        {
                                                            socket.emit(`approveVoteRes`, {
                                                                status: 200,
                                                                message: 'Voted Registered',
                                                                application: application
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                            else
                                            {
                                                socket.emit(`approveVoteRes`, {
                                                    status: 900,
                                                    message: 'Unauthorised'
                                                });
                                            }
                                        }).catch((err) => {
                                            console.error(err);
                                            socket.emit(`approveVoteRes`, {
                                                status: 500,
                                                message: 'Internal Server Error'
                                            });
                                        });
                                    }
                                    else
                                    {
                                        socket.emit(`approveVoteRes`, {
                                            status: 900,
                                            message: 'Voting Ended'
                                        });
                                    }
                                }
                                else
                                {
                                    socket.emit(`approveVoteRes`, {
                                        status: 900,
                                        message: 'Invalid Application ID'
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        socket.emit(`approveVoteRes`, {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
            });
        }
        else
        {
            socket.emit(`approveVoteRes`, {
                status: 900,
                message: 'No Application ID Provided'
            });
        }
    });

    // Disapprove Vote
    socket.on('disapproveVote', (data) => {
        if(data.applicationId !== undefined)
        {
            User.findOne({ discordId: data.user_id }, (err, usr) => {
                if(err)
                {
                    console.error(err);
                    socket.emit(`disapproveVoteRes`, {
                        status: 500,
                        message: 'Internal Server Error'
                    });
                }
                else
                {
                    if(usr)
                    {
                        let user = usr;
                        Application.findOne({ _id: data.applicationId }, (err, application) => {
                            if(err)
                            {
                                console.error(err);
                                socket.emit(`disapproveVoteRes`, {
                                    status: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            else
                            {
                                if(application)
                                {
                                    if(application.status == 0)
                                    {
                                        utils.isAdmin(user).then((admin) => {
                                            if(admin || utils.isJasper(user))
                                            {
                                                let hasVoted = false;

                                                for(let i = 0; i < application.votes.length; i++)
                                                {
                                                    if(application.votes[i].user_id == user.discordId)
                                                    {
                                                        hasVoted = true;
                                                    }
                                                }

                                                if(hasVoted)
                                                {
                                                    socket.emit(`disapproveVoteRes`, {
                                                        status: 200,
                                                        message: 'Already Voted',
                                                        application: application
                                                    });
                                                }
                                                else
                                                {
                                                    application.votes.push({
                                                        user_id: user.discordId,
                                                        vote: false
                                                    });

                                                    application.markModified('votes');
                                                    application.save((err, application) => {
                                                        if(err)
                                                        {
                                                            console.error(err);
                                                            socket.emit(`disapproveVoteRes`, {
                                                                status: 500,
                                                                message: 'Internal Server Error'
                                                            });
                                                        }
                                                        else
                                                        {
                                                            socket.emit(`disapproveVoteRes`, {
                                                                status: 200,
                                                                message: 'Voted Registered',
                                                                application: application
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                            else
                                            {
                                                socket.emit(`disapproveVoteRes`, {
                                                    status: 900,
                                                    message: 'Unauthorised'
                                                });
                                            }
                                        }).catch((err) => {
                                            console.error(err);
                                            socket.emit(`disapproveVoteRes`, {
                                                status: 500,
                                                message: 'Internal Server Error'
                                            });
                                        });
                                    }
                                    else
                                    {
                                        socket.emit(`disapproveVoteRes`, {
                                            status: 900,
                                            message: 'Voting Ended'
                                        });
                                    }
                                }
                                else
                                {
                                    socket.emit(`disapproveVoteRes`, {
                                        status: 900,
                                        message: 'Invalid Application ID'
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        socket.emit(`disapproveVoteRes`, {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
            });
        }
        else
        {
            socket.emit(`disapproveVoteRes`, {
                status: 900,
                message: 'No Application ID Provided'
            });
        }
    });
};