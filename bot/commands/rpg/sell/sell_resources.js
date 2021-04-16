let utils = require('../../../utils');
let RPGData = require('../../../models/rpg_data');
const Discord = require('discord.js');
let fs = require('fs');

module.exports = {
	name: 'sell_ores',
	description: 'Sells all Ores in your inventory.',
	execute(message, args) {
        let userId = message.author.id;
        let skills = JSON.parse(fs.readFileSync('./rpg_data/skills.json'));
        let resources = JSON.parse(fs.readFileSync('./rpg_data/resources.json'));

        RPGData.findOne({ user_id: userId }, (err, data) => {
            if(err)
            {
                console.error(err);
                message.channel.send('Selling Resources is currently unavailable come back later.').catch((err) => console.error(err));
            }
            else
            {
                if(data)
                {

                }
                else
                {
                    let rpgData = new RPGData({
                        user_id: message.author.id,
                        skills: skills,
                        inventory: []
                    });

                    rpgData.save((err) => {
                        if(err) console.error(err);
                        message.channel.send('You have no resources to sell come back after working.').catch(err => console.error(err));
                    });
                }
            }
        });
    },
};