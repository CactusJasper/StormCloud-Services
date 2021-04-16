let utils = require('../utils');
let fs = require('fs');

module.exports = {
	name: 'kill',
	description: 'Returns a random death message',
	execute(message, args, target, role) {
        let messages = JSON.parse(fs.readFileSync('./death.json'));
        let responseNum = 0;
        
        if(role)
        {
            if(messages[1].length > 1)
                responseNum = utils.getRandomInt(0, messages.length - 1);

            let response = messages[1][responseNum].reason.toString();
            if(typeof message.member.nickname !== "undefined" && message.member.nickname !== null)
                response = response.replace(/%author%/gi, message.member.nickname);
            else
                response = response.replace(/%author%/gi, message.author.username);

            response = response.replace(/%target%/gi, target);

            message.channel.send(response.toString()).catch(err => console.error(err));
        }
        else
        {
            if(messages[0].length > 1)
                responseNum = utils.getRandomInt(0, messages.length - 1);

            let response = messages[0][responseNum].reason.toString();
            if(typeof message.member.nickname !== "undefined" && message.member.nickname !== null)
                response = response.replace(/%author%/gi, message.member.nickname);
            else
                response = response.replace(/%author%/gi, message.author.username);

            response = response.replace(/%target%/gi, target);

            message.channel.send(response.toString()).catch(err => console.error(err));
        }
	},
};