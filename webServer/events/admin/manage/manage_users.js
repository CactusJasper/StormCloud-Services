let User = require('../../../models/user');
let utils = require('../../../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;
    let perPage = 20;

    socket.on('getUsers', (data) => {
        if(data.getMaxPages == true)
        {
            User.find({}, (err, users) => {
                if(err)
                {
                    console.error(err);
                    socket.emit('getUsersCb', {
                        status: 500
                    });
                }
                else
                {
                    if(users.length > 0)
                    {
                        socket.emit('getUsersCb', {
                            status: 200,
                            message: 'MaxPages',
                            maxPages: Math.ceil(users.length / perPage)
                        });
                    }
                    else
                    {
                        socket.emit('getUsersCb', {
                            status: 900,
                            message: 'No Users'
                        });
                    }
                }
            });
        }
        else if(data.page > 0 && typeof data.page !== "undefined")
        {
            User.find({}).skip((perPage * data.page) - perPage).limit(perPage).exec((err, users) => {
                if(err)
                {
                    console.error(err);
                    socket.emit('getUsersCb', {
                        status: 500
                    });
                }
                else
                {
                    if(users.length > 0)
                    {
                        let userList = [];
                        for(let user of users)
                        {
                            user.discord.mfa_enabled = undefined;
                            user.discord.fetchedAt = undefined;
                            user.discord.guilds = undefined;
                            user.discord.accessToken = undefined;
                            userList.push(user);
                        }

                        socket.emit('getUsersCb', {
                            status: 200,
                            message: 'Pagination',
                            currentUser: userId,
                            pageNum: data.page,
                            users: users
                        });
                    }
                    else
                    {
                        socket.emit('getUsersCb', {
                            status: 900,
                            message: 'No Users'
                        });
                    }
                }
            });
        }
        else
        {
            User.find({}, (err, users) => {
                if(err)
                {
                    console.error(err);
                    socket.emit('getUserCb', {
                        status: 500
                    });
                }
                else
                {
                    if(users.length > 0)
                    {
                        let userList = [];
                        for(let user of users)
                        {
                            user.discord.mfa_enabled = undefined;
                            user.discord.fetchedAt = undefined;
                            user.discord.guilds = undefined;
                            userList.push(user);
                        }

                        socket.emit('getUsersCb', {
                            status: 200,
                            message: 'All Users',
                            currentUser: userId,
                            users: users
                        });
                    }
                    else
                    {
                        socket.emit('getUsersCb', {
                            status: 900,
                            message: 'No Users'
                        });
                    }
                }
            });
        }
    });
}
