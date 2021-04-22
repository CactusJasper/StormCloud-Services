let User = require('../../../models/user');
let utils = require('../../../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;
    let perPage = 20;

    socket.on('getUsers', (data) => {
        if(data.page > 0 && typeof data.page !== "undefined")
        {
            User.find({}).skip((perPage * data.page) - perPage).limit(perPage).exec((err, users) => {
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
                        socket.emit('getUserCb', {
                            status: 200,
                            message: 'Pagination',
                            users: users
                        });
                    }
                    else
                    {
                        socket.emit('getUserCb', {
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
                        socket.emit('getUserCb', {
                            status: 200,
                            message: 'All Users',
                            users: users
                        });
                    }
                    else
                    {
                        socket.emit('getUserCb', {
                            status: 900,
                            message: 'No Users'
                        });
                    }
                }
            });
        }
    });
}
