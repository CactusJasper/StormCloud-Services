let User = require('../models/user');
let Server = require('../models/server');
const axios = require('axios');

module.exports = (socket, io) => {
    // GET USER MOONGOSE DB ID
    let userId = socket.request.session.passport;

    // Update Stored User Data Socket Request Handle
    socket.on('updateUserData', (data) => {
        User.findOne({ _id: userId }, (err, usr) => {
            if(err)
            {
                console.log('=============== updateUserData DB ================');
                console.error(err);
            }
            else
            {
                if(usr)
                {
                    // Request to bot for highest role
                    // Request to bot for current username
                    // Update the user Object
                    let user = usr;
                    Server.findOne({ server_name: "StormCloud Services" }, (err, server) => {
                        if(err)
                        {
                            console.log('=============== updateUserData DB ================');
                            console.error(err);
                        }
                        else
                        {
                            let highestRole;
                            let username;

                            if(server)
                            {
                                axios.get(`http://localhost:9000/user/higestrole/${user.discordId}`, {
                                    headers: {
                                        api_id: server.api_id,
                                        api_token: server.api_token
                                    }
                                }).then((res) => {
                                    if(res.data.status == 200)
                                    {
                                        highestRole = res.data.role;
                                    }

                                    axios.get(`http://localhost:9000/user/username/${user.discordId}`, {
                                        headers: {
                                            api_id: server.api_id,
                                            api_token: server.api_token
                                        }
                                    }).then((res) => { 
                                        if(res.data.status == 200)
                                        {
                                            username = res.data.username;
                                        }

                                        if(username !== undefined)
                                            user.username = username;
                                        if(highestRole !== undefined)
                                            user.highest_role = highestRole;

                                        user.save((err) => {
                                            if(err)
                                            {
                                                console.log('=============== updateUserData DB ================');
                                                console.error(err);
                                            }
                                        });
                                    });
                                }).catch((err) => {
                                    console.log('=============== updateUserData WR ================');
                                    console.error(err);
                                });
                            }
                        }
                    });
                }
            }
        });
    });
};