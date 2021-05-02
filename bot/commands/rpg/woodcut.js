let utils = require('../../utils');
let RPGData = require('../../models/rpg_data');
const Discord = require('discord.js');
let fs = require('fs');

module.exports = {
	name: 'woodcut',
	description: 'Makes you chop down trees for logs and loot.',
	execute(message, args) {
        let userId = message.author.id;
        let skills = JSON.parse(fs.readFileSync('./rpg_data/skills.json'));
        let resources = JSON.parse(fs.readFileSync('./rpg_data/resources.json'));
        let woodResource = {};

        RPGData.findOne({ user_id: userId }, (err, data) => {
            if(err)
            {
                console.error(err);
                message.channel.send('Woodcutting currently unavailable try again later.').catch(err => console.error(err));
            }
            else
            {
                if(data)
                {
                    // Check if any skills have been added via an update then add default values for new skills
                    if(data.skills.length < skills.length)
                    {
                        let missingSkills = [];
                        let currentSkills = data.skills;
                        skills.forEach(skill => {
                            let exists = false;
                            currentSkills.forEach(curSkill => {
                                if(skill.skill_id == curSkill.skill_id)
                                {
                                    exists = true;
                                }
                            });

                            if(!exists)
                            {
                                missingSkills.push(skill);
                            }
                        });

                        missingSkills.forEach(skill => {
                            data.skills.push(skill);
                        });
                    }

                    let skillLevel = 0;
                    data.skills.forEach(skill => {
                        if(skill.skill_id == 2)
                        {
                            skillLevel = skill.level;
                        }
                    });

                    for(let i = 0; i < resources.length; i++)
                    {
                        if(resources[i].item_id == 17)
                        {
                            woodResource = resources[i];
                        }
                    }

                    // Add later level handles for bonus loot

                    // TODO: handle spliting amounts
                    let amount = utils.getRandomInt(1, woodResource.max_random_amount);
                    let hadSpace = true;
                    let inInvAlready = false;

                    data.inventory.forEach(item => {
                        if(item.item_id == reward.item_id)
                        {
                            if(item.amount + reward.amount <= item.max_amount)
                            {
                                item.amount += reward.amount;
                                inInvAlready = true;
                            }
                            else
                            {
                                inInvAlready = false;
                            }
                        }
                    });

                    if(inInvAlready == false)
                    {
                        if(data.inventory.length < data.inventory_size)
                        {
                            woodResource.amount = amount;
                            rpgData.inventory.push(woodResource);
                        }
                        else
                        {
                            hadSpace = false;
                        }
                    }

                    // Handles Skill Leveling
                    rpgData.skills.forEach(skill => {
                        if(skill.skill_id == 1)
                        {
                            let xpReward = utils.getRandomInt(woodResource.xp_reward.min_reward + (6 * level), woodResource.xp_reward.max_reward + (6 * level));
                            let totalXp = skill.xp + xpReward;
                            let newLevel = skill.level;

                            for(let x = 1; x < skill.max_level; x++)
                            {
                                let nextLevel = skill.level + x
                                if(totalXp >= utils.getRPGXpNeeded(nextLevel))
                                    newLevel = nextLevel;
                            }

                            if(newLevel > skill.level)
                                skill.level = newLevel;

                            skill.xp = totalXp;
                        }
                    });

                    // TODO: Save the data
                }
                else
                {
                    for(let i = 0; i < resources.length; i++)
                    {
                        if(resources[i].item_id == 17)
                        {
                            woodResource = resources[i];
                        }
                    }

                    new RPGData({
                        user_id: message.author.id,
                        skills: skills,
                        inventory: []
                    });

                    woodResource.amount = utils.getRandomInt(1, woodResource.max_random_amount);
                    rpgData.inventory.push(woodResource);

                    // Handles Skill Leveling
                    rpgData.skills.forEach(skill => {
                        if(skill.skill_id == 1)
                        {
                            let xpReward = utils.getRandomInt(woodResource.xp_reward.min_reward + (6 * level), woodResource.xp_reward.max_reward + (6 * level));
                            let totalXp = skill.xp + xpReward;
                            let newLevel = skill.level;

                            for(let x = 1; x < skill.max_level; x++)
                            {
                                let nextLevel = skill.level + x
                                if(totalXp >= utils.getRPGXpNeeded(nextLevel))
                                    newLevel = nextLevel;
                            }

                            if(newLevel > skill.level)
                                skill.level = newLevel;

                            skill.xp = totalXp;
                        }
                    });

                    rpgData.save((err) => {
                        if(err)
                        {
                            console.error(err);
                            message.channel.send('Woodcutting currently unavailable try again later.').catch(err => console.error(err));
                        }
                        else
                        {
                            let embed = new Discord.MessageEmbed().setTitle(`You Cut down a tree`).attachFiles([`./images/${woodResource.image}`]).setImage(`attachment://${woodResource.image.split('/')[1]}`).setFooter(`You recived ${woodResource.amount} x ${woodResource.name}`);
                            message.channel.send(embed).catch(err => console.error(err));
                        }
                    });
                }
            }
        });
    },
}