let Application = require('../models/application');
let User = require('../models/user');
let Server = require('../models/server');
let utils = require('../utils');
let axios = require('axios');

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
    socket.on('vote', (data) => {
        if(data.applicationId !== undefined)
        {
            User.findOne({ discordId: data.userId }, (err, usr) => {
                if(err)
                {
                    console.error(err);
                    socket.emit(`voteRes`, {
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
                                socket.emit(`voteRes`, {
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
                                                    socket.emit(`voteRes`, {
                                                        status: 200,
                                                        message: 'Already Voted',
                                                        application: application
                                                    });
                                                }
                                                else
                                                {
                                                    if(data.vote == true)
                                                    {
                                                        application.votes.push({
                                                            user_id: user.discordId,
                                                            vote: true
                                                        });
                                                    }
                                                    else
                                                    {
                                                        application.votes.push({
                                                            user_id: user.discordId,
                                                            vote: false
                                                        });
                                                    }

                                                    application.markModified('votes');
                                                    application.save((err, application) => {
                                                        if(err)
                                                        {
                                                            console.error(err);
                                                            socket.emit(`voteRes`, {
                                                                status: 500,
                                                                message: 'Internal Server Error'
                                                            });
                                                        }
                                                        else
                                                        {
                                                            socket.emit(`voteRes`, {
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
                                                socket.emit(`voteRes`, {
                                                    status: 900,
                                                    message: 'Unauthorised'
                                                });
                                            }
                                        }).catch((err) => {
                                            console.error(err);
                                            socket.emit(`voteRes`, {
                                                status: 500,
                                                message: 'Internal Server Error'
                                            });
                                        });
                                    }
                                    else
                                    {
                                        socket.emit(`voteRes`, {
                                            status: 900,
                                            message: 'Voting Ended'
                                        });
                                    }
                                }
                                else
                                {
                                    socket.emit(`voteRes`, {
                                        status: 900,
                                        message: 'Invalid Application ID'
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        socket.emit(`voteRes`, {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
            });
        }
        else
        {
            socket.emit(`voteRes`, {
                status: 900,
                message: 'No Application ID Provided'
            });
        }
    });

    // Make final Vote
    socket.on('finalVote', (data) => {
        if(data.applicationId !== undefined)
        {
            User.findOne({ discordId: data.userId }, (err, usr) => {
                if(err)
                {
                    console.error(err);
                    socket.emit(`finalVoteRes`, {
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
                                socket.emit(`finalVoteRes`, {
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
                                        if(utils.isWolfy(user) /*|| utils.isJasper(user)*/)
                                        {
                                            let app = application;
                                            Server.findOne({ server_name: "StormCloud Services" }, (err, server) => {
                                                if(err)
                                                {
                                                    res.send({
                                                        status: 500
                                                    });
                                                }
                                                else
                                                {
                                                    if(server)
                                                    {
                                                        app.status = 1;
                                                        app.markModified('status');

                                                        if(data.approve == true)
                                                        {
                                                            // Make Request to bot to message applicant with approved message
                                                            axios.get('http://localhost:9000/accept/user/application/' + application.user_id, {
                                                                headers: {
                                                                    api_id: server.api_id,
                                                                    api_token: server.api_token
                                                                }
                                                            }).then(data => {
                                                                app.save((err, app) => {
                                                                    if(err)
                                                                    {
                                                                        console.error(err);
                                                                        socket.emit(`finalVoteRes`, {
                                                                            status: 500,
                                                                            message: 'Internal Server Error'
                                                                        });
                                                                    }
                                                                    else
                                                                    {
                                                                        socket.emit(`finalVoteRes`, {
                                                                            status: 200,
                                                                            application: app
                                                                        });
                                                                    }
                                                                });
                                                            }).catch(err => {
                                                                console.error(err);
                                                                socket.emit(`finalVoteRes`, {
                                                                    status: 500,
                                                                    message: 'Internal Server Error'
                                                                });
                                                            });
                                                        }
                                                        else
                                                        {
                                                            // Make Request to bot to message applicant with denyed message
                                                            axios.get('http://localhost:9000/deny/user/application/' + application.user_id, {
                                                                headers: {
                                                                    api_id: server.api_id,
                                                                    api_token: server.api_token
                                                                }
                                                            }).then(data => {
                                                                app.save((err, app) => {
                                                                    if(err)
                                                                    {
                                                                        console.error(err);
                                                                        socket.emit(`finalVoteRes`, {
                                                                            status: 500,
                                                                            message: 'Internal Server Error'
                                                                        });
                                                                    }
                                                                    else
                                                                    {
                                                                        socket.emit(`finalVoteRes`, {
                                                                            status: 200,
                                                                            application: app
                                                                        });
                                                                    }
                                                                });
                                                            }).catch(err => {
                                                                console.error(err);
                                                                socket.emit(`finalVoteRes`, {
                                                                    status: 500,
                                                                    message: 'Internal Server Error'
                                                                });
                                                            });
                                                        }
                                                    }
                                                    else
                                                    {
                                                        socket.emit(`finalVoteRes`, {
                                                            status: 500,
                                                            message: 'Internal Server Error'
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                        else
                                        {
                                            socket.emit(`finalVoteRes`, {
                                                status: 900,
                                                message: 'Unauthorised'
                                            });
                                        }
                                    }
                                    else
                                    {
                                        socket.emit(`finalVoteRes`, {
                                            status: 900,
                                            message: 'Voting Ended'
                                        });
                                    }
                                }
                                else
                                {
                                    socket.emit(`finalVoteRes`, {
                                        status: 900,
                                        message: 'Invalid Application ID'
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        socket.emit(`finalVoteRes`, {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
            });
        }
        else
        {
            socket.emit(`finalVoteRes`, {
                status: 900,
                message: 'No Application ID Provided'
            });
        }
    });

    socket.on('createComment', (data) => {
        if(data.applicationId !== undefined)
        {
            User.findOne({ discordId: data.userId }, (err, usr) => {
                if(err)
                {
                    socket.emit(`commentRes`, {
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
                                socket.emit(`commentRes`, {
                                    status: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            else
                            {
                                if(application)
                                {
                                    if(data.commentContent.length > 0 && data.commentContent.length <= 250)
                                    {
                                        application.comments.push({
                                            user_id: user.discordId,
                                            username: user.username,
                                            content: data.commentContent,
                                            timestamp: Math.round(new Date().getTime() / 1000)
                                        });

                                        application.markModified('comemnts');

                                        application.save((err, application) => {
                                            if(err)
                                            {
                                                socket.emit(`commentRes`, {
                                                    status: 500,
                                                    message: 'Internal Server Error'
                                                });
                                            }
                                            else
                                            {
                                                io.emit(`commentRes:${data.applicationId}`, {
                                                    status: 200,
                                                    application: application
                                                });
                                                socket.emit('commentRes', {
                                                    status: 200
                                                });
                                            }
                                        });
                                    }
                                    else
                                    {
                                        if(data.commentContent.length == 0)
                                        {
                                            socket.emit(`commentRes`, {
                                                status: 900,
                                                message: 'Please provide text to submit as the comment'
                                            });
                                        }
                                        else
                                        {
                                            socket.emit(`commentRes`, {
                                                status: 900,
                                                message: 'Comment content can be a maximum of 250 characters'
                                            });
                                        }
                                    }
                                }
                                else
                                {
                                    socket.emit(`commentRes`, {
                                        status: 900,
                                        message: 'No Application Found'
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        socket.emit(`commentRes`, {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
            });
        }
        else
        {
            socket.emit(`commentRes`, {
                status: 900,
                message: 'No Application ID Provided'
            });
        }
    });
};