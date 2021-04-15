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
                    // TODO: Add handeling of items already in the inventory
                    availableOres.forEach(availableOre => {
                        if(availableOre.item_id == rewardItemId)
                        {
                            reward = availableOre;
                            rewardCount = utils.getRandomInt(1, availableOre.max_random_amount);
                            reward.amount = rewardCount;
                            data.inventory.push(reward);
                        }
                    });

                    // Handles Skill Leveling
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
                            console.log(skill);
                        }
                    });

                    // Save All Data
                    data.save((err) => {
                        if(err)
                        {
                            console.error(err);
                        }
                        else
                        {
                            let embed = new Discord.MessageEmbed().setTitle(`You Mined ${reward.name}`).attachFiles([`./images/ores/${reward.image}`]).setImage(`attachment://${reward.image}`).setFooter(`You gained ${rewardCount} x ${reward.name}`);
                            message.channel.send(embed).catch(err => console.error(err));
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
                            let embed = new Discord.MessageEmbed().setTitle(`You Mined ${reward.name}`).attachFiles([`./images/ores/${reward.image}`]).setImage(`attachment://${reward.image}`).setFooter(`You gained ${rewardCount} x ${reward.name}`);
                            message.channel.send(embed).catch(err => console.error(err));
                        }
                    });
                }
            }
        });
        //let embed = new Discord.MessageEmbed().setTitle('You Mined Coal').attachFiles(['./images/ores/CoalOre001.png']).setImage('attachment://CoalOre001.png');
        //message.channel.send(embed).catch(err => console.error(err));
	},
};