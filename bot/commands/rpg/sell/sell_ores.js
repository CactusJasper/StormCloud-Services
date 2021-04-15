let utils = require('../../../utils');
let RPGData = require('../../../models/rpg_data');
const Discord = require('discord.js');
let fs = require('fs');

module.exports = {
	name: 'sell_ores',
	description: 'Sells all Ores in your inventory.',
	execute(message, args) {
        let userId = message.author.id;
        let skills = JSON.parse(fs.readFileSync('./rpg_data/skills.json'));
        let ores = JSON.parse(fs.readFileSync('./rpg_data/ores.json'));

        RPGData.findOne({ user_id: userId }, (err, data) => {
            if(err)
            {
                console.error(err);
                message.channel.send('Selling Ores is currently unavailable come back later.').catch((err) => console.error(err));
            }
            else
            {
                if(data)
                {
                    let total = 0;
                    let totalItemsSold = 0;
                    let money = data.money;

                    // Calculate total Sell Price
                    data.inventory.forEach(item => {
                        for(let i = 0; i < ores.length; i++)
                        {
                            if(item.item_id == ores[i].item_id)
                            {
                                let totalForItem = item.sell_price * item.amount;
                                total += totalForItem;
                                totalItemsSold += item.amount;
                            }
                        }
                    });

                    if(total > 0)
                    {
                        money += total;
                        data.money = money;
                        let inventory = data.inventory;

                        // Remove Sold Items
                        for(let i = 0; i < data.inventory.length; i++)
                        {
                            inventory = utils.removeOre(data, ores, i);
                        }

                        data.inventory = inventory;
                        data.markModified('inventory');

                        data.save((err) => {
                            if(err)
                            {
                                console.error(err);
                                message.channel.send('Selling Ores is currently unavailable come back later.').catch((err) => console.error(err));
                            }
                            else
                            {
                                message.channel.send(`You sold ${totalItemsSold} for $${total}. Your new balance is $${money}`).catch((err) => console.error(err));
                            }
                        });
                    }
                    else
                    {
                        message.channel.send('You have no ores to sell come back after mining.').catch(err => console.error(err));
                    }
                }
                else
                {
                    let rpgData = new RPGData({
                        user_id: message.author.id,
                        skills: skills,
                        inventory: []
                    });

                    rpgData.save((err) => {
                        if(err) console.error(err);
                        message.channel.send('You have no ores to sell come back after mining.').catch(err => console.error(err));
                    });
                }
            }
        });
    },
};