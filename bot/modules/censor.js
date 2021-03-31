function shouldCensor(message) {
    let content = message.content.toLowerCase();

    if(content.includes('wolf') && content.includes('rob'))
    {
        if(content.includes('relation') ||
           content.includes('hurt') ||
           content.includes('abuse') ||
           content.includes('pain') ||
           content.includes('harm') ||
           content.includes('damage'))
        {
            return true;
        }
    }
    
    return false;
}

exports.censorModule = (message) => {
    if(shouldCensor(message))
    {
        message.delete().then((msg) => {
            msg.author.createDM({ force: true }).then((channel) => {
                channel.send('Please can you not mention this topic.').catch((err) => console.error(err));
                return;
            }).catch(err => console.error(err));
        }).catch((err) => console.error(err));
    }
}