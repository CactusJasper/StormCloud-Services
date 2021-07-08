let utils = require('../utils');

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
                    msg += `New System Not Implmented Yet\n`;

                    message.channel.send(utils.codeBlock(msg)).then(() => { }).catch((err) => console.error(err));
                }
            }
        });
	},
};