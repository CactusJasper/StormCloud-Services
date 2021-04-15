let utils = require('../../utils');
let RPGData = require('../../models/rpg_data');
const Discord = require('discord.js');

module.exports = {
	name: 'mine',
	description: 'Makes you mine for ore.',
	execute(message, args) {
        let userId = message.author.id;
        /*RPGData.findOne({ user_id: userId }, (err, data) => {
            if(err)
            {

            }
            else
            {
                if(data)
                {

                }
                else
                {

                }
            }
        });*/
        let embed = new Discord.MessageEmbed().setTitle('You Mined Coal').attachFiles(['./images/ores/CoalOre001.png']).setImage('attachment://CoalOre001.png');
        message.channel.send(embed).catch(err => console.error(err));
	},
};