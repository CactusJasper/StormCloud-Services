const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const config = require('./config');

client.on('error', (err) => {
    console.error(err);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('threadCreate', async thread => {
    let hasRole = false;

    client.guilds.cache.get(config.server_id).members.fetch({ user: thread.ownerId, force: true, cache: false }).then(usr => {
        if(typeof usr.roles.cache.get(config.role_id) !== "undefined") hasRole = true;
    }).catch(err => console.error(err));

    if(hasRole === false)
    {
        thread.delete().then(delThread => {
            client.guilds.cache.get(config.server_id).members.fetch({ user: thread.ownerId, force: true, cache: false }).then(usr => {
                usr.createDM(true).then(channel => {
                    channel.send(`We do not allow thread's in this server`);
                }).catch(err => console.error(err));
            }).catch(err => console.error(err));
        }).catch(err => console.error(err));
    }
});

client.login(config.bot_token);