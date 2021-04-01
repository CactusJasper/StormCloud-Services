let utils = require('../utils.js');
let config = require('../config.js');
let aes256 = require('aes256');
let cipher = aes256.createCipher(config.logger_key);

exports.logMessage = (message, logChannel) => {
    if(message.attachments.array().length > 0)
    {
        let attachments = message.attachments;
        if(message.content == '' || message.content == undefined)
        {
            logChannel.send(utils.codeBlock(`[${message.channel.name}] Attachment sent by  ${message.author.username}:`), attachments.first());
        }
        else
        {
            logChannel.send(utils.codeBlock(`[${message.channel.name}] Message by ${message.author.username}: ${message.content}`), attachments.first());
        }
    }
    else
    {
        logChannel.send(utils.codeBlock(`[${message.channel.name}] Message by ${message.author.username}: ${message.content}`));
    }
}