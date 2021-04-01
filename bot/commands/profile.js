let utils = require('../utils');
let UserData = require('../models/user_data');

module.exports = {
	name: 'profile',
	description: 'Returns the users profile',
	execute(message, args) {
        UserData.findOne({ user_id: message.author.id }, (err, data) => {
            if(err)
            {
                console.error(err);
            }
            else
            {
                if(data)
                {
                    let msg = `======= ${message.author.username} =======\n`;
                    msg += `Your Level: ${data.level}\n`;
                    msg += `Current XP: ${data.xp}\n`;
                    msg += `XP to Level Up: ${utils.getLevel(data.level + 1)}`;

                    message.channel.send(utils.codeBlock(msg)).then(() => { }).catch((err) => console.error(err));
                }
            }
        });
	},
};