let DiscordStrategy = require('passport-discord').Strategy;
const User = require('../../models/user');
const ModRole = require('../../models/mod_role');
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
            User.findOne(options, (err, usr) => {
                if(err)
                {
                    return done(err);
                }
                else
                {
                    if(!usr)
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
                                            let highestRole = res.data.role;
                                            let modProfile = profile;
                                            modProfile.mfa_enabled = undefined;
                                            modProfile.accessToken = undefined;
                                            modProfile.fetchedAt = undefined;
                                            modProfile.guilds = undefined;

                                            let user = new User();
                                            user.discordId = profile.id
                                            user.username = profile.username;
                                            user.provider = 'discord';
                                            user.discord = modProfile;
                                            if(typeof config.default_super_users !== "undefined")
                                            {
                                                for(let i = 0; i < config.default_super_users.length; i++)
                                                {
                                                    if(profile.id === config.default_super_users[i])
                                                        user.superuser = true;
                                                }
                                            }
                                            user.highest_role = highestRole;
                                            
                                            ModRole.find({}, (err, roles) => {
                                                if(err)
                                                {
                                                    return done('Internal Server Error', null);
                                                }
                                                else
                                                {
                                                    if(roles.length > 0)
                                                    {
                                                        for(let i = 0; i < roles.length; i++)
                                                        {
                                                            if(highestRole == roles[i].role_id)
                                                            {
                                                                user.admin = true;
                                                            }
                                                        }
                                                    }
                                                    
                                                    user.save((err) => {
                                                        if (err) console.log(err);
                                                    });
        
                                                    return done(null, user);
                                                }
                                            });
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
                        let user = usr;
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
                                            let highestRole = res.data.role;
                                            user.highest_role = highestRole;
                                            user.username = profile.username;
                                            let isSuperuser = false;
                                            if(typeof config.default_super_users !== "undefined")
                                            {
                                                for(let i = 0; i < config.default_super_users.length; i++)
                                                {
                                                    if(profile.id === config.default_super_users[i])
                                                    {
                                                        user.superuser = true;
                                                        isSuperuser = true;
                                                    }
                                                }
                                            }

                                            if(!isSuperuser)
                                                user.superuser = false;

                                            let modProfile = profile;
                                            modProfile.mfa_enabled = undefined;
                                            modProfile.accessToken = undefined;
                                            modProfile.fetchedAt = undefined;
                                            modProfile.guilds = undefined;
                                            user.discord = modProfile;
                                            user.markModified('discord.mfa_enabled');
                                            user.markModified('discord.accessToken');
                                            user.markModified('discord.fetchedAt');
                                            user.markModified('discord.guilds');

                                            ModRole.find({}, (err, roles) => {
                                                if(err)
                                                {
                                                    return done('Internal Server Error', null);
                                                }
                                                else
                                                {
                                                    let isAdmin = false;
                                                    if(roles.length > 0)
                                                    {
                                                        for(let i = 0; i < roles.length; i++)
                                                        {
                                                            if(highestRole == roles[i].role_id)
                                                            {
                                                                user.admin = true;
                                                                isAdmin = true;
                                                            }
                                                        }
                                                    }

                                                    if(!isAdmin)
                                                        user.admin = false;
                                                    
                                                    user.save((err) => {
                                                        if(err) console.log(err);
                                                    });
        
                                                    return done(null, user);
                                                }
                                            });
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