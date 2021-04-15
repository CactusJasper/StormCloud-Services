let fs = require('fs');
let sellOres = require('./sell/sell_ores');

module.exports = {
	name: 'sell',
	description: 'Sells a target catagory of items.',
	execute(message, args) {
        if(args.length == 1)
        {
            if(args[0] == 'ores')
                sellOres.execute(message, args);
            else
                message.channel.send('Please provide a valid catagory of items to sell.').catch(err => console.error(err));
        }
        else
        {
            message.channel.send('Please provide a catagory of items to sell.').catch(err => console.error(err));
        }
    }
};