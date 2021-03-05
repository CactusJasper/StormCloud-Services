let User = require('../models/user');
let LevelReward = require('../models/level_reward');
let utils = require('../utils');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport.user;

    // Create a new role reward
    socket.on('createReward', (data) => {
        User.findOne({ _id: userId }, (err, user) => {
            if(err)
            {
                socket.emit('createRoleRwardCb', {
                    status: 500
                });
            }
            else
            {
                if(user)
                {
                    if(utils.isWolfy(user) || utils.isJasper(user))
                    {
                        if(data.level > 0)
                        {
                            if(data.roleId !== null && data.roleId !== undefined)
                            {
                                let reward = new LevelReward({
                                    level: data.level,
                                    role_id: data.roleId
                                });

                                reward.save((err, role) => {
                                    if(err)
                                    {
                                        socket.emit('createRoleRwardCb', {
                                            status: 500
                                        });
                                    }
                                    else
                                    {
                                        socket.emit('createRoleRwardCb', {
                                            status: 200
                                        });
                                    }
                                });
                            }
                            else
                            {
                                socket.emit('createRoleRwardCb', {
                                    status: 900,
                                    message: 'Invalid Role Id'
                                });
                            }
                        }
                        else
                        {
                            socket.emit('createRoleRwardCb', {
                                status: 900,
                                message: 'Invalid level num'
                            });
                        }
                    }
                    else
                    {
                        socket.emit('createRoleRwardCb', {
                            status: 900,
                            message: 'Unauthorised'
                        });
                    }
                }
                else
                {
                    socket.emit('createRoleRwardCb', {
                        status: 500
                    });
                }
            }
        });
    });

    // Delete role reward
    socket.on('deleteReward', (data) => {
        User.findOne({ _id: userId }, (err, user) => {
            if(err)
            {
                socket.emit('deleteRewardCb', {
                    status: 500
                });
            }
            else
            {
                if(user)
                {
                    LevelReward.deleteOne({ _id: data.roleId}, (err) => {
                        if(err)
                        {
                            socket.emit('deleteRewardCb', {
                                status: 500
                            });
                        }
                        else
                        {
                            socket.emit('deleteRewardCb', {
                                status: 200,
                                roleId: data.roleId
                            });
                        }
                    });
                }
                else
                {
                    socket.emit('deleteRewardCb', {
                        status: 900,
                        message: 'Unauthorised'
                    });
                }
            }
        });
    });
}