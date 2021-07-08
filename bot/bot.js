const Discord = require('discord.js');
const client = new Discord.Client();
let mongoose = require('mongoose');
let Server = require('./models/server');
const express = require('express');
const bodyParser = require('body-parser');
const randomstring = require('randomstring');
const config = require('./config');
let app = express();
let fs = require('fs');
let utils = require('./utils.js');
let moderation = require('./modules/moderation');
let logging = require('./modules/logging');
const MutedUser = require('./models/muted_user');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Connect to DB / Load Toxicity modules model / Start Web Server / Start Discord Bot Client
mongoose.connect(config.db_url, { useNewUrlParser: true, useUnifiedTopology: true }).then((res) => {
    console.log(`Connected to Database Server`);
    moderation.loadModel();
    app.listen(config.web_port, () => {
        console.log(`Web Server started on port ${config.web_port}`);
        client.login(config.discord_token);
    });
}).catch((err) => console.error(err));
let db = mongoose.connection;

client.commands = new Discord.Collection();
let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    console.log(`Registered ${command.name} Command`);
	client.commands.set(command.name, command);
}

commandFiles = fs.readdirSync('./commands/rpg').filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
    const command = require(`./commands/rpg/${file}`);
    console.log(`Registered ${command.name} Command`);
	client.commands.set(command.name, command);
}

client.on('guildMemberAdd', (event) => {
	if(event.guild.id == config.server_id)
    {
        updateUserRoles(event.user);

        MutedUser.findOne({ user_id: event.user.id }, (err, doc) => {
            if(err)
            {
                console.error(err);
            }
            else
            {
                if(doc)
                {
                    event.roles.add(config.muted_role).catch((err) => console.error(err));
                }
            }
        });
    }
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    if(oldMember.roles.cache.get(config.muted_role) == undefined)
    {
        if(newMember.roles.cache.get(config.muted_role) !== undefined)
        {
            MutedUser.findOne({ user_id: newMember.id }, (err, doc) => {
                if(err)
                {
                    console.error(err);
                }
                else
                {
                    if(!doc)
                    {
                        let muted = new MutedUser({
                            user_id: newMember.id
                        });
            
                        muted.save((err) => {
                            if(err) console.error(err);
                        });
                    }
                }
            });
        }
    }

    if(oldMember.roles.cache.get(config.muted_role) !== undefined)
    {
        if(newMember.roles.cache.get(config.muted_role) == undefined)
        {
            MutedUser.deleteOne({ user_id: newMember.id }, (err) => {
                if(err) console.error(err);
            });
        }
    }
});

client.on('message', (message) => {
    if(message.author.bot) return;
    if(message.channel.type == 'dm') return;
    if(message.guild.id === config.server_id)
    {
        // Message Moderation Module
        let command = false;
        let shouldLog = true;
        if(message.content.startsWith('$')) command = true;
        if(!command)
        {
            //let output = moderation.isSafeMessage(message);
            //if(output == false) shouldLog = false;
        }
        else
        {
            shouldLog = false;
        }

        // Message Logging Module
        const log = client.channels.cache.find(channel => channel.id === config.logging_channel);
        if(log !== undefined && shouldLog == true) logging.logMessage(message, log);
        
        if(message.content.startsWith('$'))
        {
            const args = message.content.slice(1).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            if(command == 'profile')
            {
                client.commands.get('profile').execute(message, args);
            }
            else if(command == 'mine' && (message.author.id == '217387293571284992' || message.author.id == '228618507955208192'))
            {
                client.commands.get('mine').execute(message, args);
            }
            else if(command == 'woodcut' && (message.author.id == '217387293571284992' || message.author.id == '228618507955208192'))
            {
                client.commands.get('woodcut').execute(message, args);
            }
            else if(command == 'sell' && (message.author.id == '217387293571284992' || message.author.id == '228618507955208192'))
            {
                client.commands.get('sell').execute(message, args);
            }
        }
    }
});

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