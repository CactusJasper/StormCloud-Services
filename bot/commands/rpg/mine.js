let utils = require('../../utils');
let RPGData = require('../../models/rpg_data');
const Discord = require('discord.js');
let fs = require('fs');

module.exports = {
	name: 'mine',
	description: 'Makes you mine for ore.',
	execute(message, args) {
        let userId = message.author.id;
        RPGData.findOne({ user_id: userId }, (err, data) => {
            if(err)
            {
                console.error(err);
            }
            else
            {
                if(data)
                {

                }
                else
                {
                    let skills = JSON.parse(fs.readFileSync('./rpg_data/skills.json'));

                    for(let i = 0; i < skills.length; i++)
                    {
                        skills[i].level = 0;
                        skills[i].xp = 0;
                    }

                    let rpgData = new RPGData({
                        user_id: message.author.id,
                        skills: skills,
                        inventory: []
                    });

                    if(utils.getRandomInt(0, 100) > 50)
                    {
                        // Found Coal
                    }
                }
            }
        });
        //let embed = new Discord.MessageEmbed().setTitle('You Mined Coal').attachFiles(['./images/ores/CoalOre001.png']).setImage('attachment://CoalOre001.png');
        //message.channel.send(embed).catch(err => console.error(err));
	},
};