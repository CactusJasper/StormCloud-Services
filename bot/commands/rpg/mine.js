let utils = require('../../utils');
let RPGData = require('../../models/rpg_data');
const Discord = require('discord.js');
let fs = require('fs');

module.exports = {
	name: 'mine',
	description: 'Makes you mine for ore.',
	execute(message, args) {
        let userId = message.author.id;
        let skills = JSON.parse(fs.readFileSync('./rpg_data/skills.json'));
        let ores = JSON.parse(fs.readFileSync('./rpg_data/ores.json'));
        let availableOres = [];

        RPGData.findOne({ user_id: userId }, (err, data) => {
            if(err)
            {
                console.error(err);
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
                        if(skill.skill_id == 1)
                        {
                            skillLevel = skill.level;
                        }
                    });

                    for(let i = 0; i < ores.length; i++)
                    {
                        if(ores[i].min_skill.min_level <= skillLevel)
                        {
                            availableOres.push(ores[i]);
                        }
                    }

                    let chances = [];
                    for(let i = 0; i < availableOres.length; i++)
                    {
                        let chance = utils.getRandomInt(0, 100);
                        let ore = availableOres[i];
                        ore.chance = chance;
                        chances.push(ore);
                    }

                    chances.sort((a, b) => {
                        return a.chance - b.chance;
                    });

                    let rewardItemId = chances[utils.getRandomInt(0, chances.length - 1)].item_id;
                    let reward = {};
                    let rewardCount = 1;

                    // Calculates Ore Reward
                    let hadSpace = true;
                    availableOres.forEach(availableOre => {
                        if(availableOre.item_id == rewardItemId)
                        {
                            reward = availableOre;
                            rewardCount = utils.getRandomInt(1, availableOre.max_random_amount);
                            reward.amount = rewardCount;
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
                                    data.inventory.push(reward);
                                }
                                else
                                {
                                    hadSpace = false;
                                }
                            }
                        }
                    });

                    // Handles Skill Leveling
                    if(hadSpace)
                    {
                        data.skills.forEach(skill => {
                            if(skill.skill_id == 1)
                            {
                                let xpReward = utils.getRandomInt(reward.xp_reward.min_reward, reward.xp_reward.max_reward);
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
                    }

                    // Save All Data
                    data.save((err) => {
                        if(err)
                        {
                            console.error(err);
                        }
                        else
                        {
                            if(hadSpace)
                            {
                                let embed = new Discord.MessageEmbed().setTitle(`You Mined ${reward.name}`).attachFiles([`./images/${reward.image}`]).setImage(`attachment://${reward.image.split('/')[1]}`).setFooter(`You gained ${rewardCount} x ${reward.name}`);
                                message.channel.send(embed).catch(err => console.error(err));
                            }
                            else
                            {
                                message.channel.send(`You don't have any space left in your inventory.\nSell items or upgrade your inventory.`).catch(err => console.error(err));
                            }
                        }
                    });
                }
                else
                {
                    for(let i = 0; i < ores.length; i++)
                    {
                        if(ores[i].min_skill.min_level == 0)
                        {
                            availableOres.push(ores[i]);
                        }
                    }

                    let rpgData = new RPGData({
                        user_id: message.author.id,
                        skills: skills,
                        inventory: []
                    });

                    let chances = [];
                    for(let i = 0; i < availableOres.length; i++)
                    {
                        let chance = utils.getRandomInt(0, 100);
                        let ore = availableOres[i];
                        ore.chance = chance;
                        chances.push(ore);
                    }

                    chances.sort((a, b) => {
                        return a.chance - b.chance;
                    });

                    let rewardItemId = chances[utils.getRandomInt(0, chances.length - 1)].item_id;
                    let reward = {};
                    let rewardCount = 1;

                    // Calculates Ore Reward
                    availableOres.forEach(availableOre => {
                        if(availableOre.item_id == rewardItemId)
                        {
                            reward = availableOre;
                            rewardCount = utils.getRandomInt(1, availableOre.max_random_amount);
                            reward.amount = rewardCount;
                            rpgData.inventory.push(reward);
                        }
                    });

                    // Handles Skill Leveling
                    rpgData.skills.forEach(skill => {
                        if(skill.skill_id == 1)
                        {
                            let xpReward = utils.getRandomInt(reward.xp_reward.min_reward, reward.xp_reward.max_reward);
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

                    // Save All Data
                    rpgData.save((err) => {
                        if(err)
                        {
                            console.error(err);
                        }
                        else
                        {
                            let embed = new Discord.MessageEmbed().setTitle(`You Mined ${reward.name}`).attachFiles([`./images/${reward.image}`]).setImage(`attachment://${reward.image.split('/')[1]}`).setFooter(`You gained ${rewardCount} x ${reward.name}`);
                            message.channel.send(embed).catch(err => console.error(err));
                        }
                    });
                }
            }
        });
	},
};