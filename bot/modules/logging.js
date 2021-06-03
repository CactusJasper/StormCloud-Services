let utils = require('../utils.js');
let config = require('../config.js');
let aes256 = require('aes256');
let cipher = aes256.createCipher(config.logger_key);
let ChatLog = require('../models/chat_log');

exports.logMessage = (message, logChannel) => {
    if(message.attachments.array().length > 0)
    {
        let attachments = message.attachments;
        if(message.content == '' || message.content == undefined)
        {
            logChannel.send(utils.codeBlock(`[${message.channel.name}] Attachment sent by  ${message.author.username}:`), attachments.first());
            let attachmentsToSave = [];

            attachments.forEach(attachment => {
                attachmentsToSave.push({
                    id: attachment.id,
                    attachment: attachment.attachment,
                    name: attachment.name,
                    size: attachment.size,
                    url: attachment.url,
                    proxyURL: attachment.proxyURL,
                    height: attachment.height,
                    width: attachment.width
                });
            });

            let log = new ChatLog({
                channelId: message.channel.id,
                channelName: message.channel.name,
                authorId: message.author.id,
                authorName: message.author.username,
                attachments: attachmentsToSave
            });

            log.save((err) => {
                if(err) console.error(err);
            });
        }
        else
        {
            logChannel.send(utils.codeBlock(`[${message.channel.name}] Message by ${message.author.username}: ${message.content}`), attachments.first());

            let attachmentsToSave = [];

            attachments.forEach(attachment => {
                attachmentsToSave.push({
                    id: attachment.id,
                    attachment: attachment.attachment,
                    name: attachment.name,
                    size: attachment.size,
                    url: attachment.url,
                    proxyURL: attachment.proxyURL,
                    height: attachment.height,
                    width: attachment.width
                });
            });

            let log = new ChatLog({
                channelId: message.channel.id,
                channelName: message.channel.name,
                chatMessage: message.content,
                authorId: message.author.id,
                authorName: message.author.username,
                attachments: attachmentsToSave
            });
    
            log.save((err) => {
                if(err) console.error(err);
            });
        }
    }
    else
    {
        logChannel.send(utils.codeBlock(`[${message.channel.name}] Message by ${message.author.username}: ${message.content}`));
        let log = new ChatLog({
            channelId: message.channel.id,
            channelName: message.channel.name,
            chatMessage: message.content,
            authorId: message.author.id,
            authorName: message.author.username
        });

        log.save((err) => {
            if(err) console.error(err);
        });
    }
}