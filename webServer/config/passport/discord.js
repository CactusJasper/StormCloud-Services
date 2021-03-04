let DiscordStrategy = require('passport-discord').Strategy;
const User = require('../../models/user');
const Server = require('../../models/server');
const config = require('../config');
const axios = require('axios');

let clientID = config.discord.clientID;
let clientSecret = config.discord.clientSecret;
let callbackURI = config.discord.callbackURI;

module.exports = new DiscordStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURI,
    scope: ['identify', 'guilds']
},(accessToken, refreshToken, profile, done) => {
    const options = {
        discordId: profile.id
    };

    if(profile.guilds !== undefined)
    {
        if(isMember(profile))
        {
            User.findOne(options, (err, user) => {
                if(err)
                {
                    return done(err);
                }
                else
                {
                    if(!user)
                    {
                        Server.findOne({ server_name: "StormCloud Services" }, (err, server) => {
                            if(err)
                            {
                                console.error(err);
                                return done('Internal Server Error', null);
                            }
                            else
                            {
                                if(server)
                                {
                                    axios.get('http://localhost:9000/user/higestrole/' + options.discordId, {
                                        headers: {
                                            api_id: server.api_id,
                                            api_token: server.api_token
                                        }
                                    }).then(res => {
                                        if(res.data.status == 200)
                                        {
                                            let modProfile = profile;
                                            modProfile.mfa_enabled = undefined;
                                            modProfile.accessToken = undefined;
                                            modProfile.fetchedAt = undefined;

                                            let user = new User();
                                            user.discordId = profile.id
                                            user.username = profile.username;
                                            user.provider = 'discord';
                                            user.discord = modProfile;
                                            user.highest_role = res.data.role;

                                            user.save((err) => {
                                                if (err) console.log(err);
                                            });

                                            return done(null, user);
                                        }
                                        else
                                        {
                                            return done('Internal Server Error', null);
                                        }
                                    }).catch(err => {
                                        console.error(err);
                                        return done('Internal Server Error', null);
                                    });
                                }
                                else
                                {
                                    return done('Internal Server Error', null);
                                }
                            }
                        });
                    }
                    else
                    {
                        Server.findOne({ server_name: "StormCloud Services" }, (err, server) => {
                            if(err)
                            {
                                console.error(err);
                                return done('Internal Server Error', null);
                            }
                            else
                            {
                                if(server)
                                {
                                    axios.get('http://localhost:9000/user/higestrole/' + options.discordId, {
                                        headers: {
                                            api_id: server.api_id,
                                            api_token: server.api_token
                                        }
                                    }).then(res => {
                                        if(res.data.status == 200)
                                        {
                                            user.highest_role = res.data.role;
                                            user.username = profile.username;

                                            let modProfile = profile;
                                            modProfile.mfa_enabled = undefined;
                                            modProfile.accessToken = undefined;
                                            modProfile.fetchedAt = undefined;
                                            user.discord = modProfile;
                                            user.markModified('discord.mfa_enabled');
                                            user.markModified('discord.accessToken');
                                            user.markModified('discord.fetchedAt');

                                            user.save((err) => {
                                                if(err)
                                                {
                                                    console.error(err);
                                                }
                                            });

                                            return done(null, user);
                                        }
                                        else
                                        {
                                            return done('Internal Server Error', null);
                                        }
                                    }).catch(err => {
                                        console.error(err);
                                        return done('Internal Server Error', null);
                                    });
                                }
                                else
                                {
                                    return done('Internal Server Error', null);
                                }
                            }
                        });
                    }
                }
            });
        }
        else
        {
            return done('You are not a member of StormCloud Sorry.', null);
        }
    }
    else
    {
        return done('Somthing went Wrong Try again later!', null);
    }
});

function isMember(profile)
{
    for(let i = 0; i < profile.guilds.length; i++)
    {
        if(profile.guilds[i].id == config.server_id)
        {
            return true;
        }
    }

    return false;
}