let utils = require('../utils');
let UserData = require('../models/user_data');

module.exports = {
	name: 'leaderboard',
	description: 'Returns the top 10 XP users',
	execute(message, args) {
        UserData.find({}, (err, docs) => {
            if(err)
            {
                console.error(err);
                message.channel.send(utils.codeBlock('Currently Unnable to Display XP Leaders.')).catch((err) => console.error(err));
            }
            else
            {
                if(docs.length > 0)
                {
                    let msg = `================================================== Leaderboard ==================================================\n`;
                    docs.sort((a, b) => {
                        return b.xp - a.xp;
                    });

                    if(docs.length > 10)
                    {
                        for(let i = 0; i < 10; i++)
                        {
                            msg += `${i + 1}. ${docs[i].username}: Level: ${docs[i].level} | Current XP: ${docs[i].xp}\n`;
                        }
                    }
                    else
                    {
                        for(let i = 0; i < docs.length; i++)
                        {
                            msg += `${i + 1}. ${docs[i].username}: Level: ${docs[i].level} | Current XP: ${docs[i].xp}\n`;
                        }
                    }
                    msg += `=================================================================================================================`;
                    message.channel.send(utils.codeBlock(msg)).catch((err) => console.error(err));
                }
                else
                {
                    message.channel.send(utils.codeBlock('Currently Unnable to Display XP Leaders.')).catch((err) => console.error(err));
                }
            }
        });
	},
};