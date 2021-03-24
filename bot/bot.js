const Discord = require('discord.js');
const client = new Discord.Client();
let mongoose = require('mongoose');
let Server = require('./models/server');
const express = require('express');
const bodyParser = require('body-parser');
const randomstring = require('randomstring');
const UserData = require('./models/user_data');
const LevelReward = require('./models/level_reward');
const ModRole = require('./models/mod_role');
const config = require('./config');
let app = express();
let fs = require('fs');
let utils = require('./utils.js');
let analysis = require('./modules/moderation');
let censor = require('./modules/censor');
let aes256 = require('aes256');
let cipher = aes256.createCipher(config.logger_key);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Connect to DB / Start Web Server / Start Discord Bot Client
mongoose.connect(config.db_url, { useNewUrlParser: true, useUnifiedTopology: true }).then((res) => {
    console.log(`Connected to Database Server`);
    app.listen(config.web_port, () => {
        console.log(`Web Server started on port ${config.web_port}`);
        client.login(config.discord_token);
    });
}).catch((err) => console.error(err));
let db = mongoose.connection;

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    console.log(`Registered ${command.name} Command`);
	client.commands.set(command.name, command);
}

client.on('guildMemberAdd', (event) => {
	if(event.guild.id == config.server_id)
    {
        updateUserRoles(event.user)
    }
});

client.on('message', (message) => {
    if(message.author.bot) return;
    if(message.guild.id === config.server_id)
    {
        if(!censor.shouldCensor(message))
        {
            if(message.channel.id == '803358616470945884' /*|| message.channel.id == '803459664347004968'*/)
            {
                const log = client.channels.cache.find(channel => channel.id === '818916933641699358');
                if(message.attachments.array().length > 0)
                {
                    let attachments = message.attachments;
                    if(message.content == '' || message.content == undefined)
                    {
                        log.send(utils.codeBlock(`Attachment sent by  ${message.author.username}:`), attachments.first());
                    }
                    else
                    {
                        log.send(utils.codeBlock(`Message by ${message.author.username}: ${cipher.encrypt(message.content)}`), attachments.first());
                    }
                }
                else
                {
                    log.send(utils.codeBlock(`Message by ${message.author.username}: ${cipher.encrypt(message.content)}`));
                }
            }
            
            if(message.content.startsWith('$'))
            {
                const args = message.content.slice(1).trim().split(/ +/);
                const command = args.shift().toLowerCase();
                
                if(command == 'profile')
                {
                    client.commands.get('profile').execute(message, args);
                }
                else if(command == 'test')
                {
                    console.log(message.member.roles.highest.id);
                }
            }
            else
            {
                if(message.content.length == 1) return;

                if(message.content != '') 
                {
                    if(!analysis.checkMessage(message))
                    {
                        message.react('👎').catch((err) => console.error(err));
                    }
                }

                UserData.findOne({ user_id: message.member.id }, (err, data) => {
                    if(err)
                    {
                        console.error(err);
                    }
                    else
                    {
                        if(data)
                        {
                            let userData = data;
                            let currentTime = Math.floor(new Date().getTime() / 1000.0);

                            if(Math.floor(currentTime) >= userData.last_rewarded + 120)
                            {
                                let xpReward;
                                if(message.content.length < 5)
                                {
                                    if(utils.getRandomInt(0, 100) > 98)
                                    {
                                        xpReward = utils.getRandomInt(10, 15);
                                    }
                                    else
                                    {
                                        xpReward = utils.getRandomInt(2, 5);
                                    }
                                }
                                else
                                {
                                    if(utils.getRandomInt(0, 100) > 98)
                                    {
                                        xpReward = utils.getRandomInt(100, 150);
                                    }
                                    else
                                    {
                                        xpReward = utils.getRandomInt(5, 20);
                                    }
                                }

                                let newXpTotal = userData.xp + xpReward;
                                let nextLevelXpNeeded = utils.getLevel(userData.level + 1);
                                userData.xp = newXpTotal;
                                
                                if(newXpTotal >= nextLevelXpNeeded)
                                {
                                    userData.level = userData.level + 1;
                                    LevelReward.findOne({ level: userData.level }, (err, levelData) => {
                                        if(err)
                                        {
                                            userData.username = message.member.displayName;
                                            userData.markModified('username');
                                            userData.save((err) => {
                                                if(err)
                                                {
                                                    console.error(err);
                                                }
                                            });
                                        }
                                        else
                                        {
                                            if(levelData)
                                            {
                                                userData.username = message.member.displayName;
                                                userData.markModified('username');
                                                userData.save((err) => {
                                                    if(err)
                                                    {
                                                        console.error(err);
                                                    }
                                                });
                                            }
                                            else
                                            {

                                                userData.username = message.member.displayName;
                                                userData.markModified('username');
                                                userData.save((err) => {
                                                    if(err)
                                                    {
                                                        console.error(err);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                                else
                                {
                                    userData.username = message.member.displayName;
                                    userData.markModified('username');
                                    userData.save((err) => {
                                        if(err)
                                        {
                                            console.error(err);
                                        }
                                    });
                                }
                            }

                            updateUserRoles(message.author.id);
                        }
                        else
                        {
                            let xpReward = utils.getRandomInt(35, 55);
                            let newUser = new UserData({
                                user_id: message.author.id,
                                username: message.author.username,
                                xp: xpReward,
                                level: 0,
                                last_rewarded: Math.floor(new Date().getTime() / 1000.0)
                            });


                            newUser.username = message.author.username;
                            newUser.save((err) => {
                                if(err)
                                {
                                    console.error(err);
                                }
                            });
                        }
                    }
                });
            }
        }
        else
        {
            message.delete().then((msg) => {
                msg.author.createDM({ force: true }).then((channel) => {
                    channel.send('Please can you not mention this topic.').catch((err) => console.error(err));
                }).catch(err => console.error(err));
            }).catch((err) => console.error(err));
        }
    }
});

function updateUserRoles(eUser)
{
    client.guilds.cache.get(config.server_id).members.fetch({ user: eUser.id, force: true }).then(usr => {
        let user = usr;
        UserData.findOne({ user_id: user.id }, (err, dat) => {
            if(err)
            {
                let role = client.guilds.cache.get(config.server_id).roles.cache.get('803467878854426644');
                user.roles.add(role).catch(err => console.error(err));
            }
            else
            {
                if(dat)
                {
                    let data = dat;
                    LevelReward.find({}, (err, rewards) => {
                        if(err)
                        {
                            let role = client.guilds.cache.get(config.server_id).roles.cache.get('803467878854426644');
                            user.roles.add(role).catch(err => console.error(err));
                        }
                        else
                        {
                            rewards.sort((a, b) => {
                                return b.level - a.level;
                            });

                            for(let i = 0; i < rewards.length; i++)
                            {
                                if(data.level >= rewards[i].level)
                                {
                                    let role = client.guilds.cache.get(config.server_id).roles.cache.get(rewards[i].role_id);
                                    user.roles.add(role).catch(err => console.error(err));
                                }
                            }

                            let role = client.guilds.cache.get(config.server_id).roles.cache.get('803467878854426644');
                            user.roles.add(role).catch(err => console.error(err));
                        }
                    });
                }
            }
        });
        
    }).catch(err => console.error(err));
}

/*
 *
 * Bot Web Server to bridge the gap between the Site and the Discord Server
 * 
 */

// Load Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

let apiId;
let apiToken;

Server.findOne({ server_name: 'StormCloud Services' }, (err, server) => {
    if(err)
    {
        console.error(err);
    }
    else
    {
        if(!server)
        {
            apiId = randomstring.generate({
                length: 16,
                charset: 'numeric'
            });
            apiToken = randomstring.generate({
                length: 512,
                charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!$%'
            });

            let server = new Server({
                server_name: 'StormCloud Services',
                api_id: apiId,
                api_token: apiToken
            });

            server.save((err) => {
                if(err)
                {
                    console.error(err);
                }
            });
        }
        else
        {
            apiId = server.api_id;
            apiToken = server.api_token;
        }
    }
});

app.get('/', (req, res) => {
    res.send({
        'Status': 'OK',
        'Runtime-mode': 'productionMode',
        'Application-Name': 'StormCloud Services',
    });
});

app.get('/server/status', checkAuth, (req, res) => {
    res.send({
        status: 200,
        available: client.guilds.cache.get(config.server_id).available
    });
});

app.get('/@roles', checkAuth, (req, res) => {
    client.guilds.cache.get(config.server_id).roles.fetch().then(roles => {
        res.send({
            status: 200,
            roles: roles
        });
    }).catch(err => {
        res.send({
            status: 500
        });
    });
});

app.get('/accept/user/application/:userId', checkAuth, (req, res) => {
    if(req.params.userId !== undefined)
    {
        client.guilds.cache.get(config.server_id).members.fetch({ user: req.params.userId, force: true }).then(user => {
            user.roles.add(client.guilds.cache.get('803358616470945881').roles.cache.get('803739983784837201'));
            user.createDM({ force: true }).then(channel => {
                channel.send('Your Application for Jr Moderator was approved welcome to the StormCloud Moderation Team.').then(msg => {
                    res.send({
                        status: 200
                    });
                });
            });
        }).catch(err => {
            console.error(err);
            res.send({
                status: 500
            });
        });
    }
    else
    {
        res.send({
            status: 901
        });
    }
});

app.get('/deny/user/application/:userId', checkAuth, (req, res) => {
    if(req.params.userId !== undefined)
    {
        client.guilds.cache.get(config.server_id).members.fetch({ user: req.params.userId, force: true }).then(user => {
            user.createDM({ force: true }).then(channel => {
                channel.send('Your Application for Jr Moderator was denied we are sorry however the StormCloud Moderation Team cannot accept you at this time.').then(msg => {
                    res.send({
                        status: 200
                    });
                });
            });
        }).catch(err => {
            console.error(err);
            res.send({
                status: 500
            });
        });
    }
    else
    {
        res.send({
            status: 901
        });
    }
});

app.get('/user/higestrole/:userId', checkAuth, (req, res) => {
    if(req.params.userId !== undefined)
    {
        let userId = req.params.userId;
        client.guilds.cache.get(config.server_id).members.fetch({ user: userId, force: true, cache: false }).then(usr => {
            res.send({
                status: 200,
                role: usr.roles.highest.id
            });
        }).catch(err => {
            console.error(err);
            res.send({
                status: 500,
                message: 'Internal Server Error'
            });
        });
    }
    else
    {
        res.send({
            status: 500,
            message: "User ID Not Provided"
        });
    }
});

app.get('/user/username/:userId', checkAuth, (req, res) => {
    if(req.params.userId !== undefined)
    {
        let userId = req.params.userId;
        client.guilds.cache.get(config.server_id).members.fetch({ user: userId }).then(usr => {
            res.send({
                status: 200,
                username: usr.user.username
            });
        }).catch(err => {
            console.error(err);
            res.send({
                status: 500,
                message: 'Internal Server Error'
            });
        });
    }
    else
    {
        res.send({
            status: 500,
            message: "User ID Not Provided"
        });
    }
});

// API Creds Check
function checkAuth(req, res, next)
{
    let api_id = req.headers.api_id;
    let api_token = req.headers.api_token;
    if(api_id == apiId && api_token == apiToken)
    {
        return next();
    }
    else
    {
        res.send({
            status: 401,
            message: 'Invalid Auth'
        });
    }
}