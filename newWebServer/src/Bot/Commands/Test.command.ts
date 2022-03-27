import { Command, DiscordCommand } from '@discord-nestjs/core';
import { CommandInteraction, MessageEmbed, MessagePayload } from 'discord.js';

@Command({
	name: 'test',
	description: 'Just a test command'
})
export class TestCommand implements DiscordCommand {
	handler(interaction: CommandInteraction): MessagePayload {
		let embed = new MessageEmbed();
		embed.setColor('#FF0000');
		embed.setAuthor('Jasper');
		embed.setTitle('You bot im not finished yet!');
		return new MessagePayload(interaction.channel, { embeds: [embed] })
	}
}