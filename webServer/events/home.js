let Application = require('../models/application');
let UserData = require('../models/user_data');
let User = require('../models/user');
let utils = require('../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    // Top 10 XP Leaders Socket Request Handle
    socket.on('t10', (data) => {
        console.time('t10_start');
        UserData.find({}, (err, docs) => {
            if(err)
            {
                socket.emit('t10', {
                    status: 500,
                    message: 'Internal Server Error.'
                });
            }
            else
            {
                if(docs)
                {
                    docs.sort((a, b) => {
                        return b.level - a.level;
                    });
                    let t10 = [];

                    if(docs.length > 10)
                    {
                        for(let i = 0; i < 10; i++)
                        {
                            t10.push(docs[i]);
                        }
                    }
                    else
                    {
                        t10 = docs;
                    }

                    socket.emit('t10', {
                        status: 200,
                        data: t10
                    });
                }
                else
                {
                    socket.emit('t10', {
                        status: 900,
                        message: 'No User Data'
                    });
                }
            }

            console.timeEnd('t10_start');
        });
    });

    // User Applications Socket Request Handle
    socket.on('getApplications', (data) => {
        User.findOne({ _id: userId }, (err, user) => {
            if(err)
            {
                socket.emit('updateApplications', {
                    status: 500,
                    message: 'Internal Server Error'
                });
            }
            else
            {
                if(user)
                {
                    utils.isAdmin(user).then((admin) => {
                        if(admin || utils.isWolfy(user)  || utils.isJasper(user))
                        {
                            Application.find({}, (err, docs) => {
                                if(err)
                                {
                                    socket.emit('updateApplications', {
                                        status: 500,
                                        message: 'Internal Server Error'
                                    });
                                }
                                else
                                {
                                    if(docs.length > 0)
                                    {
                                        docs.sort((a, b) => {
                                            return b.timestamp - a.timestamp;
                                        });

                                        socket.emit('updateApplications', {
                                            status: 200,
                                            admin: true,
                                            applications: docs
                                        });
                                    }
                                    else
                                    {
                                        socket.emit('updateApplications', {
                                            status: 900,
                                            admin: true,
                                            message: 'No Applications'
                                        });
                                    }
                                }
                            });
                        }
                        else
                        {
                            Application.find({ user_id: user.discordId }, (err, docs) => {
                                if(err)
                                {
                                    socket.emit('updateApplications', {
                                        status: 500,
                                        message: 'Internal Server Error'
                                    });
                                }
                                else
                                {
                                    if(docs.length > 0)
                                    {
                                        docs.sort((a, b) => {
                                            return b.timestamp - a.timestamp;
                                        });

                                        socket.emit('updateApplications', {
                                            status: 200,
                                            admin: false,
                                            applications: docs
                                        });
                                    }
                                    else
                                    {
                                        socket.emit('updateApplications', {
                                            status: 900,
                                            admin: false,
                                            message: 'No Applications'
                                        });
                                    }
                                }
                            });
                        }
                    }).catch((err) => {
                        console.error(err);
                        socket.emit('updateApplications', {
                            status: 500,
                            message: 'Internal Server Error'
                        });
                    });
                }
                else
                {
                    socket.emit('updateApplications', {
                        status: 900,
                        message: 'Invalid User ID'
                    });
                }
            }
        });
    });
};