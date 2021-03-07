let User = require('../../../models/user');
let ModRole = require('../../../models/mod_role');
let utils = require('../../../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    // Create Moderation Role
    socket.on('createModRole', (data) => {
        User.findOne({ _id: userId }, (err, user) => {
            if(err)
            {
                socket.emit('createModRoleCb', {
                    status: 500
                });
            }
            else
            {
                if(user)
                {
                    if(utils.isWolfy(user) || utils.isJasper(user))
                    {
                        if(data.roleId != null || data.roleId != undefined)
                        {
                            let modRole = new ModRole({
                                level: data.modLevel,
                                role_id: data.roleId
                            });

                            modRole.save((err, role) => {
                                if(err)
                                {
                                    socket.emit('createModRoleCb', {
                                        status: 500
                                    });
                                }
                                else
                                {
                                    socket.emit('createModRoleCb', {
                                        status: 200
                                    });
                                }
                            });
                        }
                        else
                        {
                            socket.emit('createModRoleCb', {
                                status: 900,
                                message: 'Please provide a role you would like to add'
                            });
                        }
                    }
                    else
                    {
                        socket.emit('createModRoleCb', {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
            }
        });
    });

    // Delete Moderation Role
    socket.on('deleteModRole', (data) => {
        User.findOne({ _id: userId }, (err, user) => {
            if(err)
            {
                socket.emit('deleteModRoleCb', {
                    status: 500
                });
            }
            else
            {
                if(user)
                {
                    if(utils.isWolfy(user) || utils.isJasper(user))
                    {
                        ModRole.deleteOne({ _id: data.roleId }, (err) => {
                            if(err)
                            {
                                socket.emit('deleteModRoleCb', {
                                    status: 500
                                });
                            }
                            else
                            {
                                socket.emit('deleteModRoleCb', {
                                    status: 200,
                                    roleId: data.roleId
                                });
                            }
                        });
                    }
                    else
                    {
                        socket.emit('deleteModRoleCb', {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
            }
        });
    });
}